/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLayoutEffect, useCallback } from 'react'
import { groupLog, wws } from '~/utils'
// import { NEvents } from '~/types'
import { NFT } from '~/types'
// import { vi } from '~/common/vi'
import { vi } from '~/utils/vi'
import { subscribeKey } from 'valtio/utils'

type TProps = {
  isDebugEnabled?: boolean;
}

export const useWorkers = ({ isDebugEnabled }: TProps) => {
  // NOTE: 1.1 Use wws.subscribeOnData once only!
  useLayoutEffect(() => {
    wws.subscribeOnData<{
      data: {
        output: any;
        type: NFT.EWorkerToClientEvent;
        yourData: { [key: string]: any; };
      };
    }>({
      wName: 'opsWorker',
      cb: (e: any) => {
        switch (e.data.__eType) {
          // case NEvents.ECustom.WORKER_TO_CLIENT_REMOTE_DATA:
          //   if (isDebugEnabled) groupLog({
          //     namespace: `--useWorkerOps:by-opsWorker ✅ (on data) [${e.data.__eType}] e.data:`,
          //     items: [e.data],
          //   })
          //   // NOTE: App logic?
          //   break
          default: {
            if (isDebugEnabled) groupLog({
              namespace: `--useWorkerOps:by-opsWorker ⚠️ (on data) UNHANDLED! [${e.data.__eType}] e.data:`,
              items: [e.data],
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
          namespace: '--useWorkerOps:opsWorker 🚫 OnErr e:',
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
            if (isDebugEnabled) groupLog({ namespace: `--useWorkerOps 🚫 die [${wName}]`, items: [] })
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
      stateValue: string;
    }
  }) => {
    wws.post<{
      input: {
        opsEventType: string;
        stateValue: string;
        appVersion: string;
      }
    }>({
      wName: 'opsWorker',
      eType: NFT.EClientToWorkerEvent.MESSAGE,
      data: {
        input: {
          appVersion: '0.0.1', // vi.common.appVersion,
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
      if (typeof val === 'string') sendSnapshotToWorker({
        input: {
          // opsEventType: NEvents.EMetrixClientOutgoing.SP_MX_EV,
          opsEventType: NFT.EClientToWorkerEvent.MESSAGE,
          // @ts-ignore
          stateValue: vi.common.stateValue,
        }
      })
    })
    return () => {
      // Unsubscribe by calling the result
      unsubscribe()
    }
  }, [isDebugEnabled, sendSnapshotToWorker])
}
