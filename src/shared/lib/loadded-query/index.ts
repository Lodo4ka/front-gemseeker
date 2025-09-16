// import { Query } from "@farfetched/core";
// import { createFactory } from "@withease/factories";
// import { createEvent, sample, Unit } from "effector";

// interface loaddedQueryProps<Params, Data, Error> {
//     queryApi: Query<Params, Data, Error>
//     source?: Record<string, Unit<any>>
// }

// export const loaddedQuery = createFactory(<Params, Data, Error>({
//     queryApi,
//     source
// }: loaddedQueryProps<Params, Data, Error>) => {
//   const loaddedData = createEvent();

//   if(source) {
//     sample({
//       // @ts-ignore
//       clock: loaddedData,
//       source,
//       fn: (source: Record<string, any>) => source,
//       target: queryApi.start
//     });
//   } else {
//     sample({
//       clock: loaddedData,
//       target: queryApi.start
//     });
//   }
// })