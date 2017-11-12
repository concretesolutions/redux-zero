declare const describe: any
declare const beforeEach: any
declare const jest: any
declare const Promise: any
declare const it: any
declare const expect: any
declare const test: any

import createStore from "../../dist/index"

describe("redux-zero - the store", () => {
  const listener = jest.fn()
  let store, unsubscribe
  beforeEach(() => {
    store = createStore({})
    listener.mockReset()
    unsubscribe = store.subscribe(listener)
  })

  test("setState - getState", () => {
    const state = { one: { two: { three: "four" } }, five: "six" }
    store.setState(state)
    expect(store.getState()).toEqual(state)
    store.setState(state => state)
    expect(store.getState()).toEqual(state)
    store.setState({ five: "seven" })
    expect(store.getState()).toEqual({
      one: { two: { three: "four" } },
      five: "seven"
    })
    store.setState(state => ({ five: "eight" }))
    expect(store.getState()).toEqual({
      one: { two: { three: "four" } },
      five: "eight"
    })
  })

  test("subscribe / unsubscribe", () => {
    expect(listener).not.toBeCalled()
    store.setState({ a: "key" })
    expect(listener).toBeCalledWith({ a: "key" })

    const otherListener = jest.fn()
    store.subscribe(otherListener)
    listener.mockReset()

    unsubscribe(listener)
    store.setState({ a: "key" })
    expect(listener).not.toBeCalled()
    expect(otherListener).toBeCalledWith({ a: "key" })
  })
})
