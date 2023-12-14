// export type TPersonInfo = {
//   ok: boolean;
//   message?: string;
//   data?: {
//     id: string;
//     customService?: {
//       baseInfo: {
//         id: string;
//         firstName: string;
//         middleName: string;
//         lastName: string;
//       };
//     };
//     googleSheets?: {
//       mainGallery: {
//         url: string;
//         descr?: string;
//       }[];
//     };
//   };
// }

type TMainGalleryItem = {
  url: string;
  descr?: string;
}
export type TPresonDataResponse = {
  ok: boolean;
  message?: string;
  data: {
    id: string;
    customService?: {
      ok: boolean;
      data: {
        baseInfo: {
          id: string;
          firstName: string;
          middleName: string;
          lastName: string;
        };
      };
    };
    googleSheets?: {
      ok: boolean;
      data: {
        ok: boolean;
        message?: string;
        id: string;
        mainGallery: TMainGalleryItem[];
      };
    };
  };
}
