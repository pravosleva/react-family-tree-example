/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutEffect, useCallback } from 'react'
import { groupLog, wws } from '~/utils'
// import { NEvents } from '~/types'
import { NFT, TPresonDataResponse } from '~/types'
// import { vi } from '~/common/vi'
import { vi } from '~/utils/vi'
import { subscribeKey } from 'valtio/utils'
import { getClonedObject } from '~/utils/getClonedObject'

type TProps = {
  isDebugEnabled?: boolean;
}

export const useWorkers = ({ isDebugEnabled }: TProps) => {
  // NOTE: 1.1 Use wws.subscribeOnData once only!
  useLayoutEffect(() => {
    wws.subscribeOnData<{
      data: {
        __eType: NFT.EWorkerToClientEvent;
        data: {
          type: NFT.EWorkerToClientEvent;
          output: TPresonDataResponse;
          _service: {
            counters: {
              current: number;
              total: number;
            };
          };
        };
      };
    }>({
      wName: 'opsWorker',
      cb: (e) => {
        switch (e.data.__eType) {
          // case NEvents.ECustom.WORKER_TO_CLIENT_REMOTE_DATA:
          //   if (isDebugEnabled) groupLog({
          //     namespace: `--useWorkerOps:by-opsWorker ✅ (on data) [${e.data.__eType}] e.data:`,
          //     items: [e.data],
          //   })
          //   // NOTE: App logic?
          //   break
          case NFT.EWorkerToClientEvent.SINGLE_PERSON_DATA:
            if (isDebugEnabled) groupLog({
              namespace: `useWorkers: by opsWorker (on data #1) [${e.data.__eType}]`,
              items: [
                'e.data',
                e.data,
              ],
            })
            if (e.data.data.output) vi.setSinglePersonData(e.data.data.output)
            break
          default: {
            if (isDebugEnabled) groupLog({
              namespace: `useWorkers: by opsWorker ⚠️ (on data) UNHANDLED! [${e.data.__eType}]`,
              items: ['e.data', e.data],
            })
            break
          }
        }
      },
    })

    // -- NOTE: 1.2 Additional subscribe? ⛔ Dont use this! Cuz callbacks above will be replaced
    // wws.subscribeOnData<{
    //   data: {
    //     output: any;
    //     type: NEvents.ESharedWorkerNative;
    //     yourData: { [key: string]: any; };
    //   };
    // }>({
    //   wName: 'opsWorker',
    //   cb: (e: any) => { groupLog({ namespace: e.type, items: [ e.data ] }) },
    // })
    // --

    wws.subscribeOnErr({
      wName: 'opsWorker',
      cb: (e: any) => {
        if (isDebugEnabled) groupLog({
          namespace: 'useWorkers: by opsWorker 🚫 OnErr e:',
          items: [e],
        })
      },
    })

    return () => {
      const wList = ['opsWorker']
      for (const wName of wList) {
        wws.terminate({
          wName,
          cb: () => {
            if (isDebugEnabled) groupLog({ namespace: `useWorkers: by opsWorker 🚫 die [${wName}]`, items: [] })
          },
        })
      }
    }
  }, [isDebugEnabled])

  const sendSnapshotToWorker = useCallback(({
    input,
  }: {
    input: {
      opsEventType: NFT.EClientToWorkerEvent;
      familyTree: any;
    }
  }) => {
    wws.post<{
      input: {
        opsEventType: string;
        appVersion: string;
      }
    }>({
      wName: 'opsWorker',
      eType: NFT.EClientToWorkerEvent.MESSAGE,
      data: {
        input: {
          appVersion: vi.common.appVersion,
          ...input,
        },
      },
    })
  }, [])

  // NOTE: 2. Send event for each change
  useLayoutEffect(() => {
    // NOTE: See also https://valtio.pmnd.rs/docs/api/utils/subscribeKey
    // Subscribe to all changes to the state proxy (and its child proxies)
    const unsubscribe = subscribeKey(vi.common, 'activeFamilyTree', (val) => {
      // console.log(val)
      if (val) sendSnapshotToWorker({
        input: {
          // opsEventType: NEvents.EMetrixClientOutgoing.SP_MX_EV,
          opsEventType: NFT.EClientToWorkerEvent.GET_PERSONS_DATA,
          // @ts-ignore
          // stateValue: vi.common.stateValue,
          familyTree: getClonedObject(val),
        }
      })
    })
    return () => {
      // Unsubscribe by calling the result
      unsubscribe()
    }
  }, [isDebugEnabled, sendSnapshotToWorker])
}
