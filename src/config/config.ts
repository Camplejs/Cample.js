export const VALUE_REGEX = /\[+(.*?)\]+/g;
export const MAIN_REGEX = /\{{(.*?)}}/g;
export const MAIN_KEEP_DOUBLE_QUOTES_REGEX = /(\{\{.*?\}\})/g;
export const IMPORT_REGEX = /\{{{(.*?)}}}/g;
export const CONDITION_REGEX = /!/g;
export const TEXT_REGEX = /\{\{\s*([^}]+)\s*\}\}|([^{}]+)/g;
export const SPACE_REGEX = /\s+/g;
export const CLICK_FUNCTION_NAME = "__click__";
export const { appendChild, insertBefore, removeChild, replaceChild } =
  Node.prototype;
export const updText = Object.getOwnPropertyDescriptor(
  CharacterData.prototype,
  "data"
)?.set as (v: any) => void;
export const addClass = DOMTokenList.prototype.add;
export const removeClass = DOMTokenList.prototype.remove;
export const cloneNode = Node.prototype.cloneNode;
export const { push } = Array.prototype;
export const { setAttribute, removeAttribute, replaceChildren, remove } =
  Element.prototype;
