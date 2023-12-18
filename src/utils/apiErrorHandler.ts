import { NVal } from "./validate"

export const apiErrorHandler = ({ validateFn }: { validateFn: (j: any) => NVal.TValidationResut }) => (json: any): Promise<any> => {
  // TODO: v2: Better way when api will return something like this: { ok: boolean; message?: string; data?: person[]; }
  // switch (true) {
  //   case json?.ok && json?.data: {
  //     const validation = validateFn(json.data)
  //     if (validation.ok) return Promise.resolve(json.data)
  //     return Promise.reject(validation.reason || 'API ERR #1')
  //   }
  //   default: return Promise.reject(json?.message || 'API ERR #2')
  // }
  // NOTE: v1: Check response as target json
  switch (true) {
    case !!json: {
      const validation = validateFn(json)
      if (validation.ok) return Promise.resolve(json)
      throw new Error(validation.reason || 'API ERR #2')
    }
    default: throw new Error(`API ERR #3 incorrect json (${typeof json})`)
  }
}
