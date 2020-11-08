export const isObject = (obj) => { return !(obj === null || typeof obj !== "object") }

export function replaceContent(range, node) {
  range.insertNode(node);
  range.setStartAfter(node);
  range.deleteContents();

  range.setStartBefore(node);
  range.setEndAfter(node);
}