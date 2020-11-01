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

const createElement = function (type, attributres, ...children) {

  let element 

  if( typeof type === "string" ){
    element = new ElementWrapper(type)
  } else {
    element = new type
  }

  for(let p in attributres) {
    element.setAttribute(p, attributres[p])
  }

  let insertChildren = (children) => {
    for(let child in children) {
      if(typeof child === "string"){
        child = new TextWrapper(type)
      }
      if(Array.isArray(child)){
        insertChildren(child)
      } else {
        element.appendChild(child)
      }
    }
  }

  insertChildren(children)

  return element
}

export default createElement