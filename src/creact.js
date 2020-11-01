import createElement from "./utils/createElement"
import render from "./utils/render"

class ReactComponent {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  get root() {
    if(!this._root) {
      this._root = this.render().root
    }
    return this._root
  } 
}

export {
  createElement,
  render,
  ReactComponent
}