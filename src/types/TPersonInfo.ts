export type TPersonInfo = {
  ok: boolean;
  message?: string;
  data?: {
    id: string;
    firstName: string;
    middleName: string;
    lastName: string;
  };
}
