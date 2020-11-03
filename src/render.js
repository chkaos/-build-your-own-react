import { RENDER_TO_DOM } from "./const"

const render = function(component, parentElement) {
  let range = document.createRange()
  range.setStart(parentElement,0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  component[RENDER_TO_DOM](range)
}

export default render