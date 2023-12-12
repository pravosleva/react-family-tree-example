import React, { memo, useCallback, ChangeEvent } from 'react';
import type { Node } from 'relatives-tree/lib/types';
import { URL_LABEL } from '../const';

interface SourceSelectProps {
  value: string;
  items: Record<string, readonly Readonly<Node>[]>;
  onChange: (value: string, nodes: readonly Readonly<Node>[]) => void;
}
type TValidationResut = {
  ok: boolean;
  reason?: string;
}
const apiErrorHandler = ({ validateFn }: { validateFn: (j: any) => TValidationResut }) => (json: any): Promise<any> => {
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
      return Promise.reject(validation.reason || 'API ERR #1')
    }
    default: return Promise.reject(`API ERR #2 incorrect json (${typeof json})`)
  }
}
const personValidate = (person: any, index: number): TValidationResut => {
  const res: TValidationResut = { ok: true }
  if (!person?.id) {
    res.ok = false
    res.reason = `no id for index ${index}`
  }
  return res
}
const isPersonCorrect = (person: any): boolean => !!person?.id

export const SourceSelect = memo(
  function SourceSelect({ value, items, onChange }: SourceSelectProps) {
    const changeHandler = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
      const key = event.target.value;

      if (key === URL_LABEL) {
        const url = prompt('Paste the url to load:');
        if (!url) return;

        fetch(url)
          .then((resp) => resp.json())
          .then(apiErrorHandler({
            validateFn: (arr) => {
              const result: TValidationResut = { ok: true }
              switch (true) {
                case !Array.isArray(arr):
                  result.ok = false
                  result.reason = 'res.data should be an Array'
                  break
                // NOTE: validate items
                case !arr.every(isPersonCorrect): {
                  let counter = 0
                  result.ok = false
                  result.reason = `res.data array has incorrect persons: ${arr.reduce((acc: string[], cur: any) => {
                    const validate = personValidate(cur, counter)
                    if (!validate.ok) acc.push(validate.reason || `No reason for incorrect case (index ${counter})`)
                    counter += 1
                    return acc
                  }, []).join(', ')}`
                  break
                }
                default: break
              }
              return result
            }
          }))
          .then((data) => Array.isArray(data) && onChange(key, data))
          .catch(console.warn);
      }
      else onChange(key, items[key]);
    }, [items, onChange]);

    return (
      <select value={value} onChange={changeHandler}>
        {Object.keys(items).map((item) => (
          <option key={item} value={item}>{item}</option>
        ))}
        <option value={URL_LABEL}>{URL_LABEL}</option>
      </select>
    );
  },
);
