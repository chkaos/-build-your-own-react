class ElementWrapper {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(component) {
    this.root.appendChild(component.root)
  }
}

class TextWrapper {
  constructor(type) {
    this.root = document.createTextNode(type)
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
  get root() {
    if(!this._root) {
      console.log(this.render())
      this._root = this.render().root
    }
    return this._root
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