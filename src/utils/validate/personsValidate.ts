import { NVal } from './types'
import { checkRules } from './checkRules'
import { personRules } from '~/utils/validate/rules'

export const personsValidate = (persons: any): NVal.TValidationResut => {
  const res: NVal.TValidationResut = { ok: true }
  const errs = []
  switch (true) {
    case !Array.isArray(persons):
      errs.push('persons should be an Array')
      break
    case persons.length === 0:
      errs.push('persons Array should be not empty')
      break
    default: {
      let c = 0
      for (const person of persons) {
        const validate = checkRules({
          rules: personRules,
          tested: person,
          index: c,
        })
        if (!validate.ok) errs.push(validate.reason || `incorect index ${c} (no reason)`)
        c += 1
      }
      break
    }
  }
  if (errs.length > 0) {
    res.ok = false
    res.reason = `Incorrect persons array: ${errs.join(', ')}`
  }
  return res
}
