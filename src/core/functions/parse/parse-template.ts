"use-strict";
import {
  firstChild,
  nextSibling,
  push,
  indexOf,
  pop,
  unshift
} from "../../../config/config";
import {
  checkFunction,
  createError,
  getElement,
  getTextKey
} from "../../../shared/utils";
import {
  CurrentKeyType,
  DynamicNodesObjectType,
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
  setDataFunctions?: () => void,
  renderFunctions?: () => void,
  functions?: FunctionsType,
  valueName?: string,
  importedDataName?: string,
  indexName?: string,
  isEach?: boolean
): {
  obj: EachTemplateType;
} => {
  const el = getElement(template, trim);
  const firstNode: IndexObjNode = { rootId: 0, id: 0 };
  const stackNodes = [firstNode];
  const dynamicNodesObj: DynamicNodesObjectType = {};
  const obj: EachTemplateType = {
    el,
    nodes: [firstNode],
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
    newNode: IndexObjNode,
    id: number,
    parentNode: NodeDOMType | null = null,
    path: Array<IndexObjNode> = [],
    previousNodePath?: Array<IndexObjNode>
  ): NodeDOMType => {
    const newPath = previousNodePath
      ? [...previousNodePath, newNode]
      : [...path, newNode];
    return {
      id,
      parentNode,
      nextNode: null,
      siblings: [],
      path: newPath
    };
  };
  const createNodeObj = (
    newNode: IndexObjNode,
    rootId: number,
    id: number,
    node: NodeDOMType,
    isNext: boolean
  ): void => {
    newNode.rootId = rootId;
    newNode.id = id;
    newNode.node = node;
    newNode.isNext = isNext;
  };
  let DOM: NodeDOMType | undefined = undefined;
  const renderNode = (
    node: ChildNode,
    parentDOMNode?: NodeDOMType,
    previousNode?: NodeDOMType,
    isNext?: boolean
  ) => {
    i++;
    const isUndefined = isNext !== undefined;
    let newNode: IndexObjNode = isUndefined
      ? ({} as unknown as IndexObjNode)
      : firstNode;
    const domSiblingNode = createNodeDOM(
      newNode as IndexObjNode,
      i,
      parentDOMNode,
      parentDOMNode?.path,
      previousNode?.path
    );
    if (parentDOMNode) {
      const { siblings } = parentDOMNode;
      const beforeNodeIndex = siblings.length - 1;
      if (beforeNodeIndex > -1) {
        siblings[beforeNodeIndex].nextNode = domSiblingNode;
      }
      push.call(siblings, domSiblingNode);
    } else DOM = domSiblingNode;
    if (isUndefined) {
      const rootId = isNext ? previousNode?.id ?? 0 : parentDOMNode?.id ?? 0;
      createNodeObj(newNode, rootId, i, domSiblingNode, isNext);
      push.call(stackNodes, newNode);
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      parseText(node as Element);
      renderEl(
        valueFunctions,
        eventArray,
        node as Element,
        getEventsData,
        newNode,
        dynamicNodesObj,
        id,
        obj.values,
        values,
        valueName,
        importedDataName,
        indexName,
        isEach,
        obj.key,
        getEventsFunction
      );
      let j = 0;
      for (
        let currentNode = firstChild.call(node as Element);
        currentNode;
        currentNode = nextSibling.call(currentNode)
      ) {
        const previousId = j - 1;
        renderNode(
          currentNode,
          domSiblingNode,
          domSiblingNode?.siblings[previousId],
          !!j++
        );
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
          const searchedNodeObj = data[0];
          newNode.isText = true;
          dynamicNodesObj[domSiblingNode.id] = domSiblingNode.path;
          if (searchedNodeObj) {
            push.call(searchedNodeObj.texts, i);
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
                valueFunctions[8],
                valueFunctions[9],
                valueFunctions[10],
                valueFunctions[11]
              ],
              values,
              valueName,
              importedDataName,
              indexName
            );
            const dynamicText: DynamicTextType = {
              key: renderedKey,
              texts: [i]
            };
            const nodeObj = {
              type: 1,
              ...dynamicText
            };
            obj.values.push(nodeObj);
          }
        }
      }
    }
  };
  renderNode(el as ChildNode, DOM);
  const stackLineNodes: Array<IndexObjNode> = [];
  for (let i = 0; i < stackNodes.length; i++) {
    const stackNode = stackNodes[i];
    if (stackNode.id !== undefined && stackNode.id in dynamicNodesObj) {
      const path = dynamicNodesObj[stackNode.id];
      if (stackLineNodes.length) {
        let indexPathItem = 0;
        const length = path.length;
        for (let j = length - 1; -1 < j; j--) {
          const pathItem = path[j];
          if (stackLineNodes.includes(pathItem)) {
            indexPathItem = indexOf.call(stackLineNodes, pathItem);
            if (indexPathItem + 1) {
              const dynamicNodes = [];
              for (let k = stackLineNodes.length - 1; k > indexPathItem; k--) {
                const currentPathNode = pop.call(stackLineNodes);
                const currentDynamicNodes = currentPathNode.dynamicNodes;
                if (currentDynamicNodes) {
                  for (let l = 0; l < currentDynamicNodes.length; l++) {
                    push.call(dynamicNodes, currentDynamicNodes[l]);
                  }
                }
              }
              if (dynamicNodes.length) {
                if ("dynamicNodes" in pathItem) {
                  pathItem.dynamicNodes = [
                    ...(pathItem.dynamicNodes as IndexObjNode[]),
                    ...dynamicNodes
                  ];
                } else {
                  pathItem.dynamicNodes = dynamicNodes;
                }
              }
              for (let j = indexPathItem + 1; j < length; j++) {
                const pathItem = path[j];
                push.call(stackLineNodes, pathItem);
              }
            }
            break;
          }
        }
        const dynamicNode = stackLineNodes[stackLineNodes.length - 1];
        if (dynamicNode.dynamicNodes) {
          push.call(dynamicNode.dynamicNodes, dynamicNode);
        } else {
          dynamicNode.dynamicNodes = [dynamicNode];
        }
      } else {
        for (let j = 0; j < path.length; j++) {
          push.call(stackLineNodes, path[j]);
        }
        stackNode.dynamicNodes = [stackNode];
      }
    }
  }
  let fnAlgorithm: Array<RenderNodeFunctionType> = [];
  let rootId = 0;
  let dynamicLength = 0;
  for (let i = 1; i < stackLineNodes.length; i++) {
    const currentNode = stackLineNodes[i];
    const render = currentNode.isNext ? nextSibling : firstChild;
    const { dynamicNodes } = currentNode;
    if (dynamicNodes) {
      const currentNodeId = currentNode.id;
      const newObj: IndexObjNode = {
        rootId,
        id: currentNodeId
      };
      if (fnAlgorithm.length) {
        push.call(fnAlgorithm, render);
        const arr = [...fnAlgorithm];
        function fn(this: Element) {
          let currentEl = this;
          for (let j = 0; j < arr.length; j++) {
            const currentFn: RenderNodeFunctionType = arr[j];
            currentEl = currentFn.call(currentEl) as Element;
          }
          return currentEl;
        }
        newObj.render = fn;
        fnAlgorithm = [];
      } else newObj.render = render;
      push.call(obj.nodes, newObj);
      rootId = rootId + dynamicLength + 1;
      dynamicLength = dynamicNodes.length;
      for (let j = 0; j < dynamicNodes.length; j++) {
        const dynamicNode = dynamicNodes[j];
        const dynamicNodeId = dynamicNode.id;
        if (dynamicNodeId !== currentNodeId) {
          const newObj: IndexObjNode = {
            rootId,
            id: dynamicNodeId
          };
          let fnDynamicNodeAlgorithm = [];
          const { path } = dynamicNode.node as NodeDOMType;
          for (let k = path.length - 1; k >= 0; k--) {
            const pathItem = path[k];
            if (pathItem.id === currentNodeId) {
              if (fnDynamicNodeAlgorithm.length !== 1) {
                function fn(this: Element) {
                  let currentEl = this;
                  for (let l = 0; l < fnDynamicNodeAlgorithm.length; l++) {
                    const currentFn: RenderNodeFunctionType =
                      fnDynamicNodeAlgorithm[l];
                    currentEl = currentFn.call(currentEl) as Element;
                  }
                  return currentEl;
                }
                newObj.render = fn;
              } else newObj.render = fnDynamicNodeAlgorithm[0];
              break;
            } else {
              const pathRender = pathItem.isNext ? nextSibling : firstChild;
              unshift.call(fnDynamicNodeAlgorithm, pathRender);
            }
          }
          push.call(obj.nodes, newObj);
        } else dynamicLength--;
      }
    } else fnAlgorithm.push(render);
  }
  setDataFunctions?.();
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
    const fn = (getEventsFunction as EventEachGetFunctionType)?.(
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
  for (let i = 0; i < obj.values.length; i++) {
    const value = obj.values[i];
    if (value.type === 1) {
      if (value.texts)
        value.texts = value.texts.map((e) => {
          for (let j = 0; j < obj.nodes.length; j++) {
            const currentNode = obj.nodes[j];
            if (currentNode.id === e) {
              return j as number;
            }
          }
          return -1;
        });
    } else {
      for (let j = 0; j < obj.nodes.length; j++) {
        const currentNode = obj.nodes[j];
        if (currentNode.id === value.id) {
          value.id = j;
          break;
        }
      }
    }
  }
  obj.nodes.shift();
  return { obj };
};
