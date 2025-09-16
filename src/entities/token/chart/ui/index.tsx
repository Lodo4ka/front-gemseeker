import { memo, RefObject, useEffect, useRef, useMemo, useCallback } from 'react';
import {
  widget,
  ChartingLibraryWidgetOptions,
  ResolutionString,
  IChartingLibraryWidget,
  EntityId,
} from 'charting_library';
import { Skeleton } from 'shared/ui/skeleton';
import { Resizable } from 'shared/ui/resizable';
import { CryptoDatafeed } from '../lib';
import { linePlaced, setLineRef, $lineRef, $lineDiff, clearLine, updateLinePrice } from '../model';
import { useUnit } from 'effector-react';

import { api } from 'shared/api';
import { $token } from '../../model';
import { Tabs } from 'shared/ui/tabs';

const defaultProps = {
  symbol: 'BTC',
  interval: '15' as ResolutionString,
  datafeedUrl: 'https://demo_feed.tradingview.com',
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
};

const ChartDefault = memo(() => {
  const chartContainerRef = useRef<HTMLElement>(null);
  const [token, socket] = useUnit([$token, api.sockets.token.$socket]);
  const widgetRef = useRef<IChartingLibraryWidget | null>(null);
  const targetLineRef = useRef<EntityId | null>(null);
  const datafeedRef = useRef<CryptoDatafeed | null>(null);

  // храним актуальные baseline в ref, чтобы onMove всегда считал от свежих значений
  const baselinePriceRef = useRef<number | null>(null);
  const baselineMcapRef = useRef<number | null>(null);

  useEffect(() => {
    // подставь реальные поля цены и mcap из твоего стора
    const price = token?.rate ?? null;
    const mcap = token?.mcap ?? null;
    if (typeof price === 'number') baselinePriceRef.current = price;
    if (typeof mcap === 'number') baselineMcapRef.current = mcap;
  }, [token]);

  const datafeed = useMemo(() => {
    if (!token) return null;

    const newDatafeed = new CryptoDatafeed({
      nameToken: token.name,
      addressToken: token.address,
    });

    datafeedRef.current = newDatafeed;
    return newDatafeed;
  }, [token?.address]);

  const handleWebSocketMessage = useCallback(
    (event: MessageEvent) => {
      if (!datafeedRef.current || !socket || socket.readyState !== WebSocket.OPEN) return;

      try {
        const trade = JSON.parse(event.data);

        if (trade?.type === 'heartbeat' || trade.token_info?.address !== token?.address) return;

        const rate = +(localStorage.getItem('rate') ?? 0);
        if (!rate || rate <= 0) return;

        datafeedRef.current.handleWebSocketMessage(event);
      } catch (error) {
        console.error('[Chart] Error handling WebSocket message:', error);
      }
    },
    [token?.address, socket],
  );

  useEffect(() => {
    if (!socket || !datafeedRef.current) return;

    socket.addEventListener('message', handleWebSocketMessage);

    return () => {
      socket.removeEventListener('message', handleWebSocketMessage);
    };
  }, [socket, handleWebSocketMessage]);

  // === ФУНКЦИЯ: добавить/переинициализировать target line ===
  const addTargetLine = useCallback(async () => {
    if (!widgetRef.current) return;

    const currentPrice = baselinePriceRef.current;
    const currentMcap = baselineMcapRef.current;

    if (!currentPrice || !currentMcap) {
      console.warn('[addTargetLine] Missing currentPrice or currentMcap');
      return;
    }

    if (targetLineRef.current) {
      try {
        targetLineRef.current;
      } catch {}
      targetLineRef.current = null;
    }

    const widget = widgetRef.current;

    widget.onChartReady(async () => {
      const chart = widget.activeChart();
      chart.createOrderLine();
      chart.onDataLoaded().subscribe(
        null,
        async () => {
          const shape = await chart.createShape(
            { time: Date.now() / 1000 }, // координаты старта
            {
              shape: 'horizontal_line',
              text: `Target MCAP (0.00%)`,
              disableSelection: false,
              disableSave: true,
              lock: false,
              overrides: {
                linecolor: '#22c55e',
                linewidth: 2,
              },
            },
          );

          console.log(shape);

          targetLineRef.current = shape;
          setLineRef(shape);
        },
        true,
      );

      // Ловим изменения позиции
      // (await shape).onShapeChanged().subscribe(null, () => {
      //   const points = shape.getPoints();
      //   const newPrice = points[0].price;
      //   console.log('Новая цена линии:', newPrice);
      // });
    });

    // linePlaced?.(); // если событие есть — дергаем, иначе можешь удалить
  }, []);

  // Инициализация виджета
  useEffect(() => {
    if (!datafeed || !chartContainerRef.current || widgetRef.current) return;

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol,
      datafeed,
      interval: defaultProps.interval,
      container: chartContainerRef.current as HTMLElement,
      library_path: defaultProps.libraryPath,
      theme: 'dark',
      locale: 'en',
      disabled_features: [
        'left_toolbar',
        'header_widget',
        'header_symbol_search',
        'header_compare',
        'header_indicators',
        'header_settings',
        'header_undo_redo',
        'header_screenshot',
        'header_fullscreen_button',
        'header_saveload',
        'header_chart_type',
        'create_volume_indicator_by_default',
        'control_bar',
      ],
      overrides: {
        'paneProperties.background': '#131722',
        'paneProperties.backgroundType': 'solid',
      },
      enabled_features: ['timeframes_toolbar'],
      time_frames: [
        { text: '1m', resolution: '1' as ResolutionString },
        { text: '5m', resolution: '5' as ResolutionString },
        { text: '1D', resolution: 'D' as ResolutionString },
        { text: '7D', resolution: '30' as ResolutionString },
        { text: '30D', resolution: '60' as ResolutionString },
        { text: '180D', resolution: '180' as ResolutionString },
      ],
      charts_storage_url: defaultProps.chartsStorageUrl,
      charts_storage_api_version: '1.1' as const,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: {
        ...defaultProps.studiesOverrides,
        'volume.volume.visible': false,
      },
    };

    try {
      const tvWidget = new widget(widgetOptions);
      widgetRef.current = tvWidget;

      tvWidget.onChartReady(() => {
        tvWidget.applyOverrides({
          'paneProperties.backgroundType': 'solid',
          'paneProperties.background': '#131722',
        });

        // при готовности графика — если есть baseline, сразу создаём линию

        // if (baselinePriceRef.current && baselineMcapRef.current) {
        addTargetLine();
        // }
      });
    } catch (error) {
      console.error('[ChartDefault] Error creating widget:', error);
    }

    return () => {
      if (widgetRef.current) {
        widgetRef.current.remove();
        widgetRef.current = null;
      }
    };
  }, [datafeed, addTargetLine]);

  // по изменению актуальной цены/капитализации можно пересоздавать линию
  // (если хочешь, закомментируй, чтобы не мигала)
  // useEffect(() => {
  //   if (widgetRef.current && baselinePriceRef.current && baselineMcapRef.current && targetLineRef.current == null) {
  //     addTargetLine();
  //   }
  // }, [token?.mcap, token?.rate, addTargetLine]);

  return (
    <Resizable
      minHeight={100}
      initialHeight={476}
      className={{ container: 'max-2lg:!h-[360px] overflow-hidden rounded-xl', nav: 'max-2lg:hidden' }}>
      <div ref={chartContainerRef as RefObject<HTMLDivElement>} className={'h-full w-full'} />
    </Resizable>
  );
});

