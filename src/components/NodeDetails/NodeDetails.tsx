import React, { memo, useCallback, useMemo } from 'react';
import cn from 'classnames';
import type { Node } from 'relatives-tree/lib/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';
import { ResponsiveBlock } from '~/components/ResponsiveBlock'
import { DynamicData } from './DynamicData';
import { useSnapshot } from 'valtio';
import { vi } from '~/utils/vi';
import { useQueryParam, NumberParam } from 'use-query-params'

interface NodeDetailsProps {
  node: Readonly<Node>;
  className?: string;
  onSelect: (nodeId: string | undefined) => void;
  onHover: (nodeId: string) => void;
  onClear: () => void;
}

export const NodeDetails = memo(
  function NodeDetails({ node, className, ...props }: NodeDetailsProps) {
    const closeHandler = useCallback(() => props.onSelect(undefined), [props]);
    const snap = useSnapshot(vi.common)
    const [relationsDetailsParam] = useQueryParam('rd', NumberParam)
    const isRelationsDetailsEnabled = useMemo<boolean>(() => relationsDetailsParam === 1, [relationsDetailsParam])
    const [debugParam] = useQueryParam('debug', NumberParam)
    const isDebugEnabled = useMemo<boolean>(() => debugParam === 1, [debugParam])
    const liveTimeInfo = useMemo<string>(() => {
      let res = ''

      try {
        const arr = node.id.split('.')
        res = arr[arr.length - 1]
      } catch (err: any) {
        res = err?.message || 'Life Time info ERR #0'
      }
      
      return res
    }, [node.id])
    const fullName = useMemo<string>(
      () =>
      isDebugEnabled
      ? node.id
      : snap.personsInfo[node.id]?.data.customService?.data.baseInfo
        ? cn(
          snap.personsInfo[node.id]?.data.customService?.data.baseInfo.firstName,
          snap.personsInfo[node.id]?.data.customService?.data.baseInfo.middleName,
          snap.personsInfo[node.id]?.data.customService?.data.baseInfo.lastName,
        )
        : (snap.personsInfo[node.id]?.message || 'Full Name ERR #0 (no data)'),
      [snap, node.id, isDebugEnabled]
    )

    return (
      <section className={cn(css.root, className, 'backdrop-blur--lite')}>
        <ResponsiveBlock
          isPaddedAnyway
          className={cn(css.stickyHeader)}
        >
          <header className={css.header}>
            <h3 className={css.title}>{fullName}{liveTimeInfo ? <><br />{liveTimeInfo}</> : null}</h3>
            <button className={css.close} onClick={closeHandler}>&#10005;</button>
          </header>
        </ResponsiveBlock>
        <DynamicData id={node.id} key={node.id} />
        {
          isRelationsDetailsEnabled && (
            <>
              <Relations {...props} title="Parents" items={node.parents} />
              <Relations {...props} title="Children" items={node.children} />
              <Relations {...props} title="Siblings" items={node.siblings} />
              <Relations {...props} title="Spouses" items={node.spouses} />
            </>
          )
        }
        {
          isDebugEnabled && (
            <ResponsiveBlock
              isPaddedAnyway
              className={cn(css.stickyFooter)}
            >
              <div className={css.stack0}>
                <div><b>Processed: {snap.counters.load.processed} of {snap.counters.total}</b></div>
                <div>Minimum info ok: {snap.counters.load.minimumInfo.success}, not ok: {snap.counters.load.minimumInfo.errors} (total: {snap.counters.load.minimumInfo.success + snap.counters.load.minimumInfo.errors})</div>
                <div>Google Sheets info ok: {snap.counters.load.googleSheets.success.length}, not ok: {snap.counters.load.googleSheets.errors} (total: {snap.counters.load.googleSheets.success.length + snap.counters.load.googleSheets.errors})</div>
              </div>
            </ResponsiveBlock>
          )
        }
      </section>
    );
  },
);
