import React, { memo, useCallback } from 'react';
import classNames from 'classnames';
import type { Node } from 'relatives-tree/lib/types';
import { Relations } from './Relations';
import css from './NodeDetails.module.css';
import { ResponsiveBlock } from '~/components/ResponsiveBlock'
import { DynamicData } from './DynamicData';
import { useSnapshot } from 'valtio';
import { vi } from '~/utils/vi';

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

    return (
      <section className={classNames(css.root, className, 'backdrop-blur--lite')}>
        <ResponsiveBlock
          isPaddedAnyway
          className={classNames(css.stickyHeader)}
        >
          <header className={css.header}>
            <h3 className={css.title}>{node.id}</h3>
            <button className={css.close} onClick={closeHandler}>&#10005;</button>
          </header>
        </ResponsiveBlock>
        <DynamicData id={node.id} key={node.id} />
        <Relations {...props} title="Parents" items={node.parents} />
        <Relations {...props} title="Children" items={node.children} />
        <Relations {...props} title="Siblings" items={node.siblings} />
        <Relations {...props} title="Spouses" items={node.spouses} />
        <ResponsiveBlock
          isPaddedAnyway
          className={classNames(css.stickyFooter)}
        >
          Total: {snap.total}
        </ResponsiveBlock>
      </section>
    );
  },
);
