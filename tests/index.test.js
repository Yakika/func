const assert = require('assert')
const { func, trErr } = require('../src/index')

/**
 * Testing : func
 */
const expectedText = 'my-value'
const rejectedText = 'is-rejected'
const thrownText = 'is-thrown'
const format = (originalErr, msg) => {
  return `error: ${msg}\n- original error: ${originalErr}`
}

describe('Synchronous error handling', () => {
  it(`res is equal to ${expectedText} and err is undefined`, async () => {
    const [res, err] = await func(expectedText)
    expect(res).toEqual(expectedText)
    expect(err).toBeUndefined()
  })

  it(`res is undefined, err is undefined and error was caught`, async () => {
    let [res, err] = [undefined, undefined]
    try {
      const fnThrow = () => {
        throw new Error(thrownText)
      }
      ;[res, err] = await func(fnThrow())
    } catch (e) {
      expect(e.message).toEqual(thrownText)
    }
    expect(res).toBeUndefined()
    expect(err).toBeUndefined()
  })
})

describe('Asynchronous error handling', () => {
  const asyncTask = (text, isRejected, isThrown) => {
    return new Promise((resolve, reject) => {
      if (isThrown) throw new Error(thrownText)
      if (isRejected) reject(new Error(rejectedText))
      setTimeout(() => {
        resolve(text)
      }, 10)
    })
  }
  const testAwait = async msg => {
    return await asyncTask(msg, false, false)
  }
  const testAwaitReject = async msg => {
    return await asyncTask(msg, true, false)
  }
  const testAwaitThrow = async msg => {
    return await asyncTask(msg, false, true)
  }

  it(`res is equal to ${expectedText} and err is undefined`, async () => {
    const [res, err] = await func(testAwait(expectedText))
    expect(res).toEqual(expectedText)
    expect(err).toBeUndefined()
  })

  it(`res is undefined and err.message is equal to ${rejectedText}`, async () => {
    const [res, err] = await func(testAwaitReject(expectedText))
    expect(res).toBeUndefined()
    expect(err.message).toEqual(rejectedText)
  })

  it(`res is undefined and err.message is equal to ${thrownText}`, async () => {
    const [res, err] = await func(testAwaitThrow(expectedText))
    expect(res).toBeUndefined()
    expect(err.message).toEqual(thrownText)
  })

  it(`res is undefined and err.message is transformed`, async () => {
    // Bypass func to get the original error for testing transform
    let originalErr
    const test = await testAwaitReject(expectedText).catch(e => {
      originalErr = e
    })

    const [res, err] = await func(testAwaitReject(expectedText), expectedText)
    expect(res).toBeUndefined()
    expect(err.message).toEqual(format(originalErr, expectedText))
  })
})

/**
 * Testing : trErr
 */

describe('Asynchronous transform error to something readable', () => {
  const prom = () => {
    return new Promise((resolve, reject) => {
      reject(new Error())
    })
  }

  it(`Error is now custom and the original error was kept`, () => {
    const msg = 'human readable err'
    let errMsg, originalErr
    prom()
      // Normally we would use .catch(trErr(msg)),
      .catch(e => {
        originalErr = e
        trErr(msg)(e)
      })
      .catch(e => {
        expect(e.message).toEqual(format(originalErr, msg))
      })
  })
})
describe('Synchronous transform error to something readable', () => {
  it(`Error is now custom and the original error was kept`, () => {
    const msg = 'human readable err'
    let originalErr
    // External try/catch for testing behavior
    try {
      try {
        throw new Error()
      } catch (e) {
        // transform some sync error that we don't want to catch
        originalErr = e
        trErr(msg)(e)
      }
    } catch (err) {
      expect(err.message).toEqual(
        `error: ${msg}\n- original error: ${originalErr}`
      )
    }
  })
})
