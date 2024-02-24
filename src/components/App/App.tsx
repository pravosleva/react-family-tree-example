import React, { useMemo, useState, useCallback, useLayoutEffect } from 'react';
import type { Node, ExtNode } from 'relatives-tree/lib/types';
import treePackage from 'relatives-tree/package.json';
import ReactFamilyTree from 'react-family-tree';
import { SourceSelect } from '../SourceSelect/SourceSelect';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NodeDetails } from '../NodeDetails/NodeDetails';
import { NODE_WIDTH, NODE_HEIGHT, SOURCES, DEFAULT_SOURCE, URL_LABEL } from '../const';
import { getNodeStyle } from './utils';
import { useWorkers } from '~/hooks/useWorkers'
import { vi } from '~/utils/vi'
import { useQueryParam, NumberParam, StringParam } from 'use-query-params'
import cn from 'classnames'
import {
  useSnackbar,
  SnackbarMessage as TSnackbarMessage,
  OptionsObject as IOptionsObject,
  // SharedProps as ISharedProps,
  // closeSnackbar,
} from 'notistack'
import { apiErrorHandler } from '~/utils/apiErrorHandler'
import css from './App.module.css';
import { NVal, personsValidate } from '~/utils/validate';
import { groupLog } from '~/utils';
import { FixedProgressbar } from '~/components/FixedProgressbar'
import { FixedBirthdayList } from '~/components/FixedBirthdayList'

export default React.memo(
  function App() {
    const [isReady, setIsReady] = useState<boolean>(false);
    const [source, setSource] = useState(DEFAULT_SOURCE);
    const [nodes, setNodes] = useState(SOURCES[source]);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [selectId, setSelectId] = useState<string>();
    const [hoverId, setHoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    const changeSourceHandler = useCallback(
      (source: string, nodes: readonly Readonly<Node>[]) => {
        setRootId(nodes[0].id);
        setNodes(nodes);
        vi.setActiveFamilyTree(nodes);
        setSource(source);
        setSelectId(undefined);
        setHoverId(undefined);
      },
      [],
    );

    const selected = useMemo(() => (
      nodes.find(item => item.id === selectId)
    ), [nodes, selectId]);

    const [debugModeParam] = useQueryParam('debug', NumberParam)
    const isDebugModeEnabled = useMemo<boolean>(() => debugModeParam === 1, [debugModeParam])
    const [schemeName] = useQueryParam('sn', StringParam)
    const [targetFamily] = useQueryParam('target', StringParam)
    const { enqueueSnackbar } = useSnackbar()
    const showNotif = useCallback((msg: TSnackbarMessage, opts?: IOptionsObject) => {
      if (!document.hidden) enqueueSnackbar(msg, opts)
    }, [enqueueSnackbar])

    useWorkers({ isDebugEnabled: false })
    useLayoutEffect(() => {
      switch (schemeName) {
        case 'pravosleva-full': {
          fetch(`https://pravosleva.pro/express-helper/subprojects/exp.family/pravosleva?v=12${targetFamily ? `&target=${targetFamily}` : ''}`)
          // fetch(`http://localhost:5000/subprojects/exp.family/pravosleva?v=12${targetFamily ? `&target=${targetFamily}` : ''}`)
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
            .then((arr) => {
              groupLog({ namespace: `Scheme received: ${schemeName} (${arr.length})`, items: [arr] })
              vi.setActiveFamilyTree(arr)
              changeSourceHandler(URL_LABEL, arr)
              setIsReady(true)
            })
            .catch((err) => {
              showNotif(err.message || 'Unknown API ERR #0', { variant: 'error' })
            })
          break
        }
        default:
          showNotif(`Default demo source used: ${DEFAULT_SOURCE}`, { variant: 'error' })
          vi.setActiveFamilyTree(SOURCES[DEFAULT_SOURCE])
          changeSourceHandler(DEFAULT_SOURCE, SOURCES[DEFAULT_SOURCE])
          setIsReady(true)
          break
      }
    }, [schemeName, showNotif, changeSourceHandler, setIsReady, targetFamily])

    if (!isReady) return null
    return (
      <div className={css.root}>
        {
          isDebugModeEnabled && (
            <header className={css.header}>
              <h1 className={css.title}>
                FamilyTree demo
                <span className={css.version}>
                  core: {treePackage.version}
                </span>
              </h1>

              <div>
                <label>Source: </label>
                <SourceSelect value={source} items={SOURCES} onChange={changeSourceHandler} />
              </div>

              <a href="https://github.com/SanichKotikov/react-family-tree-example">GitHub</a>
            </header>
          )
        }
        {nodes.length > 0 && (
          <PinchZoomPan min={0.5} max={2.5} captureWheel className={css.wrapper}>
            <ReactFamilyTree
              nodes={nodes}
              rootId={rootId}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              className={css.tree}
              renderNode={(node: Readonly<ExtNode>) => (
                <FamilyNode
                  key={node.id}
                  node={node}
                  isRoot={node.id === rootId}
                  isHover={node.id === hoverId}
                  isSelected={selectId === node.id}
                  onClick={setSelectId}
                  onSubClick={setRootId}
                  style={getNodeStyle(node)}
                />
              )}
            />
          </PinchZoomPan>
        )}
        {rootId !== firstNodeId && (
          <button
            className={cn(css.reset, {
              [css.offsetTopForHeader]: isDebugModeEnabled,
            })}
            onClick={resetRootHandler}
          >
            Вернуть исходное дерево
          </button>
        )}
        {selected && (
          <NodeDetails
            node={selected}
            className={cn(css.details, {
              [css.offsetTopForHeader]: isDebugModeEnabled,
              [css.offsetTopForHeaderLimitedHeight]: isDebugModeEnabled,
            })}
            onSelect={setSelectId}
            onHover={setHoverId}
            onClear={() => setHoverId(undefined)}
          />
        )}
        <FixedProgressbar />
        <FixedBirthdayList
          activeRootId={rootId}
          selectedId={selectId}
          // onClick={setSelectId}
          onClick={(id) => {
            setRootId(id)
            setSelectId(id)
          }}
        />
      </div>
    );
  },
);
