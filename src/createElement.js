import { RENDER_TO_DOM } from "./const"
import { isObject, replaceContent } from "./utils"

export class Component {
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
    let oldRange = this._range
    let range = document.createRange()
    range.setStart(oldRange.startContainer, oldRange.startOffset)
    range.setEnd(oldRange.startContainer, oldRange.startOffset)
    this[RENDER_TO_DOM](range)

    oldRange.setStart(range.endContainer, range.endOffset)
    oldRange.deleteContents()
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
  get vdom(){
    return this.render().vdom
  }
  get vchildren(){
    return this.children.map(child => child.vdom)
  }
}
class ElementWrapper extends Component {
  constructor(type) {
    super()
    this.type = type
  }
  // setAttribute(name, value) {
  //   if (name.match(/^on([\s\S]+)$/)) {
  //     this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, c=>c.toLowerCase()), value)
  //     return
  //   }
  //   if(name === "className") {
  //     name = "class"
  //   }
    
  //   this.root.setAttribute(name, value)
    
  // }
  // appendChild(component) {
  //   let range = document.createRange()
  //   range.setStart(this.root, this.root.childNodes.length)
  //   range.setEnd(this.root, this.root.childNodes.length)
  //   component[RENDER_TO_DOM](range)
  //   // this.root.appendChild(component.root)
  // }
  [RENDER_TO_DOM](range) {
    range.deleteContents()
    const root = document.createElement(this.type)

    for (let name in this.props) {
      const value = this.props[name]
      if (name.match(/^on([\s\S]+)$/)) {
          root.addEventListener(RegExp.$1.replace(/^[\s\S]/, (s) => s.toLowerCase()), value);
      } else if (name === 'className') {
          root.setAttribute('class', value);
      } else {
          root.setAttribute(name, value);
      }
    } 
      for (let component of this.vchildren) {
        let childRange = document.createRange();
        childRange.setStart(root, root.childNodes.length);
        childRange.setEnd(root, root.childNodes.length);
        component[RENDER_TO_DOM](childRange);
    }

    this._root = root;

    range.insertNode(root)
  }
  get vdom(){
    return this
    // return {
    //   type: this.type,
    //   props: this.props,
    //   children: this.children.map(child => child.vdom)
    // }
  }
}

class TextWrapper extends Component{
  constructor(content) {
    super()
    this.type =  "#text"
    this.content = content
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
  get vdom(){
    return this
    // return {
    //   type: "#text",
    //   content: this.content
    // }
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

  let insertChildren = (e, children) => {
    
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child)
      }
  
      if (child === null) {
        continue
      }
  
      Array.isArray(child) ? insertChildren(e, child) : e.appendChild(child)
    }
  }

  insertChildren(element, children)

  return element
}