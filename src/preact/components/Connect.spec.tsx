declare const describe: any
declare const beforeEach: any
declare const jest: any
declare const Promise: any
declare const it: any
declare const expect: any

import { h } from "preact"
import { deep } from "preact-render-spy"

import createStore from "../../../dist/index"
import { Connect, Provider } from "../../../preact"

describe("redux-zero - preact bindings", () => {
  const listener = jest.fn()
  let store, unsubscribe, context
  beforeEach(() => {
    store = createStore({})
    listener.mockReset()
    unsubscribe = store.subscribe(listener)
  })

  describe("Connect component", () => {
    it("should provide the state and subscribe to changes", () => {
      store.setState({ message: "hello" })

      const mapToProps = ({ message }) => ({ message })

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => <h1>{message}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      context = deep(<App />, { depth: Infinity })
      expect(context.find("h1").text()).toBe("hello")
      store.setState({ message: "bye" })
      context = deep(<App />, { depth: Infinity })
      expect(context.find("h1").text()).toBe("bye")
    })

    it("should provide the actions and subscribe to changes", () => {
      store.setState({ count: 0 })

      const mapToProps = ({ count }) => ({ count })

      const actions = store => ({
        increment: state => ({ count: state.count + 1 })
      })

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps} actions={actions}>
          {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      context = deep(<App />, { depth: Infinity })
      expect(context.find("h1").text()).toBe("0")
      context.find("[onClick]").simulate("click")
      context.find("[onClick]").simulate("click")
      expect(context.find("h1").text()).toBe("2")
    })

    it("should peform async actions correctly", done => {
      store.setState({ count: 0 })

      const Comp = ({ count, increment }) => (
        <h1 onClick={increment}>{count}</h1>
      )

      const mapToProps = ({ count }) => ({ count })

      const actions = ({ getState, setState }) => ({
        increment: state => {
          Promise.resolve()
            .then(() => {
              setState({ pending: false, count: getState().count + 1 })
            })
            .then(() => {
              setState({ count: getState().count + 1 })

              const [state0, state1, state2, state3] = listener.mock.calls.map(
                ([c]) => c
              )

              expect(state0.count).toBe(0)
              expect(state1.pending).toBe(true)
              expect(state1.count).toBe(0)
              expect(state2.pending).toBe(false)
              expect(state2.count).toBe(1)
              expect(state3.count).toBe(2)

              done()
            })

          return { pending: true }
        }
      })

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps} actions={actions}>
          {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      context = deep(<App />, { depth: Infinity })

      context.find("[onClick]").simulate("click")
    })

    it("should provide the store as a prop", () => {
      const mapToProps = state => state

      const ConnectedComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ store }) => <h1>{String(!!store)}</h1>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp />
        </Provider>
      )

      context = deep(<App />, { depth: Infinity })

      expect(context.find("h1").text()).toBe("true")
    })

    it("should connect with nested children", () => {
      store.setState({ message: "hello" })

      const mapToProps = ({ message }) => ({ message })

      const ConnectedComp = props => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => (
            <div>
              parent {message} {props.children}
            </div>
          )}
        </Connect>
      )
      const ConnectedChildComp = () => (
        <Connect mapToProps={mapToProps}>
          {({ message }) => <span>child {message}</span>}
        </Connect>
      )

      const App = () => (
        <Provider store={store}>
          <ConnectedComp>
            <ConnectedChildComp />
          </ConnectedComp>
        </Provider>
      )

      context = deep(<App />, { depth: Infinity })

      expect(context.output()).toEqual(
        <div>
          parent hello <span>child hello</span>
        </div>
      )

      store.setState({ message: "bye" })

      context = deep(<App />, { depth: Infinity })

      expect(context.output()).toEqual(
        <div>
          parent bye <span>child bye</span>
        </div>
      )
    })
  })
})
