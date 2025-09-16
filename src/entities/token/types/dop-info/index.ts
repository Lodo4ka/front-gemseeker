export type BatchItem = { type: 'creator' | 'address'; value: string };
export type DopInfo = {
  topHolders: number | null;
  creator: number | null;
  insiders: number | null;
  snipers: number | null;
};
export type TokenDopInfoObject = Record<string, DopInfo>;
