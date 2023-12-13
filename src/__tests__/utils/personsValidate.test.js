import { personsValidate } from '~/utils/validate';

it('idValidate #0: not ok (persons is empty array)', () => {
  const tested = personsValidate([])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: persons Array should be not empty',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #1: not ok (persons is undefined)', () => {
  const tested = personsValidate()
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: persons should be an Array',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #2: not ok (id is number)', () => {
  const tested = personsValidate([
    {
      id: 1,
      gender: 'male',
      spouses: [],
      children: [],
      parents: [],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: incorrect id for index 0 (should be not empty string)',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #3: not ok (incorrect gender)', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'incorrect',
      spouses: [],
      children: [],
      parents: [],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: incorrect person.gender for index 0 (should be \"male\" or \"female\")',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #4: not ok (incorrect parent format: empty object)', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'incorrect',
      spouses: [],
      children: [],
      parents: [
        {},
      ],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: Person err: Incorrect parents array: key \"type\" is required for index \"0\"',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #5: not ok (incorrect parent format: incorrect type only)', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'incorrect',
      spouses: [],
      children: [],
      parents: [
        {
          type: 'incorrect',
        },
      ],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: Person err: Incorrect parents array: incorrect person.parent.type for index 0 (should be \"blood\")',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #6: not ok (incorrect parent format: no id for parent)', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'incorrect',
      spouses: [],
      children: [],
      parents: [
        {
          type: 'blood',
        },
      ],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: Person err: Incorrect parents array: key \"id\" is required for index \"0\"',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #7: not ok (no id for first parent)', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'male',
      spouses: [],
      children: [],
      parents: [
        {
          type: 'blood',
        },
        {
          id: '1.2',
          type: 'blood',
        },
      ],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: Person err: Incorrect parents array: key \"id\" is required for index \"0\"',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #8: not ok (no id for 2nd parent)', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'male',
      spouses: [],
      children: [],
      parents: [
        {
          id: '1.1',
          type: 'blood',
        },
        { 
          type: 'blood',
        },
      ],
      siblings: [],
    },
  ])
  const expected = {
    ok: false,
    reason: 'Incorrect persons array: Person err: Incorrect parents array: key \"id\" is required for index \"1\"',
  }

  expect(tested).toEqual(expected)
})

it('idValidate #9: ok', () => {
  const tested = personsValidate([
    {
      id: '1',
      gender: 'male',
      spouses: [],
      children: [],
      parents: [
        {
          id: '1.1',
          type: 'blood',
        },
        {
          id: '1.2',
          type: 'blood',
        },
      ],
      siblings: [],
    },
  ])
  const expected = {
    ok: true,
  }

  expect(tested).toEqual(expected)
})
