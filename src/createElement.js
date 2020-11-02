import { RENDER_TO_DOM } from "./type"
import { isObject } from "./utils"

class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c=>c.toLowerCase()), value)
      return
    }
    this.root.setAttribute(name, value)
  }
  appendChild(component) {
    let range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    component[RENDER_TO_DOM](range)
    // this.root.appendChild(component.root)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

export class ReactComponent {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
    this._range = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  [RENDER_TO_DOM](range) {
    this._range = range
    this.render()[RENDER_TO_DOM](range)
  }
  rerender(){
    this._range.deleteContents()
    this[RENDER_TO_DOM](this._range)
  }
  setState(newState){
    if(!isObject(this.state)) {
      this.state = newState
      this.rerender()
      return
    }
    let merge = (oldState, newState) => {
      for(let p in newState) {
        if(!isObject(oldState[p])){
          oldState[p] = newState[p]
        } else {
          merge(oldState[p] , newState[p])
        }
      }
    }

    merge(this.state, newState)

    this.rerender()
  }
}

export const createElement = function (type, attributres, ...children) {

  let element 

  if( typeof type === "string" ){
    element = new ElementWrapper(type)
  } else {
    element = new type
  }

  for(let p in attributres) {
    element.setAttribute(p, attributres[p])
  }

  // let insertChildren = (children) => {
  //   for(let child in children) {
  //     if(typeof child === "string"){
  //       child = new TextWrapper(type)
  //     }
  //     if(Array.isArray(child)){
  //       insertChildren(child)
  //     } else {
  //       element.appendChild(child)
  //     }
  //   }
  // }

  let insertChildren = children => {
    for (let child of children) {
      if (typeof child === 'object' && child instanceof Array) {
        insertChildren(child)
      } else {
        if (!(child instanceof ReactComponent) && !(child instanceof ElementWrapper) && !(child instanceof TextWrapper))
          child = child.toString()
        if (typeof child === 'string')
          child = new TextWrapper(child)
        element.appendChild(child)
      }
    }  
  }

  insertChildren(children)

  return element
}