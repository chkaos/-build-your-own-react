export const isObject = (obj: null | Array<any> | object): boolean => { return !(obj === null || Array.isArray(obj) || typeof obj !== "object") }

export function replaceContent(range: Range, node) {
  range.insertNode(node);
  range.setStartAfter(node);
  range.deleteContents();

  range.setStartBefore(node);
  range.setEndAfter(node);
}