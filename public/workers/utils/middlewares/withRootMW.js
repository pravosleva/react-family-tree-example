importScripts('./utils/middlewares/withOps.js')

const compose = (fns, arg) => {
  return fns.reduce(
    (acc, fn) => {
      fn(arg)
      acc += 1
      return acc
    },
    0
  )
}

const withRootMW = (arg) => compose([
  withOps,

  // -- NOTE: For example
  // ({ __eType, input }) => {},
  // --

  // TODO: etc.
], arg)
