import { RefferalsResponse } from "shared/api/queries/user/referrals";

type ReferInfo = {
  title: string;
  key: keyof RefferalsResponse;
};
export type ReferInfoList = ReferInfo[];
