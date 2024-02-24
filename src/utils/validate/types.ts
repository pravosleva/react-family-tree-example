export namespace NVal {
  export type TValidationResut = {
    ok: boolean;
    reason?: string;
  };
  export type TRules = {
    [key: string]: {
      isRequired: boolean;
      validate?: ({ val, index, tested }: {
        val: any;
        index?: number;
        tested: any;
      }) => TValidationResut;
    };
  };
}
