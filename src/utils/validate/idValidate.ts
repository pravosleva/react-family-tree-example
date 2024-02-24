import { NVal } from './types'

export const idValidate = ({
  val,
  index: idx
}: any) => {
  const res: NVal.TValidationResut = { ok: true }
  if (!val || typeof val !== 'string') {
    res.ok = false
    res.reason = typeof idx === 'number'
      ? `incorrect id for index ${idx} (should be not empty string)`
      : 'incorrect id (should be not empty string)'
  }
  return res
}
