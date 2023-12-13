import { idValidate } from '~/utils/validate/idValidate';

it('idValidate: ok', () => {
  const tested = idValidate('1')
  const expected = { ok: true }

  expect(tested).toEqual(expected)
})

it('idValidate: not ok (number)', () => {
  const tested = idValidate(1)
  const expected = { ok: false, reason: 'incorrect id (should be not empty string)' }

  expect(tested).toEqual(expected)
})

it('idValidate: not ok (undefined)', () => {
  const tested = idValidate()
  const expected = { ok: false, reason: 'incorrect id (should be not empty string)' }

  expect(tested).toEqual(expected)
})
