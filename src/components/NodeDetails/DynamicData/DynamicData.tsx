import { useEffect, useMemo, useState } from 'react'
import css from './DynamicData.module.css'
import cn from 'classnames';
import { ResponsiveBlock } from '~/components/ResponsiveBlock'
import { vi } from '~/utils/vi';
import { subscribeKey } from 'valtio/utils';
import { TPersonInfo } from '~/types'

type TProps = {
  id: string;
}

export const DynamicData = ({ id }: TProps) => {
  const [personInfo, setPersonInfo] = useState<TPersonInfo | null>(vi.common.personsInfo[id] || null)
  useEffect(() => {
    // NOTE: See also https://valtio.pmnd.rs/docs/api/utils/subscribeKey
    // Subscribe to all changes to the state proxy (and its child proxies)
    const unsubscribe = subscribeKey(vi.common.personsInfo, id, (val) => {
      setPersonInfo(val)
    })
    return () => {
      // Unsubscribe by calling the result
      unsubscribe()
    }
  }, [setPersonInfo, id])
  const isErrored = useMemo(() => !!personInfo && !personInfo.ok, [personInfo])

  return (
    <ResponsiveBlock
      className={cn(
        css.wrapper,
      )}
      isPaddedAnyway
    >
      <pre>{JSON.stringify(personInfo, null, 2)}</pre>
    </ResponsiveBlock>
  )
}
