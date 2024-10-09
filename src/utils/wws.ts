/* eslint-disable @typescript-eslint/ban-ts-comment */
import { groupLog } from './groupLog'
import { NFT } from '~/types'
const PUBLIC_URL = process.env.REACT_APP_PUBLIC_URL
import packageJson from '../../package.json'

type TProps = {
  noSharedWorkers?: boolean;
  isDebugEnabled?: boolean;
}
type TTsListItem = {
  label: string;
  descr: string;
  p: number;
  ts: number;
}

class Singleton {
  private static instance: Singleton
  private opsWorker: SharedWorker | Worker;
  noSharedWorkers: boolean | undefined;
  isDebugEnabled: boolean | undefined;

  private constructor({ noSharedWorkers, isDebugEnabled }: TProps) {
    this.noSharedWorkers = noSharedWorkers
    this.isDebugEnabled = isDebugEnabled
    try {
      switch (true) {
        case noSharedWorkers:
          this.opsWorker = new Worker(`${PUBLIC_URL}/workers/ops.worker.js?v=${packageJson.version}&ts=${new Date().getTime()}`)

          // Etc.
          break
        default:
          this.opsWorker = typeof SharedWorker !== 'undefined'
            ? new SharedWorker(`${PUBLIC_URL}/workers/ops.shared-worker.js?v=${packageJson.version}&ts=${new Date().getTime()}`)
            : new Worker(`${PUBLIC_URL}/workers/ops.worker.js?v=${packageJson.version}&ts=${new Date().getTime()}`)
          if (typeof SharedWorker !== 'undefined' && this.opsWorker instanceof SharedWorker) this.opsWorker.port.start()

          // Etc.
          break
      }
    } catch (err) {
      console.error(err)
      this.opsWorker = new Worker(`${PUBLIC_URL}/workers/ops.worker.js?v=${packageJson.version}&ts=${new Date().getTime()}`)
    } finally {
      // @ts-ignore
      // this.log({ label: 'Init', msgs: [`typeof this.opsWorker: ${typeof this.opsWorker}`] })
    }
  }
  public static getInstance(props: TProps): Singleton {
    if (!Singleton.instance) Singleton.instance = new Singleton(props)

    return Singleton.instance
  }
  private log ({ label, msgs }: { label: string; msgs?: any[] }): void {
    if (this.isDebugEnabled) groupLog({ namespace: `-webWorkersInstance: ${label}`, items: msgs || [] })
  }

  public subscribeOnData<T>({ wName, cb }: { wName: string; cb: (d: T) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #1`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].onmessage = cb
        break
      // @ts-ignore
      case typeof SharedWorker !== 'undefined' && this[wName] instanceof SharedWorker:
        // @ts-ignore
        this[wName].port.onmessage = cb
        break
      default:
        break
    }
  }

  public subscribeOnErr<T>({ wName, cb }: { wName: string; cb: (d: T) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #2`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].onmessageerror = cb
        break
      // @ts-ignore
      case typeof SharedWorker !== 'undefined' && this[wName] instanceof SharedWorker:
        // _c++
        // @ts-ignore
        this[wName].port.onmessageerror = cb
        break
      default:
        break
    }
  }

  public post<T>(e: { wName: string; eType: string; data?: T; }) {
    const { wName, eType, data } = e
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #3`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].postMessage({ __eType: eType, ...data })
        break
      // @ts-ignore
      case typeof SharedWorker !== 'undefined' && this[wName] instanceof SharedWorker:
        this.log({ label: 'before post to sw...', msgs: [e] })
        // @ts-ignore
        this[wName].port.postMessage({ __eType: eType, ...data })
        break
      default:
        break
    }
  }

  public terminate({ wName, cb }: { wName: string; cb?: (d: any) => void; }) {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #4`)

    switch (true) {
      // @ts-ignore
      case this[wName] instanceof Worker:
        // @ts-ignore
        this[wName].terminate()
        if (cb) cb({ ok: true })
        break
      // @ts-ignore
      case typeof SharedWorker !== 'undefined' && this[wName] instanceof SharedWorker:
        // @ts-ignore
        this[wName].port.postMessage({ __eType: NFT.EClientToWorkerEvent.DIE_WORKER })
        break
      default:
        break
    }
  }

  public resetHistory({ wName }: { wName: string; }): void {
    // @ts-ignore
    if (!this[wName]) throw new Error(`No worker ${wName} yet #5`)

    this.post<{ tsList: TTsListItem[] }>({
      wName,
      eType: NFT.EClientToWorkerEvent.RESET_WORKER_HISTORY,
    })
  }
  public resetOpsWorkerHistory() {
    this.resetHistory({ wName: 'opsWorker' })
  }
}

export const wws = Singleton.getInstance({
  noSharedWorkers: false,
  isDebugEnabled: false,
})
