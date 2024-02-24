import { NVal } from '~/utils/validate/types'
import { idValidate } from '~/utils/validate/idValidate'

export const parentRules: NVal.TRules = {
  id: {
    isRequired: true,
    validate: idValidate,
  },
  type: {
    isRequired: true,
    validate: ({
      val,
      index: parentIndex,
      tested,
    }) => {
      const res: NVal.TValidationResut = { ok: true }
      const possibleValues = ['blood']
      if (!possibleValues.includes(val)) {
        res.ok = false
        res.reason = typeof parentIndex === 'number'
          ? `incorrect person.parent.type for [id:${tested.id}] parent index ${parentIndex} (should be: ${possibleValues.join('|')}, received: ${val})`
          : 'incorrect person.parent.type'
      }
      return res
    },
  },
}
