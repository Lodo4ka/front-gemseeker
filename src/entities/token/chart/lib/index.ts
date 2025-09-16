import {
  IDatafeedChartApi,
  DatafeedConfiguration,
  LibrarySymbolInfo,
  ResolutionString,
  PeriodParams,
  Bar,
  HistoryCallback,
  DatafeedErrorCallback,
  SearchSymbolResultItem,
} from 'charting_library';
import { baseUrl } from 'shared/lib/base-url';

export class CryptoDatafeed implements IDatafeedChartApi {
  private resolutionMap: { [key: string]: number } = {
    '1': 1,
    '5': 5,
    '15': 15,
    '30': 30,
    '60': 60,
    D: 1440,
    W: 10080,
    M: 43200,
  };

  private nameToken: string;
  private addressToken: string;
  private subscriptions: Map<string, { symbol: string; resolution: ResolutionString; callback: (bar: Bar) => void }> =
    new Map();
  private barsCache = new Map<string, Bar>();
  private lastBarsCache = new Map<string, Bar>();

  constructor({ nameToken, addressToken }: { nameToken: string; addressToken: string }) {
    this.nameToken = nameToken;
    this.addressToken = addressToken;
  }

  onReady(callback: (config: DatafeedConfiguration) => void): void {
    const configurationData: DatafeedConfiguration = {
      supported_resolutions: ['1', '5', '15', '30', '60', 'D', 'W', 'M'] as ResolutionString[],
      exchanges: [{ value: '', name: 'Crypto', desc: 'Crypto Exchange' }],
      symbols_types: [{ name: 'crypto', value: 'crypto' }],
    };
    setTimeout(() => callback(configurationData), 0);
  }

  searchSymbols(
    userInput: string,
    _exchange: string,
    _symbolType: string,
    onResult: (result: SearchSymbolResultItem[]) => void,
  ): void {
    setTimeout(() => onResult([]), 0);
  }

  resolveSymbol(
    symbolName: string,
    onResolve: (symbolInfo: LibrarySymbolInfo) => void,
    onError: (error: string) => void,
  ): void {
    if (!symbolName) {
      setTimeout(() => onError('Invalid symbol'), 0);
      return;
    }
    const symbolInfo: LibrarySymbolInfo = {
      ticker: symbolName,
      name: symbolName,
      description: this.nameToken,
      type: 'crypto',
      session: '24x7',
      timezone: 'Etc/UTC',
      exchange: '',
      listed_exchange: '',
      format: 'price',
      minmov: 1,
      pricescale: 100000000,
      has_intraday: true,
      intraday_multipliers: ['1', '5', '15', '30', '60'],
      has_daily: true,
      has_weekly_and_monthly: true,
      // supported_resolutions: ['1', '5', '15', '30', '60', 'H', 'D', 'W', 'M',] as ResolutionString[],
      volume_precision: 8,
      data_status: 'streaming',
    };
    setTimeout(() => onResolve(symbolInfo), 0);
  }

  getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: DatafeedErrorCallback,
  ): void {
    const { from, to, firstDataRequest } = periodParams;
    console.log('this.addressToken', periodParams);
    fetch(baseUrl(`/tx/price-chart?token_address=${this.addressToken}&from=${from}&to=${to}&currency=USD`))
      .then((response) => {
        if (!response.ok) throw new Error('Network response was not ok');
        return response.json() as Promise<
          Array<{
            timestamp: number;
            rate: number;
            type: 'BUY' | 'SELL';
          }>
        >;
      })
      .then((data) => {
        if (!data || data.length === 0) {
          onHistoryCallback([], { noData: true });
          return;
        }

        let bars: Bar[] = [];
        const chartData = [...data].reverse();
        let prev = 0;

        chartData.forEach((bar) => {
          const time = new Date(bar.timestamp * 1000).getTime() / 1000;
          if (prev === 0) {
            prev = bar.rate;
          } else {
            if (bar.type === 'SELL') {
              bars = [
                ...bars,
                {
                  time: time * 1000,
                  low: bar.rate,
                  high: prev,
                  open: prev,
                  close: bar.rate,
                },
              ];
            } else {
              bars = [
                ...bars,
                {
                  time: time * 1000,
                  low: prev,
                  high: bar.rate,
                  open: prev,
                  close: bar.rate,
                },
              ];
            }
            prev = bar.rate;
          }
        });

        if (bars.length === 0) {
          onHistoryCallback([], { noData: true });
          return;
        }

        // Add current bar with current time
        const lastBarData = bars[bars.length - 1];
        if (lastBarData) {
          const lastBar: Bar = {
            time: Date.now(),
            open: lastBarData.open,
            high: lastBarData.high,
            low: lastBarData.low,
            close: lastBarData.close,
            volume: lastBarData.volume,
          };
          bars.push(lastBar);

          if (firstDataRequest) {
            // Cache the last bar for real-time updates
            this.lastBarsCache.set(symbolInfo.name, { ...lastBar });
          } else {
            onHistoryCallback([], { noData: true });
            return;
          }
        }

        onHistoryCallback(bars, { noData: false });
      })
      .catch((error) => {
        console.error('[getBars]: Error fetching data', error);
        onErrorCallback(error.message);
      });
  }

  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: (bar: Bar) => void,
    subscriberUID: string,
    onResetCacheNeededCallback: () => void,
  ): void {
    this.subscriptions.set(subscriberUID, {
      symbol: symbolInfo.name,
      resolution,
      callback: onRealtimeCallback,
    });
  }

  unsubscribeBars(subscriberUID: string): void {
    this.subscriptions.delete(subscriberUID);
  }

  // Публичный метод для обработки WebSocket сообщений
  handleWebSocketMessage(event: MessageEvent): void {
    try {
      const trade = JSON.parse(event.data);

      // Check if this is a heartbeat message
      if (trade?.type === 'heartbeat' || trade.token_info?.address !== this.addressToken) return;

      const rate = +(localStorage.getItem('rate') ?? 0);
      if (!rate || rate <= 0) return;

      console.log('success');
      this.subscriptions.forEach((sub, uid) => {
        const resMin = this.resolutionMap[sub.resolution] || 5;
        const period = resMin * 60; // Convert to seconds

        // Calculate the current bar time based on resolution
        const ts = trade.timestamp > 1e12 ? Math.floor(trade.timestamp / 1000) : trade.timestamp;
        const barTime = Math.floor(ts / period) * period * 1000;

        const lastBar = this.lastBarsCache.get(sub.symbol);
        if (!lastBar) return;

        const price = trade.rate * rate;
        const currentTime = Date.now();

        // Check if we should update existing bar or create new one
        const timeDiff = currentTime - lastBar.time;
        const resolutionMs = resMin * 60 * 1000;

        let newBar: Bar;

        if (timeDiff < resolutionMs && lastBar.time > 0) {
          // Update existing bar within the same time period
          newBar = {
            time: lastBar.time, // Keep the same time
            open: lastBar.open, // Keep the same open
            high: Math.max(lastBar.high, price),
            low: Math.min(lastBar.low, price),
            close: price,
          };
        } else {
          newBar = {
            time: barTime,
            open: lastBar.close, // Open with previous close
            high: price,
            low: price,
            close: price,
          };
        }

        // Update cache
        this.lastBarsCache.set(sub.symbol, newBar);

        // Send update to chart
        sub.callback(newBar);
      });
    } catch (error) {
      console.error('[handleWebSocketMessage]: Error parsing message', error);
    }
  }
}
