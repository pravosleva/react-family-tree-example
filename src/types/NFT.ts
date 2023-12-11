export namespace NFT {
  export enum EClientToWorkerEvent {
    GET_PERSONS_DATA = 'c-w:family-tree:get-persons-data',
    DIE_WORKER = 'c-w:die-worker',
    RESET_WORKER_HISTORY = 'c-w:reset-worker-history',
    MESSAGE = 'c-w:message',
  }
  export enum EWorkerToClientEvent {
    MESSAGE = 'w-c:message',
    SINGLE_PERSON_DATA = 'w-c:family-tree:single-person-data',
  }
}
