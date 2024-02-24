import { NVal } from './types'

export const checkRules = ({ rules, tested, index }: {
  rules: NVal.TRules;
  tested: any;
  index?: number;
}): NVal.TValidationResut => {
  const res: NVal.TValidationResut = { ok: true }
  for (const key in rules) {
    switch (true) {
      case rules[key].isRequired && !tested?.[key]:
        res.ok = false
        res.reason = `key "${key}" is required for index "${index}"`
        break
      case !!tested?.[key] && !!rules[key].validate && typeof rules[key]?.validate === 'function': {
        // @ts-ignore
        const validate = rules[key].validate({ val: tested[key], index, tested })
        if (!validate.ok) {
          res.ok = false
          res.reason = validate.reason || `incorrect key "${key}"`
        }
        break
      }
      default: break
    }
  }
  return res
}
