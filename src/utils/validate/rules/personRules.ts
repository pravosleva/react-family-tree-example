import { NVal } from '~/utils/validate/types'
import { idValidate } from '~/utils/validate/idValidate'
import { checkRules } from '~/utils/validate/checkRules'
import { parentRules } from './parentRules'

const parentsValidate = (arr: any[], index?: number) => {
  const res: NVal.TValidationResut = { ok: true }
  const errs = []
  let _parentIndex = 0
  for (const parent of arr) {
    const validate = checkRules({
      rules: parentRules,
      tested: parent,
      index: _parentIndex,
    })
    if (!validate.ok) errs.push(`${validate.reason || `incorect parent index ${_parentIndex} (no reason)`}`)
    _parentIndex += 1
  }
  if (errs.length > 0) {
    res.ok = false
    res.reason = typeof index === 'boolean'
      ? `Person index ${index} err: Incorrect parents array: ${errs.join(', ')}`
      : `Person err <- Incorrect parents array <- ${errs.join(', ')}`
  }
  return res
}

export const personRules: NVal.TRules = {
  id: {
    isRequired: true,
    validate: idValidate,
  },
  gender: {
    isRequired: true,
    validate: (val, idx) => {
      const res: NVal.TValidationResut = { ok: true }
      if (!(val === 'male' || val === 'female')) {
        res.ok = false
        res.reason = typeof idx === 'number'
          ? `incorrect person.gender for index ${idx} (should be "male" or "female")`
          : 'incorrect person.gender'
      }
      return res
    },
  },
  parents: {
    isRequired: true,
    validate: parentsValidate,
  },
  children: {
    isRequired: true,
    validate: (val, idx) => {
      const res: NVal.TValidationResut = { ok: true }
      switch (true) {
        case !Array.isArray(val):
          res.ok = false
          res.reason = typeof idx === 'number'
            ? `incorrect person.children for index ${idx} (should be an Array)`
            : 'incorrect person.children'
          break
        // TODO: Check each item...
        default: break
      }
      return res
    },
  },
  siblings: {
    isRequired: true,
  },
  spouses: {
    isRequired: true,
  },
}
