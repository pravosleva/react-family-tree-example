import React, { useCallback, useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import type { ExtNode } from 'relatives-tree/lib/types';
import css from './FamilyNode.module.css';
import { vi } from '~/utils/vi';
import { subscribeKey } from 'valtio/utils';
import { TPersonInfo } from '~/types'

interface FamilyNodeProps {
  node: ExtNode;
  isRoot: boolean;
  isHover?: boolean;
  isSelected: boolean;
  onClick: (id: string) => void;
  onSubClick: (id: string) => void;
  style?: React.CSSProperties;
}

export const FamilyNode = React.memo(
  function FamilyNode({ node, isRoot, isHover, isSelected, onClick, onSubClick, style }: FamilyNodeProps) {
    const clickHandler = useCallback(() => onClick(node.id), [node.id, onClick]);
    const clickSubHandler = useCallback(() => onSubClick(node.id), [node.id, onSubClick]);

    const [personInfo, setPersonInfo] = useState<TPersonInfo | null>(vi.common.personsInfo[node.id] || null)
    useEffect(() => {
      // NOTE: See also https://valtio.pmnd.rs/docs/api/utils/subscribeKey
      // Subscribe to all changes to the state proxy (and its child proxies)
      const unsubscribe = subscribeKey(vi.common.personsInfo, node.id, (val) => {
        setPersonInfo(val)
      })
      return () => {
        // Unsubscribe by calling the result
        unsubscribe()
      }
    }, [setPersonInfo, node.id])
    const isErrored = useMemo(() => !!personInfo && !personInfo.ok, [personInfo])

    return (
      <div className={css.root} style={style}>
        <div
          className={cn(
            css.inner,
            css[node.gender],
            isRoot && css.isRoot,
            isHover && css.isHover,
            isSelected && css.isSelected,
          )}
          onClick={clickHandler}
        >
          <div
            className={cn(
              css.id,
              css.innerStackItem,
            )}
          >
            {personInfo?.ok && personInfo?.data ? `${personInfo.data.firstName} ${personInfo.data.middleName} ${personInfo.data.lastName}` : node.id}
          </div>
          {
            isErrored && !!personInfo?.message && (
              <div
                className={cn(css.absoluteBadge, css.msgErr, 'fade-in')}
              >
                {personInfo.message}
              </div>
            )
          }
        </div>
        {node.hasSubTree && (
          <div
            className={cn(css.sub, css[node.gender])}
            onClick={clickSubHandler}
          />
        )}
      </div>
    );
  },
);
