import React, { memo, useCallback, ChangeEvent } from 'react';
import type { Node } from 'relatives-tree/lib/types';
import { URL_LABEL } from '../const';
import { personsValidate, NVal } from '~/utils/validate'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  // closeSnackbar,
} from 'notistack'

interface SourceSelectProps {
  value: string;
  items: Record<string, readonly Readonly<Node>[]>;
  onChange: (value: string, nodes: readonly Readonly<Node>[]) => void;
}

const apiErrorHandler = ({ validateFn }: { validateFn: (j: any) => NVal.TValidationResut }) => (json: any): Promise<any> => {
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

const localStorageDefaultUrlSourseName = 'react-family-2023.default-url'

export const SourceSelect = memo(
  function SourceSelect({ value, items, onChange }: SourceSelectProps) {
    const { enqueueSnackbar } = useSnackbar()
    const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
      if (!document.hidden) enqueueSnackbar(msg, opts)
    }, [enqueueSnackbar])
    const changeHandler = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
      const key = event.target.value;

      if (key === URL_LABEL) {
        const url = prompt('Paste the url to load:', localStorage.getItem(localStorageDefaultUrlSourseName) || undefined);
        if (!url) return;

        localStorage.setItem(localStorageDefaultUrlSourseName, url)

        fetch(url)
          .then((resp) => resp.json())
          .then(apiErrorHandler({
            validateFn: (arr) => {
              const result: NVal.TValidationResut = { ok: true }
              const validate = personsValidate(arr)
              if (!validate.ok) {
                result.ok = false
                result.reason = `Incorrect data: ${validate.reason || 'API ERR #1 (no reason)'}`
              }
              return result
            }
          }))
          .then((data) => Array.isArray(data) && onChange(key, data))
          .catch((err) => {
            showNotif(err.message || 'Unknown API ERR #0', { variant: 'error' })
          });
      }
      else onChange(key, items[key]);
    }, [items, onChange, showNotif]);

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
