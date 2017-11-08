import { h } from "preact"
import { deep } from "preact-render-spy"

import createStore from "../.."
import { Provider, Connect } from ".."

describe("redux-zero - preact bindings", () => {
  const listener = jest.fn()
  let store, unsubscribe
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

      const wrapper = deep(<App />, { depth: Infinity })

      expect(wrapper.contains(<h1>hello</h1>)).toBe(true)

      store.setState({ message: "bye" })

      expect(wrapper.contains(<h1>bye</h1>)).toBe(true)
    })

    // it("should provide the actions and subscribe to changes", () => {
    //   store.setState({ count: 0 })

    //   const mapToProps = ({ count }) => ({ count })

    //   const actions = store => ({
    //     increment: state => ({ count: state.count + 1 })
    //   })

    //   const ConnectedComp = () => (
    //     <Connect mapToProps={mapToProps} actions={actions}>
    //       {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
    //     </Connect>
    //   )

    //   const App = () => (
    //     <Provider store={store}>
    //       <ConnectedComp />
    //     </Provider>
    //   )

    //   const wrapper = deep(<App />, { depth: Infinity })

    //   expect(wrapper.html()).toBe("<h1>0</h1>")

    //   wrapper.children().simulate("click")
    //   wrapper.children().simulate("click")

    //   expect(wrapper.html()).toBe("<h1>2</h1>")
    // })

    // it("should peform async actions correctly", done => {
    //   store.setState({ count: 0 })

    //   const Comp = ({ count, increment }) => (
    //     <h1 onClick={increment}>{count}</h1>
    //   )

    //   const mapToProps = ({ count }) => ({ count })

    //   const actions = ({ getState, setState }) => ({
    //     increment: state => {
    //       Promise.resolve()
    //         .then(() => {
    //           setState({ pending: false, count: getState().count + 1 })
    //         })
    //         .then(() => {
    //           setState({ count: getState().count + 1 })

    //           const [state0, state1, state2, state3] = listener.mock.calls.map(
    //             ([c]) => c
    //           )

    //           expect(state0.count).toBe(0)
    //           expect(state1.pending).toBe(true)
    //           expect(state1.count).toBe(0)
    //           expect(state2.pending).toBe(false)
    //           expect(state2.count).toBe(1)
    //           expect(state3.count).toBe(2)

    //           done()
    //         })

    //       return { pending: true }
    //     }
    //   })

    //   const ConnectedComp = () => (
    //     <Connect mapToProps={mapToProps} actions={actions}>
    //       {({ count, increment }) => <h1 onClick={increment}>{count}</h1>}
    //     </Connect>
    //   )

    //   const App = () => (
    //     <Provider store={store}>
    //       <ConnectedComp />
    //     </Provider>
    //   )

    //   const wrapper = deep(<App />, { depth: Infinity })

    //   wrapper.children().simulate("click")
    // })

    // it("should provide the store as a prop", () => {
    //   const mapToProps = state => state

    //   const ConnectedComp = () => (
    //     <Connect mapToProps={mapToProps}>
    //       {({ store }) => <h1>{String(!!store)}</h1>}
    //     </Connect>
    //   )

    //   const App = () => (
    //     <Provider store={store}>
    //       <ConnectedComp />
    //     </Provider>
    //   )

    //   const wrapper = deep(<App />, { depth: Infinity })

    //   expect(wrapper.html()).toBe("<h1>true</h1>")
    // })

    // it("should connect with nested children", () => {
    //   store.setState({ message: "hello" })

    //   const mapToProps = ({ message }) => ({ message })

    //   const ConnectedComp = ({ children }) => (
    //     <Connect mapToProps={mapToProps}>
    //       {({ message }) => (
    //         <div>
    //           parent {message} {children}
    //         </div>
    //       )}
    //     </Connect>
    //   )
    //   const ConnectedChildComp = () => (
    //     <Connect mapToProps={mapToProps}>
    //       {({ message }) => <span>child {message}</span>}
    //     </Connect>
    //   )

    //   const App = () => (
    //     <Provider store={store}>
    //       <ConnectedComp>
    //         <ConnectedChildComp />
    //       </ConnectedComp>
    //     </Provider>
    //   )

    //   const wrapper = deep(<App />, { depth: Infinity })

    //   expect(wrapper.html()).toBe(
    //     "<div>parent hello <span>child hello</span></div>"
    //   )

    //   store.setState({ message: "bye" })

    //   expect(wrapper.html()).toBe(
    //     "<div>parent bye <span>child bye</span></div>"
    //   )
    // })
  })
})
