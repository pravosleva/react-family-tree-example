export type TPersonInfo = {
  ok: boolean;
  message?: string;
  data?: {
    id: string;
    customService?: {
      baseInfo: {
        id: string;
        firstName: string;
        middleName: string;
        lastName: string;
      };
    };
    googleSheets?: {
      mainGallery: {
        url: string;
        descr?: string;
      }[];
    };
  };
}
