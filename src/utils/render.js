import { RENDER_TO_DOM } from "./type"

const render = function(component, parentElement) {
  let range = document.createRange()
  range.setStart(parentElement,0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  // parentElement.deleteContents()
  component[RENDER_TO_DOM](range)
}

export default render