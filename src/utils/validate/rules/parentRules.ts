import { NVal } from '~/utils/validate/types'
import { idValidate } from '~/utils/validate/idValidate'

export const parentRules: NVal.TRules = {
  id: {
    isRequired: true,
    validate: idValidate,
  },
  type: {
    isRequired: true,
    validate: (val, parentIndex) => {
      const res: NVal.TValidationResut = { ok: true }
      if (!(val === 'blood')) {
        res.ok = false
        res.reason = typeof parentIndex === 'number'
          ? `incorrect person.parent.type for index ${parentIndex} (should be "blood")`
          : 'incorrect person.parent.type'
      }
      return res
    },
  },
}
