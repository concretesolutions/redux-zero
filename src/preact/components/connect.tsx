import { h, Component } from "preact"

import shallowEqual from "../../utils/shallowEqual"
import bindActions from "../../utils/bindActions"

export class Connect extends Component<any, {}> {
  unsubscribe
  state = this.getProps()
  actions = this.getActions()
  componentWillMount() {
    this.unsubscribe = this.context.store.subscribe(this.update)
  }
  componentWillUnmount() {
    this.unsubscribe(this.update)
  }
  getProps() {
    const { mapToProps } = this.props
    const state = (this.context.store && this.context.store.getState()) || {}
    return mapToProps ? mapToProps(state, this.props) : state
  }
  getActions() {
    const { actions } = this.props
    return bindActions(
      typeof actions === "function" ? actions(this.context.store) : actions,
      this.context.store
    )
  }
  update = () => {
    const mapped = this.getProps()
    if (!shallowEqual(mapped, this.state)) {
      this.setState(mapped)
    }
  }
  render({ children }, state, { store }) {
    return children({ store, ...state, ...this.actions })
  }
}

export default function connect(mapToProps, actions = {}) {
  return Child => props =>
    h(Connect, { mapToProps, actions }, mappedProps =>
      h(Child, { ...mappedProps, ...props })
    )
}
