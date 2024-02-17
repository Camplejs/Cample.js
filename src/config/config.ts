export const VALUE_REGEX = /\[+(.*?)\]+/g;
export const MAIN_REGEX = /\{{(.*?)}}/g;
export const MAIN_KEEP_DOUBLE_QUOTES_REGEX = /(\{\{.*?\}\})/g;
export const IMPORT_REGEX = /\{{{(.*?)}}}/g;
export const CONDITION_REGEX = /!/g;
export const TEXT_REGEX = /\{\{\s*([^}]+)\s*\}\}|([^{}]+)/g;
export const SPACE_REGEX = /\s+/g;
export const EXCLAMATION_POINT = /(\!)/g;
export const { appendChild, insertBefore, removeChild, replaceChild } =
  Node.prototype;
export const updText = (
  Object.getOwnPropertyDescriptor(CharacterData.prototype, "data") as any
).set as (v: any) => void;
export const updClass = (
  Object.getOwnPropertyDescriptor(Element.prototype, "className") as any
).set as (v: any) => void;
export const firstChild = (
  Object.getOwnPropertyDescriptor(Node.prototype, "firstChild") as any
).get as (this: Element) => any;
export const nextSibling = (
  Object.getOwnPropertyDescriptor(Node.prototype, "nextSibling") as any
).get as (this: Element) => any;
export const previousSibling = (
  Object.getOwnPropertyDescriptor(Node.prototype, "previousSibling") as any
).get as (this: Element) => any;
export const getParentNode = (
  Object.getOwnPropertyDescriptor(Node.prototype, "parentNode") as any
).get as (this: Element) => any;

export const cloneNode = Node.prototype.cloneNode;
export const { push, indexOf, map: mapArray, unshift, pop } = Array.prototype;
export const { split } = String.prototype;
export const {
  setAttribute,
  removeAttribute,
  replaceChildren,
  remove,
  hasAttribute,
  getAttribute
} = Element.prototype;
export const { has: setHas, add } = Set.prototype;
export const { set, has, get } = Map.prototype;
export const { concat } = String.prototype;
