"use-strict";
import {
  firstChild,
  nextSibling,
  push,
  indexOf,
  pop,
  unshift,
  updText,
  updClass
} from "../../../config/config";
import {
  checkFunction,
  createError,
  getElement,
  getTextKey
} from "../../../shared/utils";
import {
  AttributesValType,
  ClassType,
  CurrentKeyType,
  DynamicEl,
  DynamicNodesObjectType,
  DynamicTextType,
  EachTemplateType,
  EventEachGetDataType,
  EventEachGetFunctionType,
  EventGetDataType,
  ExportDataType,
  ExportDynamicType,
  FunctionEventType,
  FunctionsType,
  ImportDataType,
  IndexObjNode,
  NodeDOMType,
  NodeTextType,
  NodeValueType,
  NodeValuesType,
  RenderNodeFunctionType,
  ValueItemsType,
  ValueType,
  ValuesType
} from "../../../types/types";
import { renderListeners } from "../data/render-listeners";
import { updateAttributes } from "../data/update-attributes";
import { renderComponentTemplate } from "../render/render-component-template";
import { renderEl } from "../render/render-el";
import { renderImport } from "../render/render-import";
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
    nodes: [firstNode]
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
      values: [],
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
    const newNode: IndexObjNode = isUndefined
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
        domSiblingNode.values,
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
          newNode.isText = true;
          dynamicNodesObj[domSiblingNode.id] = domSiblingNode.path;
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
            text: i
          };
          const nodeObj = {
            type: 1,
            ...dynamicText
          };
          push.call(domSiblingNode.values, nodeObj);
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
  setDataFunctions?.();
  renderFunctions?.();
  for (const {
    elId,
    values,
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
    values[indexValue] = newVal;
  }
  const renderValue = (val: ValueType) => {
    const valKey = val.key as CurrentKeyType;
    switch (val.type) {
      case 0:
        return (
          newValues: NodeValuesType,
          val: ValueType,
          node: ChildNode,
          renderDynamic: (...args: any[]) => any,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType
        ) => {
          const { render } = val;
          (render as FunctionEventType)(node, key);
        };
      case 1:
        return (
          newValues: NodeValuesType,
          currentVal: ValueType,
          node: ChildNode,
          renderDynamic: (...args: any[]) => any,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType
        ) => {
          const newData = renderDynamic(
            valKey,
            indexData,
            importData,
            eachIndex
          );
          let old = newData;
          updText.call(node, newData);
          const fnText = (
            currentIndexData: any,
            currentImportData: any,
            currentEachIndex: number | undefined,
            _: NodeTextType
          ) => {
            const newData = renderDynamic(
              valKey,
              currentIndexData,
              currentImportData,
              currentEachIndex
            );
            if (old !== newData) {
              updText.call(node, newData);
              old = newData;
            }
          };
          push.call(newValues, {
            render: fnText,
            type: 1,
            key: valKey
          } as NodeValueType);
        };
      case 2:
        return (
          newValues: NodeValuesType,
          val: ValueType,
          node: ChildNode,
          renderDynamic: (...args: any[]) => any,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType
        ) => {
          const fnAttr = (
            currentIndexData: any,
            currentImportData: any,
            currentEachIndex: number | undefined
          ) => {
            const fnNew = (key: CurrentKeyType) =>
              renderDynamic(
                key,
                currentIndexData,
                currentImportData,
                currentEachIndex
              );
            updateAttributes(node as DynamicEl, val, fnNew);
          };
          fnAttr(indexData, importData, eachIndex);
          push.call(newValues, {
            render: fnAttr,
            ...(val as AttributesValType)
          } as NodeValueType);
        };
      case 3:
        return (
          newValues: NodeValuesType,
          val: ValueType,
          node: ChildNode,
          renderDynamic: (...args: any[]) => any,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType
        ) => {
          const componentName = (node as Element).getAttribute("data-cample");
          const keyImportString = val.value;
          if (keyImportString && componentName) {
            const newImportString = renderComponentTemplate(
              currentExport,
              exportFunctions,
              keyImportString,
              index,
              componentName
            );
            renderImport(node as Element, undefined, newImportString);
          } else {
            createError("Render export error");
          }
        };
      default:
        return (
          newValues: NodeValuesType,
          val: ValueType,
          node: ChildNode,
          renderDynamic: (...args: any[]) => any,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType
        ) => {
          const { classes } = val;
          const { value: classListValue, render: renderClass } =
            classes as ValueItemsType;
          const str = renderClass(
            indexData,
            classListValue,
            importData,
            eachIndex
          );
          const fnClass = (
            currentIndexData: any,
            currentImportData: any,
            currentEachIndex: number | undefined
          ) => {
            const classVal = renderClass(
              currentIndexData,
              classListValue,
              currentImportData,
              currentEachIndex
            );
            if ((node as Element).className !== classVal) {
              updClass.call(node, classVal);
            }
          };
          if (str !== "") {
            updClass.call(node, str);
          }
          push.call(newValues, {
            render: fnClass,
            ...(val as ClassType)
          } as NodeValueType);
        };
    }
  };
  const renderFunction = (
    currentNode: IndexObjNode,
    arr: RenderNodeFunctionType[],
    currentRender?: (this: Element) => any
  ) => {
    const { node } = currentNode;
    const isCurrentRender = currentRender !== undefined;
    const arrLength = arr.length;
    let currentFn: RenderNodeFunctionType = isCurrentRender
      ? currentRender
      : function fn(this: Element) {
          let currentEl = this;
          for (let j = 0; j < arrLength; j++) {
            const currentFn: RenderNodeFunctionType = arr[j];
            currentEl = currentFn.call(currentEl) as Element;
          }
          return currentEl;
        };
    const { values: nodeValues } = node as NodeDOMType;
    const valuesLength = nodeValues.length;
    if (valuesLength !== 0) {
      if (valuesLength === 1) {
        const val = nodeValues[0];
        const valueFn = renderValue(val);
        currentFn = isCurrentRender
          ? function fn(
              this: Element,
              newValues: NodeValuesType,
              renderDynamic: (...args: any[]) => any,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType
            ) {
              const currentEl = currentRender.call(this);
              valueFn(
                newValues,
                val,
                currentEl,
                renderDynamic,
                indexData,
                eachIndex,
                importData,
                key,
                exportFunctions,
                currentExport
              );
              return currentEl;
            }
          : function fn(
              this: Element,
              newValues: NodeValuesType,
              renderDynamic: (...args: any[]) => any,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType
            ) {
              let currentEl = this;
              for (let j = 0; j < arrLength; j++) {
                const currentFn: RenderNodeFunctionType = arr[j];
                currentEl = currentFn.call(currentEl) as Element;
              }
              valueFn(
                newValues,
                val,
                currentEl,
                renderDynamic,
                indexData,
                eachIndex,
                importData,
                key,
                exportFunctions,
                currentExport
              );
              return currentEl;
            };
      } else {
        const valFns = nodeValues.map((val) => {
          return renderValue(val);
        });
        const fnsLength = valFns.length;
        currentFn = isCurrentRender
          ? function fn(
              this: Element,
              newValues: NodeValuesType,
              renderDynamic: (...args: any[]) => any,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType
            ) {
              const currentEl = currentRender.call(this);
              for (let i = 0; i < fnsLength; i++) {
                const valueFn = valFns[i];
                valueFn(
                  newValues,
                  nodeValues[i],
                  currentEl,
                  renderDynamic,
                  indexData,
                  eachIndex,
                  importData,
                  key,
                  exportFunctions,
                  currentExport
                );
              }
              return currentEl;
            }
          : function fn(
              this: Element,
              newValues: NodeValuesType,
              renderDynamic: (...args: any[]) => any,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType
            ) {
              let currentEl = this;
              for (let j = 0; j < arrLength; j++) {
                const currentFn: RenderNodeFunctionType = arr[j];
                currentEl = currentFn.call(currentEl) as Element;
              }
              for (let i = 0; i < fnsLength; i++) {
                const valueFn = valFns[i];
                valueFn(
                  newValues,
                  nodeValues[i],
                  currentEl,
                  renderDynamic,
                  indexData,
                  eachIndex,
                  importData,
                  key,
                  exportFunctions,
                  currentExport
                );
              }
              return currentEl;
            };
      }
    }
    return currentFn;
  };
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
        const fn = renderFunction(currentNode, arr);
        newObj.render = fn;
        fnAlgorithm = [];
      } else {
        newObj.render = renderFunction(currentNode, [], render);
      }
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
          const fnDynamicNodeAlgorithm: RenderNodeFunctionType[] = [];
          const { path } = dynamicNode.node as NodeDOMType;
          for (let k = path.length - 1; k >= 0; k--) {
            const pathItem = path[k];
            if (pathItem.id === currentNodeId) {
              if (fnDynamicNodeAlgorithm.length !== 1) {
                const fn = renderFunction(dynamicNode, fnDynamicNodeAlgorithm);
                newObj.render = fn;
              } else {
                newObj.render = renderFunction(
                  dynamicNode,
                  [],
                  fnDynamicNodeAlgorithm[0]
                );
              }
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
  const { values: nodeValues } = DOM as unknown as NodeDOMType;
  const valuesLength = nodeValues.length;
  if (valuesLength !== 0) {
    if (valuesLength === 1) {
      const val = nodeValues[0];
      const valueFn = renderValue(val);
      obj.render = function (
        this: Element,
        newValues: NodeValuesType,
        renderDynamic: (...args: any[]) => any,
        indexData: any,
        eachIndex?: number,
        importData?: ImportDataType,
        key?: string,
        exportFunctions?: any,
        currentExport?: ExportDataType | ExportDynamicType
      ) {
        valueFn(
          newValues,
          val,
          this,
          renderDynamic,
          indexData,
          eachIndex,
          importData,
          key,
          exportFunctions,
          currentExport
        );
      };
    } else {
      const valFns = nodeValues.map((val) => {
        return renderValue(val);
      });
      const fnsLength = valFns.length;
      obj.render = function (
        this: Element,
        newValues: NodeValuesType,
        renderDynamic: (...args: any[]) => any,
        indexData: any,
        eachIndex?: number,
        importData?: ImportDataType,
        key?: string,
        exportFunctions?: any,
        currentExport?: ExportDataType | ExportDynamicType
      ) {
        for (let i = 0; i < fnsLength; i++) {
          const valueFn = valFns[i];
          valueFn(
            newValues,
            nodeValues[i],
            this,
            renderDynamic,
            indexData,
            eachIndex,
            importData,
            key,
            exportFunctions,
            currentExport
          );
        }
      };
    }
  }
  obj.nodes.shift();
  return { obj };
};
