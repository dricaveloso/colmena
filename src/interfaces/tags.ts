export interface OCSMetaDefaultInterface {
  status: string;
  statuscode: number;
  message: string;
}

export interface SWRDefaultOptionsInterface {
  error: any;
  mutate: (data?: any, shouldRevalidate?: boolean | undefined) => Promise<any>;
}

export interface ListAllInterface extends SWRDefaultOptionsInterface {
  data: {
    ocs: {
      meta: OCSMetaDefaultInterface;
      data: {
        groups: string[];
      };
    };
  };
}
// export interface CreateTagInterface extends SWRDefaultOptionsInterface {
//   data: {
//     ocs: {
//       meta: OCSMetaDefaultInterface;
//       data: {
//         groups: string[];
//       };
//     };
//   };
// }
