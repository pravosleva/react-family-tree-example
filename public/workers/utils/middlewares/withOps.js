const delay = (ms = 1000) => new Promise((res, _rej) => {
  setTimeout(res, ms)
})

const withOps = async ({
  eventData,
  cb,
}) => {
  const {
    __eType,
    input,
  } = eventData
  let output = {
    ok: false,
    message: 'Output data not modified',
  }

  // - NOTE: Level 1: Client-Worker events
  switch (__eType) {
    case NES.Custom.EType.CLIENT_TO_WORKER_MESSAGE: {
      
      // -- NOTE: Level 2: Different app event types
      switch (true) {
        case eventData?.input.stateValue === NES.Custom.Client.FamilyTree.EClientToWorkerEvent.GET_PERSONS_DATA: {
          await delay(3000)
          output = {
            ok: false,
            message: 'Test async op (TODO: GET_PERSONS_DATA)'
          }
          break
        }
        default: break
      }
      // --

      break
    }
    default: break
  }
  // -

  if (typeof cb[eventData?.input?.opsEventType] === 'function') {
    log({ label: `c->(worker):port:listener:opsEventType:${eventData?.input?.opsEventType}->[cb]`, msgs: [input] })
    cb[eventData?.input?.opsEventType]({
      output,
    })
  }
}
