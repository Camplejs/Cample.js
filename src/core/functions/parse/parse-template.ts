"use-strict";
import {
  firstChild,
  nextSibling,
  getParentNode,
  push,
  indexOf
} from "../../../config/config";
import {
  checkFunction,
  createError,
  getElement,
  getSameElements,
  getTextKey,
  isIncludes
} from "../../../shared/utils";
import {
  CurrentKeyType,
  DynamicKeyObjectArrayType,
  DynamicTextType,
  EachTemplateType,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  FunctionsType,
  IndexObjNode,
  NodeDOMType,
  RenderNodeFunctionType,
  ValueType,
  ValuesType
} from "../../../types/types";
import { renderListeners } from "../data/render-listeners";
import { renderEl } from "../render/render-el";
import { parseKey } from "./parse-key";
import { parseText } from "./parse-text";

export const parseTemplate = (
  valueFunctions: [
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => string,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void,
    (...args: any[]) => void
  ],
  template: string,
  index: number,
  id: number,
  values?: ValuesType,
  trim?: boolean,
  getEventsData?: any,
  getEventsFunction?: EventEachGetFunctionType,
  setDataFunctions?: (filtredKeys: DynamicKeyObjectArrayType) => void,
  renderFunctions?: () => void,
  functions?: FunctionsType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isEach?: boolean
): {
  filtredKeys: DynamicKeyObjectArrayType;
  obj: EachTemplateType;
} => {
  const el = getElement(template, trim);
  const filtredKeys: DynamicKeyObjectArrayType = [];

  const obj: EachTemplateType = {
    el,
    nodes: [{ rootId: 0, id: 0 }],
    values: []
  };
  if (isEach) {
    obj.key = {
      value: [],
      render: valueFunctions[0]
    };
  }
  let i = -1;
  const eventArray: any[] = [];
  const createNodeDOM = (
    id: number,
    parentNode: NodeDOMType | null = null,
    path: Array<number> = []
  ) => {
    return {
      id,
      parentNode,
      nextNode: null,
      siblings: [],
      path: [...path, id]
    };
  };
  let DOM: NodeDOMType | undefined = undefined;
  const renderNode = (node: ChildNode, parentDOMNode?: NodeDOMType) => {
    i++;
    const domSiblingNode = createNodeDOM(i, parentDOMNode, parentDOMNode?.path);
    if (parentDOMNode) {
      const { siblings } = parentDOMNode;
      const beforeNodeIndex = siblings.length - 1;
      if (beforeNodeIndex > -1) {
        siblings[beforeNodeIndex].nextNode = domSiblingNode;
      }
      push.call(siblings, domSiblingNode);
    } else DOM = domSiblingNode;
    if (node.nodeType === Node.ELEMENT_NODE) {
      parseText(node as Element);
      renderEl(
        domSiblingNode,
        valueFunctions,
        filtredKeys,
        eventArray,
        node as Element,
        i,
        getEventsData,
        obj.nodes,
        id,
        isEach,
        obj.values,
        values,
        valueName,
        importedDataName,
        indexName,
        id === 0 && isEach,
        obj.key,
        getEventsFunction
      );
      for (
        let currentNode = firstChild.call(node as Element);
        currentNode;
        currentNode = nextSibling.call(currentNode)
      ) {
        renderNode(currentNode, domSiblingNode);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text) {
        const key: string | undefined = getTextKey(text);
        if (key) {
          const data = obj.values.filter(
            (e) => e.type === 1 && (e.key as CurrentKeyType).key === key
          );
          if (data.length > 1) {
            createError("id is unique");
          }
          const index = obj.values.indexOf(data[0]);
          if (index > -1) {
            (obj.values[index].texts as (number | Text)[]).push(
              obj.nodes.length
            );
          } else {
            const renderedKey = parseKey(
              key,
              [
                valueFunctions[3],
                valueFunctions[4],
                valueFunctions[2],
                valueFunctions[5],
                valueFunctions[6],
                valueFunctions[7],
                valueFunctions[8]
              ],
              values,
              valueName,
              importedDataName,
              indexName
            );
            const dynamicText: DynamicTextType = {
              key: renderedKey,
              texts: [obj.nodes.length]
            };
            filtredKeys.push({
              key: renderedKey.originKey,
              properties: renderedKey.properties ?? []
            });
            obj.values.push({
              type: 1,
              ...dynamicText
            });
          }
          if (!isIncludes(obj.nodes, i)) {
            const id = obj.nodes.length;
            const nodeObj: IndexObjNode = {
              rootId: id - 1,
              id: i,
              node: domSiblingNode
            };
            push.call(obj.nodes, nodeObj);
          }
        }
      }
    }
  };
  renderNode(el as ChildNode, DOM);
  const createRender = (
    node: NodeDOMType,
    rootNode: NodeDOMType,
    rootPath: Array<number>
  ) => {
    if (rootNode.siblings[0]?.id === node.id) return firstChild;
    if (rootNode.nextNode?.id === node.id) return nextSibling;
    const { path } = node;
    const fnAlgorithm: Array<RenderNodeFunctionType> = [];
    const maxSameNode = Math.max(...getSameElements(path, rootPath));
    let sameNode: NodeDOMType | undefined = undefined;
    const setSameEl = (newNode: NodeDOMType) => {
      const { parentNode } = newNode;
      if (rootNode.id !== 0 && parentNode) {
        if (newNode.id !== maxSameNode) {
          push.call(fnAlgorithm, getParentNode);
          setSameEl(parentNode);
        } else sameNode = newNode;
      } else {
        sameNode = DOM as NodeDOMType;
      }
    };
    setSameEl(rootNode);
    const sameIndex = indexOf.call(
      path,
      (sameNode as unknown as NodeDOMType).id
    );
    let currentDOMNode = sameNode as unknown as NodeDOMType;
    for (let i = sameIndex + 1; i < path.length; i++) {
      const pathItem = path[i];
      const currentFnAlgorithm: Array<RenderNodeFunctionType> = [];
      const { siblings, nextNode } = currentDOMNode;
      if (nextNode?.id === pathItem) {
        push.call(currentFnAlgorithm, nextSibling);
        currentDOMNode = nextNode;
      } else {
        for (let j = 0; j < siblings.length; j++) {
          const sibling = siblings[j];
          currentDOMNode = sibling;
          if (j === 0) {
            push.call(currentFnAlgorithm, firstChild);
          } else {
            push.call(currentFnAlgorithm, nextSibling);
          }
          if (sibling.id === pathItem) break;
        }
      }
      for (let j = 0; j < currentFnAlgorithm.length; j++) {
        push.call(fnAlgorithm, currentFnAlgorithm[j]);
      }
    }
    function fn(this: Element) {
      let currentEl = this;
      for (let i = 0; i < fnAlgorithm.length; i++) {
        const currentFn: RenderNodeFunctionType = fnAlgorithm[i];
        currentEl = currentFn.call(currentEl) as Element;
      }
      return currentEl;
    }
    return fn;
  };
  for (let i = 1; i < obj.nodes.length; i++) {
    const currentNode = obj.nodes[i];
    let { rootId } = currentNode;
    const { node } = currentNode;
    let rootNode = (obj.nodes[rootId].node ?? DOM) as NodeDOMType;
    const { path: rootPath } = rootNode;
    const parentNodeRepeatNodes: number[] = [];
    obj.nodes[0].node = DOM;
    (obj.nodes[0].node as any).parentNode = { id: 0 };
    const maxSameNodes: number[] = [];
    for (let j = 0; j < i; j++) {
      let k = 0;
      const currentRootMaxNode = obj.nodes[j].node as NodeDOMType;
      const { path: newNodePath } = currentRootMaxNode;
      const maxSameNode = Math.max(
        ...getSameElements((node as NodeDOMType).path, newNodePath)
      );
      push.call(maxSameNodes, maxSameNode);
      if (maxSameNode !== 0) {
        const setSameEl = (newNode: NodeDOMType) => {
          const { parentNode } = newNode;
          if (parentNode) {
            if (newNode.id !== maxSameNode) {
              k++;
              setSameEl(parentNode);
            } else {
              push.call(parentNodeRepeatNodes, k);
            }
          } else createError("Error");
        };
        setSameEl(currentRootMaxNode);
      } else {
        push.call(parentNodeRepeatNodes, Infinity);
      }
    }
    if (parentNodeRepeatNodes.length) {
      const maxMaxSameNode = Math.max(...maxSameNodes);
      if (maxMaxSameNode === 0) {
        delete (obj.nodes[0].node as any).parentNode;
        const newRootNode = DOM as unknown as NodeDOMType;
        rootId = 0;
        rootNode = newRootNode;
        currentNode.rootId = rootId;
        delete obj.nodes[0].node;
      } else {
        const minNode = Math.min(...parentNodeRepeatNodes);
        const indexMinNode = indexOf.call(parentNodeRepeatNodes, minNode);
        delete (obj.nodes[0].node as any).parentNode;
        const newRootNode = !indexMinNode ? DOM : obj.nodes[indexMinNode].node;
        rootId = indexMinNode;
        rootNode = newRootNode as NodeDOMType;
        currentNode.rootId = rootId;
        delete obj.nodes[0].node;
      }
    }
    currentNode.render = createRender(node as NodeDOMType, rootNode, rootPath);
  }
  for (let i = 1; i < obj.nodes.length; i++) {
    const currentNode = obj.nodes[i];
    delete currentNode.node;
    delete currentNode.id;
  }
  obj.nodes.shift();
  setDataFunctions?.(filtredKeys);
  renderFunctions?.();
  for (const {
    elId,
    indexValue,
    args,
    keyEvent,
    getEventsData,
    getEventsFunction,
    renderedKey,
    id,
    key
  } of eventArray) {
    const fn = isEach
      ? (getEventsFunction as EventEachGetFunctionType)?.(
          renderedKey.key,
          id,
          key
        )
      : (getEventsFunction as EventEachGetFunctionType)?.(
          renderedKey.key,
          id,
          key,
          functions
        );
    if (!checkFunction(fn)) createError("Data key is of function type");
    const setEvent = (element: Element, keyEl?: string) => {
      renderListeners(element, fn, args, keyEvent, (key: string) =>
        isEach
          ? (getEventsData as EventEachGetDataType)(key, id, keyEl, index)
          : (getEventsData as EventGetDataType)(key, id)
      );
    };
    const newVal: ValueType = {
      id: elId,
      type: 0,
      render: (element: Element, keyEl: string) => setEvent(element, keyEl)
    };
    obj.values[indexValue] = newVal;
  }
  return { filtredKeys, obj };
};
