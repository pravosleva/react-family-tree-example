function wait(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay))
}

function fetchRetry({
  url,
  delay = 1000,
  tries = 0,
  fetchOptions = {},
  cb,
}) {
  let __triesLeft = tries
  // onEachAttempt(__triesLeft)
  function onError(err) {
    __triesLeft = !!__triesLeft ? __triesLeft - 1 : 0
    if (!!cb && typeof cb.onError === 'function') cb.onError({
      __triesLeft,
      tries,
      url,
      err,
    })

    if (!__triesLeft) throw err

    return wait(delay).then(() => fetchRetry({ url, delay, tries: __triesLeft, fetchOptions }))
  }
  return fetch(url, fetchOptions).catch(onError)
}
