import { RENDER_TO_DOM } from "./type"
class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
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
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(component) {
    this.children.push(component)
  }
  [RENDER_TO_DOM](range) {
    this.render()[RENDER_TO_DOM](range)
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