import React, { useCallback } from 'react';
import classNames from 'classnames';
import type { ExtNode } from 'relatives-tree/lib/types';
import css from './FamilyNode.module.css';

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

    return (
      <div className={css.root} style={style}>
        <div
          className={classNames(
            css.inner,
            css[node.gender],
            isRoot && css.isRoot,
            isHover && css.isHover,
            isSelected && css.isSelected,
          )}
          onClick={clickHandler}
        >
          <div
            className={classNames(
              css.id,
              css.innerStackItem,
            )}
          >
            {node.id}
          </div>
          <div
            className={classNames(
              css.id,
              css.innerStackItem,
            )}
          >
            isHover: {String(isHover)}
          </div>
        </div>
        {node.hasSubTree && (
          <div
            className={classNames(css.sub, css[node.gender])}
            onClick={clickSubHandler}
          />
        )}
      </div>
    );
  },
);
