export type PauseVariant =
  | 'all'
  | 'rocket'
  | 'recent_tx'
  | 'activity'
  | 'market'
  | 'streams_10'
  | 'streams'
  | 'pump_new_creation'
  | 'pump_completing'
  | 'pump_completed'
  | 'trending';

export type PauseState = PauseVariant | null;