const ChartGeckoTerminal = () => {
  const token = useUnit($token);
  const adressPool = token?.pool ?? '';
  return (
    <Resizable
      minHeight={100}
      initialHeight={476}
      className={{ container: 'max-2lg:!h-[360px] overflow-hidden rounded-xl', nav: 'max-2lg:hidden' }}>
      <iframe
        height="100%"
        width="100%"
        id="geckoterminal-embed"
        title="GeckoTerminal Graph"
        src={`https://www.geckoterminal.com/ru/solana/pools/${adressPool}?embed=1&info=0&swaps=0&grayscale=0&light_chart=0&chart_type=price&resolution=15m`}
        frameBorder="0"
        allow="clipboard-write"
        allowFullScreen
      />
    </Resizable>
  );
};

export const Chart = () => {
  const token = useUnit($token);
  if (token?.trade_finished) {
    return (
      <Tabs
        controllers={[
          {
            children: 'Geckoterminal',
            name: 'geckoterminal',
          },
          {
            children: 'Gemseeker',
            name: 'gemseeker',
          },
        ]}
        queryParamName="type_chart"
        contents={[<ChartGeckoTerminal />, <ChartDefault />]}
      />
    );
  }
  return <ChartDefault />;
};

export const ChartFallback = () => {
  return <Skeleton isLoading className={'!bg-darkGray-1 h-[470px] w-full overflow-hidden rounded-xl'} />;
};
