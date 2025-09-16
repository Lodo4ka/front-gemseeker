export const MODAL_KEYS = {
  advancedSettings: 'ADVANCED_SETTINGS_MODAL_KEY',
};

export interface TokenMarketInfoPercentsProps {
  top10holdersPercent?: number;
  snipersPercent?: number;
  insedersPercent?: number;
  creatorPercent?: number;
}

export const percentRegex = /^(100|[0-9]|[1-9][0-9]|[0-9]\.[0-9]+|[1-9][0-9]\.[0-9]+|0\.[0-9]+)%?$/;
