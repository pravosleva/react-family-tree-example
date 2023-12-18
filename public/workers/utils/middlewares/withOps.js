const delay = (ms = 1000) => new Promise((res, _rej) => {
  setTimeout(res, ms)
})
const isTsActual = ({ limit, ts }) => {
  const nowTs = new Date().getTime()
  return nowTs - ts <= limit
}

const cache = new Map() // NOTE: personId => { ts, data }
const getPersonFromCache = ({ personId, tsLimit = 60 * 1000 }) => {
  const res = {
    ok: false,
    data: null,
  }
  const personInfo = cache.get(personId)
  if (!!personInfo && !!personInfo.ts && isTsActual({ limit: tsLimit, ts: personInfo.ts })) {
    res.ok = true
    res.data = personInfo.data
  }
  return res
}

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
      switch (eventData?.input.opsEventType) {
        case NES.Custom.Client.FamilyTree.EClientToWorkerEvent.GET_PERSONS_DATA: {
          // console.log(eventData?.input)
          // await delay(3000)
          // output = {
          //   ok: true,
          //   message: 'Test async op (TODO: GET_PERSONS_DATA)',
          //   data: {
          //     id: 'TsyAkbF89',
          //     firstName: 'First',
          //     middleName: 'Middle',
          //     lastName: 'Last',
          //   },
          // }

          const { familyTree } = eventData?.input
          let _c = 0
          const _total = familyTree.length

          for (const person of familyTree) {
            const personFromCahce = getPersonFromCache({ personId: person.id })
            if (personFromCahce.ok && personFromCahce.data) {
              output = personFromCahce.data
            } else {
              output = await fetchRetry({
                // url: 'https://pravosleva.pro/express-helper/subprojects/exp.family/get-single-person-data',
                url: 'https://pravosleva.pro/express-helper/pravosleva-blog-2023/family-tree-2023/v1/get-single-person-info',
                delay: 5 * 1000,
                tries: 5,
                fetchOptions: {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    personId: person.id,
                  }),
                  // signal: abortController.signal,
                },
              })
                .then(async (res) => {
                  const result = await res.json();
                  switch (true) {
                    case !result?.ok:
                      throw new Error(result.message || 'Ошибка при получении данных #1')
                    case !result.data:
                      throw new Error(result.message || 'Ошибка при получении данных #2')
                    case !result.data?.id:
                      throw new Error(result?.message || res?.message || 'Ошибка данных #3 !data.id')
                    default:
                      break
                  }
                  return result
                })
                .catch((err) => {
                  return {
                    ok: false,
                    message: err.message,
                    data: {
                      id: person.id,
                    },
                  }
                })

              if (!!output && output.ok) cache.set(person.id, { ts: new Date().getTime(), data: output })
            }

            _c += 1
            const _service = {
              counters: {
                current: _c,
                total: _total,
              },
            }
            if (typeof cb[eventData?.input?.opsEventType] === 'function') {
              if (dbg.workerEvs.mwsInternalLogs.isEnabled) log({
                label: `c->(worker):port:listener:opsEventType:${eventData?.input?.opsEventType}->[cb]`,
                msgs: [
                  'input',
                  input,
                  'output',
                  output,
                ],
              })

              cb[eventData?.input?.opsEventType]({
                output,
                _service,
              })
            }

            await delay(100)
          }
          break
        }
        default: break
      }
      // --

      break
    }
    default:
      break
  }
  // -
}
