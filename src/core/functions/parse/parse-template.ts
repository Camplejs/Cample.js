"use-strict";
import {
  firstChild,
  nextSibling,
  push,
  indexOf,
  pop,
  unshift,
  updClass,
  CLICK_FUNCTION_NAME
} from "../../../config/config";
import {
  checkFunction,
  checkObject,
  createError,
  getElement,
  getTextKey
} from "../../../shared/utils";
import {
  CurrentKeyType,
  DynamicEachDataType,
  DynamicEl,
  DynamicNodesObjectType,
  DynamicTextType,
  EachTemplateType,
  EventEachGetFunctionType,
  EventGetDataType,
  ExportDataType,
  ExportDynamicType,
  FunctionEventType,
  FunctionsType,
  GetStackType,
  ImportDataType,
  IndexObjNode,
  NodeDOMType,
  NodeTextType,
  RenderNodeFunctionType,
  StackType,
  ValueItemsType,
  ValueSingleType,
  ValueType,
  ValuesType
} from "../../../types/types";
import { updateAttributes } from "../data/update-attributes";
import { renderComponentTemplate } from "../render/render-component-template";
import { renderEl } from "../render/render-el";
import { renderImport } from "../render/render-import";
import { renderKeyData } from "../render/render-key-data";
import { parseKey } from "./parse-key";
import { parseText } from "./parse-text";

export const parseTemplate = (
  setEventListener: () => void,
  renderDynamic: (...args: any[]) => any,
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
  getEventsData1?: any,
  getEventsData2?: EventGetDataType,
  getEventsFunction?: EventEachGetFunctionType,
  setDataFunctions?: () => void,
  renderFunctions?: () => void,
  functions?: FunctionsType,
  valueName?: string,
  importedDataName?: string,
  stackName?: string,
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
    valuesLength: 0,
    values: []
  };
  if (isEach) {
    obj.key = {
      value: [],
      render: valueFunctions[0]
    };
    obj.valuesImport = [];
    obj.eachStackValues = [];
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
        setEventListener,
        isEach,
        valueFunctions,
        eventArray,
        node as Element,
        getEventsData1,
        getEventsData2,
        newNode,
        dynamicNodesObj,
        id,
        domSiblingNode.values,
        values,
        valueName,
        importedDataName,
        stackName,
        indexName,
        isEach,
        obj.key,
        obj.eachStackValues,
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
    getEventsData1,
    getEventsFunction,
    renderedKey,
    id,
    key,
    isItemEvent
  } of eventArray) {
    const fn = (getEventsFunction as EventEachGetFunctionType)?.(
      renderedKey.key,
      id,
      key,
      functions
    );
    if (!checkFunction(fn)) createError("Data key is of function type");
    let setEvent: any;
    const argsLength = args.length;
    const setClickEvent = isItemEvent
      ? (element: Element, eventFn: (event: Event) => void) => {
          element[CLICK_FUNCTION_NAME] = [eventFn, true];
        }
      : (element: Element, eventFn: (event: Event) => void) => {
          element[CLICK_FUNCTION_NAME] = [eventFn];
        };
    if (isEach === true) {
      if (keyEvent === "click") {
        if (argsLength > 0) {
          if (argsLength === 1) {
            const { renderedKey: newRenderedKey, getEventsDataFn } = args[0];
            setEvent = (
              element: Element,
              currentComponent: any,
              mainEl: Element,
              keyEl?: string,
              eachValue?: any,
              getStack?: GetStackType
            ) => {
              if (element) {
                const eventFn = (event: Event) => {
                  const newArg = getEventsDataFn(
                    mainEl,
                    index,
                    newRenderedKey,
                    eachValue
                  );
                  fn(event, getStack!())(newArg);
                };
                setClickEvent(element, eventFn);
              }
            };
          } else {
            setEvent = (
              element: Element,
              currentComponent: any,
              mainEl: Element,
              keyEl?: string,
              eachValue?: any,
              getStack?: GetStackType
            ) => {
              if (element) {
                const eventFn = (event: Event) => {
                  const newArgs = new Array(argsLength);
                  for (let i = 0; i < argsLength; i++) {
                    const { renderedKey, getEventsDataFn } = args[i];
                    newArgs[i] = getEventsDataFn(
                      mainEl,
                      index,
                      renderedKey,
                      eachValue
                    );
                  }
                  fn(event, getStack!())(...newArgs);
                };
                setClickEvent(element, eventFn);
              }
            };
          }
        } else {
          setEvent = (
            element: Element,
            currentComponent: any,
            mainEl: Element,
            keyEl?: string,
            eachValue?: any,
            getStack?: GetStackType
          ) => {
            if (element) {
              const eventFn = (event: Event) => {
                fn(event, getStack!())();
              };
              setClickEvent(element, eventFn);
            }
          };
        }
      } else {
        if (argsLength > 0) {
          if (argsLength === 1) {
            const { renderedKey: newRenderedKey, getEventsDataFn } = args[0];
            setEvent = (
              element: Element,
              currentComponent: any,
              mainEl: Element,
              keyEl?: string,
              eachValue?: any,
              getStack?: GetStackType
            ) => {
              if (element) {
                const eventFn = (event: Event) => {
                  const newArg = getEventsDataFn(
                    mainEl,
                    index,
                    newRenderedKey,
                    eachValue
                  );
                  fn(event, getStack!())(newArg);
                };
                element.addEventListener(keyEvent, eventFn);
              }
            };
          } else {
            setEvent = (
              element: Element,
              currentComponent: any,
              mainEl: Element,
              keyEl?: string,
              eachValue?: any,
              getStack?: GetStackType
            ) => {
              if (element) {
                const eventFn = (event: Event) => {
                  const newArgs = new Array(argsLength);
                  for (let i = 0; i < argsLength; i++) {
                    const { renderedKey, getEventsDataFn } = args[i];
                    newArgs[i] = getEventsDataFn(
                      mainEl,
                      index,
                      renderedKey,
                      eachValue
                    );
                  }
                  fn(event, getStack!())(...newArgs);
                };
                element.addEventListener(keyEvent, eventFn);
              }
            };
          }
        } else {
          setEvent = (
            element: Element,
            currentComponent: any,
            mainEl: Element,
            keyEl?: string,
            eachValue?: any,
            getStack?: GetStackType
          ) => {
            if (element) {
              const eventFn = (event: Event) => {
                fn(event, getStack!())();
              };
              element.addEventListener(keyEvent, eventFn);
            }
          };
        }
      }
    } else {
      if (keyEvent === "click") {
        if (argsLength > 0) {
          setEvent = (
            element: Element,
            currentComponent: any,
            mainEl: Element,
            keyEl?: string,
            eachValue?: any,
            getStack?: GetStackType
          ) => {
            if (element) {
              const eventFn = (event: Event) => {
                const newArgs = args.map((e: any) => getEventsData1(e, id));
                fn(event)(...newArgs);
              };
              setClickEvent(element, eventFn);
            }
          };
        } else {
          setEvent = (
            element: Element,
            currentComponent: any,
            mainEl: Element,
            keyEl?: string,
            eachValue?: any,
            getStack?: GetStackType
          ) => {
            if (element) {
              const eventFn = (event: Event) => {
                fn(event)();
              };
              setClickEvent(element, eventFn);
            }
          };
        }
      } else {
        if (argsLength > 0) {
          setEvent = (
            element: Element,
            currentComponent: any,
            mainEl: Element,
            keyEl?: string,
            eachValue?: any,
            getStack?: GetStackType
          ) => {
            if (element) {
              const eventFn = (event: Event) => {
                const newArgs = args.map((e: any) => getEventsData1(e, id));
                fn(event)(...newArgs);
              };
              element.addEventListener(keyEvent, eventFn);
            }
          };
        } else {
          setEvent = (
            element: Element,
            currentComponent: any,
            mainEl: Element,
            keyEl?: string,
            eachValue?: any,
            getStack?: GetStackType
          ) => {
            if (element) {
              const eventFn = (event: Event) => {
                fn(event)();
              };
              element.addEventListener(keyEvent, eventFn);
            }
          };
        }
      }
    }

    const newVal: ValueType = {
      id: elId,
      type: 0,
      render: setEvent
    };
    values[indexValue] = newVal;
  }
  const renderValue = (val: ValueType) => {
    const valKey = val.key as CurrentKeyType;
    const stackLength = obj.values.length;
    const getIsValueData = () => {
      if (isEach) {
        const getIsValImport = (e: any) => {
          const val = e.value;
          if (checkObject(val)) {
            const isValImport =
              (val as any).originKey === valueName || !!val.isValueImport;
            return isValImport;
          } else return false;
        };
        const isValueData1 =
          valKey !== undefined && valKey.originKey === valueName;
        let isValueData2 = false;
        const { classes } = val;
        if (classes !== undefined) {
          const { value } = classes;
          if (Array.isArray(value)) {
            isValueData2 = value.some((e) => {
              return !getIsValImport(e);
            });
          } else {
            isValueData2 = !getIsValImport(value);
          }
        }
        return isValueData1 || isValueData2;
      } else return false;
    };
    const isImport = isEach && !getIsValueData();
    switch (val.type) {
      case 0:
        return (
          val: ValueType,
          currentComponent: any,
          mainEl: Element,
          nodes: Element[],
          stack: StackType,
          node: ChildNode,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType,
          eachValue?: DynamicEachDataType,
          getStack?: GetStackType
        ) => {
          const { render } = val;
          (render as FunctionEventType)(
            node,
            currentComponent,
            mainEl,
            key,
            eachValue,
            getStack
          );
        };
      case 1:
        if (valKey.isValue) {
          const { values: valuesKey, render: renderValuesKey } = valKey;
          const fnText = (
            nodes: Element[],
            stack: StackType,
            currentIndexData: any,
            currentImportData: any,
            currentEachIndex: number | undefined,
            _: NodeTextType
          ) => {
            const str = {
              value: ""
            };
            (renderValuesKey as (...args: any[]) => void)(
              str,
              valuesKey,
              currentIndexData,
              currentImportData,
              currentEachIndex
            );
            const newData = str.value;
            if (stack[stackLength] !== newData) {
              (nodes[stackLength] as ChildNode as Text).nodeValue = newData;
              stack[stackLength] = newData;
            }
          };
          (obj[isImport ? "valuesImport" : "values"] as any).push(fnText);
          return (
            val: ValueType,
            currentComponent: any,
            mainEl: Element,
            nodes: Element[],
            stack: StackType,
            node: ChildNode,
            indexData: any,
            eachIndex?: number,
            importData?: ImportDataType,
            key?: string,
            exportFunctions?: any,
            currentExport?: ExportDataType | ExportDynamicType,
            eachValue?: DynamicEachDataType,
            getStack?: GetStackType
          ) => {
            const str = {
              value: ""
            };
            (renderValuesKey as (...args: any[]) => void)(
              str,
              valuesKey,
              indexData,
              importData,
              eachIndex
            );
            const newData = str.value;
            stack[stackLength] = newData;
            (node as Text).nodeValue = newData;
            nodes[stackLength] = node as Element;
          };
        } else {
          if (isEach) {
            switch (valKey.originType) {
              case 1:
                if (valKey.isProperty) {
                  if (valKey.properties?.length === 1) {
                    const currentProp = (valKey.properties as any)[0];
                    const fnText1 = (
                      nodes: Element[],
                      stack: StackType,
                      currentIndexData: any,
                      currentImportData: any,
                      currentEachIndex: number | undefined,
                      _: NodeTextType
                    ) => {
                      const newData = currentIndexData[currentProp];
                      if (stack[stackLength] !== newData) {
                        (nodes[stackLength] as ChildNode as Text).nodeValue =
                          newData;
                        stack[stackLength] = newData;
                      }
                    };
                    (obj[isImport ? "valuesImport" : "values"] as any).push(
                      fnText1
                    );
                    return (
                      val: ValueType,
                      currentComponent: any,
                      mainEl: Element,
                      nodes: Element[],
                      stack: StackType,
                      node: ChildNode,
                      indexData: any,
                      eachIndex?: number,
                      importData?: ImportDataType,
                      key?: string,
                      exportFunctions?: any,
                      currentExport?: ExportDataType | ExportDynamicType,
                      eachValue?: DynamicEachDataType,
                      getStack?: GetStackType
                    ) => {
                      stack[stackLength] = indexData[currentProp];
                      (node as Text).nodeValue = stack[stackLength];
                      nodes[stackLength] = node as Element;
                    };
                  } else {
                    const fnText2 = (
                      nodes: Element[],
                      stack: StackType,
                      currentIndexData: any,
                      currentImportData: any,
                      currentEachIndex: number | undefined,
                      _: NodeTextType
                    ) => {
                      const newData = (valKey.render as any)(currentIndexData);
                      if (stack[stackLength] !== newData) {
                        (nodes[stackLength] as ChildNode as Text).nodeValue =
                          newData;
                        stack[stackLength] = newData;
                      }
                    };
                    (obj[isImport ? "valuesImport" : "values"] as any).push(
                      fnText2
                    );
                    return (
                      val: ValueType,
                      currentComponent: any,
                      mainEl: Element,
                      nodes: Element[],
                      stack: StackType,
                      node: ChildNode,
                      indexData: any,
                      eachIndex?: number,
                      importData?: ImportDataType,
                      key?: string,
                      exportFunctions?: any,
                      currentExport?: ExportDataType | ExportDynamicType,
                      eachValue?: DynamicEachDataType,
                      getStack?: GetStackType
                    ) => {
                      stack[stackLength] = (valKey.render as any)(indexData);
                      (node as Text).nodeValue = stack[stackLength];
                      nodes[stackLength] = node as Element;
                    };
                  }
                } else {
                  const fnText3 = (
                    nodes: Element[],
                    stack: StackType,
                    currentIndexData: any,
                    currentImportData: any,
                    currentEachIndex: number | undefined,
                    _: NodeTextType
                  ) => {
                    const newData = currentIndexData;
                    if (stack[stackLength] !== newData) {
                      (nodes[stackLength] as ChildNode as Text).nodeValue =
                        newData;
                      stack[stackLength] = newData;
                    }
                  };
                  (obj[isImport ? "valuesImport" : "values"] as any).push(
                    fnText3
                  );
                  return (
                    val: ValueType,
                    currentComponent: any,
                    mainEl: Element,
                    nodes: Element[],
                    stack: StackType,
                    node: ChildNode,
                    indexData: any,
                    eachIndex?: number,
                    importData?: ImportDataType,
                    key?: string,
                    exportFunctions?: any,
                    currentExport?: ExportDataType | ExportDynamicType,
                    eachValue?: DynamicEachDataType,
                    getStack?: GetStackType
                  ) => {
                    stack[stackLength] = indexData;
                    (node as Text).nodeValue = stack[stackLength];
                    nodes[stackLength] = node as Element;
                  };
                }
              case 2:
                const fnText4 = (
                  nodes: Element[],
                  stack: StackType,
                  currentIndexData: any,
                  currentImportData: any,
                  currentEachIndex: number | undefined,
                  _: NodeTextType
                ) => {
                  const newData = (valKey.render as any)(currentImportData);
                  if (stack[stackLength] !== newData) {
                    (nodes[stackLength] as ChildNode as Text).nodeValue =
                      newData;
                    stack[stackLength] = newData;
                  }
                };
                (obj[isImport ? "valuesImport" : "values"] as any).push(
                  fnText4
                );
                return (
                  val: ValueType,
                  currentComponent: any,
                  mainEl: Element,
                  nodes: Element[],
                  stack: StackType,
                  node: ChildNode,
                  indexData: any,
                  eachIndex?: number,
                  importData?: ImportDataType,
                  key?: string,
                  exportFunctions?: any,
                  currentExport?: ExportDataType | ExportDynamicType,
                  eachValue?: DynamicEachDataType,
                  getStack?: GetStackType
                ) => {
                  stack[stackLength] = (valKey.render as any)(importData);
                  (node as Text).nodeValue = stack[stackLength];
                  nodes[stackLength] = node as Element;
                };
              case 3:
                const fnText5 = (
                  nodes: Element[],
                  stack: StackType,
                  currentIndexData: any,
                  currentImportData: any,
                  currentEachIndex: number | undefined,
                  _: NodeTextType
                ) => {
                  const newData = currentEachIndex;
                  if (stack[stackLength] !== newData) {
                    (nodes[stackLength] as ChildNode as Text).nodeValue =
                      newData as any;
                    stack[stackLength] = newData;
                  }
                };
                (obj[isImport ? "valuesImport" : "values"] as any).push(
                  fnText5
                );
                return (
                  val: ValueType,
                  currentComponent: any,
                  mainEl: Element,
                  nodes: Element[],
                  stack: StackType,
                  node: ChildNode,
                  indexData: any,
                  eachIndex?: number,
                  importData?: ImportDataType,
                  key?: string,
                  exportFunctions?: any,
                  currentExport?: ExportDataType | ExportDynamicType,
                  eachValue?: DynamicEachDataType,
                  getStack?: GetStackType
                ) => {
                  stack[stackLength] = eachIndex;
                  (node as Text).nodeValue = stack[
                    stackLength
                  ] as unknown as string;
                  nodes[stackLength] = node as Element;
                };
              default:
                const fnText = (
                  nodes: Element[],
                  stack: StackType,
                  currentIndexData: any,
                  currentImportData: any,
                  currentEachIndex: number | undefined,
                  _: NodeTextType
                ) => {
                  const newData = undefined;
                  if (stack[stackLength] !== newData) {
                    (nodes[stackLength] as ChildNode as Text).nodeValue =
                      newData as any;
                    stack[stackLength] = newData;
                  }
                };
                (obj[isImport ? "valuesImport" : "values"] as any).push(fnText);
                return (
                  val: ValueType,
                  currentComponent: any,
                  mainEl: Element,
                  nodes: Element[],
                  stack: StackType,
                  node: ChildNode,
                  indexData: any,
                  eachIndex?: number,
                  importData?: ImportDataType,
                  key?: string,
                  exportFunctions?: any,
                  currentExport?: ExportDataType | ExportDynamicType,
                  eachValue?: DynamicEachDataType,
                  getStack?: GetStackType
                ) => {
                  stack[stackLength] = undefined;
                  (node as Text).nodeValue = stack[
                    stackLength
                  ] as unknown as string;
                  nodes[stackLength] = node as Element;
                };
            }
          } else {
            if (valKey.isProperty) {
              const fnText = (
                nodes: Element[],
                stack: StackType,
                currentIndexData: any,
                currentImportData: any,
                currentEachIndex: number | undefined,
                _: NodeTextType
              ) => {
                const firstKeyData = currentIndexData[valKey.originKey];
                const newData = renderKeyData(
                  firstKeyData,
                  valKey.properties as Array<string>
                );
                if (stack[stackLength] !== newData) {
                  (nodes[stackLength] as ChildNode as Text).nodeValue = newData;
                  stack[stackLength] = newData;
                }
              };
              (obj[isImport ? "valuesImport" : "values"] as any).push(fnText);
              return (
                val: ValueType,
                currentComponent: any,
                mainEl: Element,
                nodes: Element[],
                stack: StackType,
                node: ChildNode,
                indexData: any,
                eachIndex?: number,
                importData?: ImportDataType,
                key?: string,
                exportFunctions?: any,
                currentExport?: ExportDataType | ExportDynamicType,
                eachValue?: DynamicEachDataType,
                getStack?: GetStackType
              ) => {
                const firstKeyData = indexData[valKey.originKey];
                stack[stackLength] = renderKeyData(
                  firstKeyData,
                  valKey.properties as Array<string>
                );
                (node as Text).nodeValue = stack[stackLength];
                nodes[stackLength] = node as Element;
              };
            } else {
              const fnText = (
                nodes: Element[],
                stack: StackType,
                currentIndexData: any,
                currentImportData: any,
                currentEachIndex: number | undefined,
                _: NodeTextType
              ) => {
                const newData = currentIndexData[valKey.originKey];
                if (stack[stackLength] !== newData) {
                  (nodes[stackLength] as ChildNode as Text).nodeValue = newData;
                  stack[stackLength] = newData;
                }
              };
              (obj[isImport ? "valuesImport" : "values"] as any).push(fnText);
              return (
                val: ValueType,
                currentComponent: any,
                mainEl: Element,
                nodes: Element[],
                stack: StackType,
                node: ChildNode,
                indexData: any,
                eachIndex?: number,
                importData?: ImportDataType,
                key?: string,
                exportFunctions?: any,
                currentExport?: ExportDataType | ExportDynamicType,
                eachValue?: DynamicEachDataType,
                getStack?: GetStackType
              ) => {
                stack[stackLength] = indexData[valKey.originKey];
                (node as Text).nodeValue = stack[stackLength];
                nodes[stackLength] = node as Element;
              };
            }
          }
        }
      case 2:
        const fnAttr = (
          nodes: Element[],
          stack: StackType,
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
          updateAttributes(nodes[stackLength] as DynamicEl, val, fnNew);
        };
        (obj[isImport ? "valuesImport" : "values"] as any).push(fnAttr);
        return (
          val: ValueType,
          currentComponent: any,
          mainEl: Element,
          nodes: Element[],
          stack: StackType,
          node: ChildNode,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType,
          eachValue?: DynamicEachDataType,
          getStack?: GetStackType
        ) => {
          const fnNew = (key: CurrentKeyType) =>
            renderDynamic(key, indexData, importData, eachIndex);
          updateAttributes(node as DynamicEl, val, fnNew);
          nodes[stackLength] = node as Element;
        };
      case 3:
        return (
          val: ValueType,
          currentComponent: any,
          mainEl: Element,
          nodes: Element[],
          stack: StackType,
          node: ChildNode,
          indexData: any,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string,
          exportFunctions?: any,
          currentExport?: ExportDataType | ExportDynamicType,
          eachValue?: DynamicEachDataType,
          getStack?: GetStackType
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
        const { classes } = val;
        const { value: classListValue } = classes as ValueItemsType;
        if (Array.isArray(classListValue)) {
          const { classes } = val;
          const { value: classListValue, render: renderClass } =
            classes as ValueItemsType;
          const fnClass = (
            nodes: Element[],
            stack: StackType,
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
            const node = nodes[stackLength];
            if ((node as Element).className !== classVal) {
              updClass.call(node, classVal);
            }
          };
          (obj[isImport ? "valuesImport" : "values"] as any).push(fnClass);
          return (
            val: ValueType,
            currentComponent: any,
            mainEl: Element,
            nodes: Element[],
            stack: StackType,
            node: ChildNode,
            indexData: any,
            eachIndex?: number,
            importData?: ImportDataType,
            key?: string,
            exportFunctions?: any,
            currentExport?: ExportDataType | ExportDynamicType,
            eachValue?: DynamicEachDataType,
            getStack?: GetStackType
          ) => {
            const str = renderClass(
              indexData,
              classListValue,
              importData,
              eachIndex
            );
            if (str !== "") {
              updClass.call(node, str);
            }
            nodes[stackLength] = node as Element;
          };
        } else {
          const currentKey: CurrentKeyType =
            classListValue.value as CurrentKeyType;
          if (currentKey.isValue) {
            const { values: valuesKey, render: renderValuesKey } = currentKey;
            const fnClass = (
              nodes: Element[],
              stack: StackType,
              currentIndexData: any,
              currentImportData: any,
              currentEachIndex: number | undefined
            ) => {
              const str = {
                value: ""
              };
              (renderValuesKey as (...args: any[]) => void)(
                str,
                valuesKey,
                currentIndexData,
                currentImportData,
                currentEachIndex
              );
              const classVal = str.value;
              const node = nodes[stackLength];
              if ((node as Element).className !== classVal) {
                updClass.call(node, classVal);
              }
            };
            (obj[isImport ? "valuesImport" : "values"] as any).push(fnClass);
            return (
              val: ValueType,
              currentComponent: any,
              mainEl: Element,
              nodes: Element[],
              stack: StackType,
              node: ChildNode,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType,
              eachValue?: DynamicEachDataType,
              getStack?: GetStackType
            ) => {
              const str = {
                value: ""
              };
              (renderValuesKey as (...args: any[]) => void)(
                str,
                valuesKey,
                indexData,
                importData,
                eachIndex
              );
              const newData = str.value;
              if (newData !== "") {
                updClass.call(node, newData);
              }
              nodes[stackLength] = node as Element;
            };
          } else {
            if (currentKey.isValueSingle) {
              const { valueSingle } = currentKey;
              const { condition, value } = valueSingle as ValueSingleType;
              const { render: conditionRender } = condition;
              const fnClass = (
                nodes: Element[],
                stack: StackType,
                currentIndexData: any,
                currentImportData: any,
                currentEachIndex: number | undefined
              ) => {
                const currentCondition = (
                  conditionRender as (...args: any[]) => boolean
                )(currentIndexData, currentImportData, currentEachIndex);
                if (stack[stackLength] !== currentCondition) {
                  const val = currentCondition ? value : "";
                  (nodes[stackLength] as Element).className = val;
                  stack[stackLength] = currentCondition;
                }
              };
              (obj[isImport ? "valuesImport" : "values"] as any).push(fnClass);
              return (
                val: ValueType,
                currentComponent: any,
                mainEl: Element,
                nodes: Element[],
                stack: StackType,
                node: ChildNode,
                indexData: any,
                eachIndex?: number,
                importData?: ImportDataType,
                key?: string,
                exportFunctions?: any,
                currentExport?: ExportDataType | ExportDynamicType,
                eachValue?: DynamicEachDataType,
                getStack?: GetStackType
              ) => {
                const currentCondition = (
                  conditionRender as (...args: any[]) => boolean
                )(indexData, importData, eachIndex);
                stack[stackLength] = false;
                if (currentCondition) {
                  (node as Element).className = value;
                  stack[stackLength] = true;
                }
                nodes[stackLength] = node as Element;
              };
            } else {
              if (isEach) {
                switch (currentKey.originType) {
                  case 1:
                    const fnClass1 = (
                      nodes: Element[],
                      stack: StackType,
                      currentIndexData: any,
                      currentImportData: any,
                      currentEachIndex: number | undefined
                    ) => {
                      const classVal = (currentKey.render as any)(
                        currentIndexData
                      );
                      const node = nodes[stackLength];
                      if ((node as Element).className !== classVal) {
                        updClass.call(node, classVal);
                      }
                    };
                    (obj[isImport ? "valuesImport" : "values"] as any).push(
                      fnClass1
                    );
                    return (
                      val: ValueType,
                      currentComponent: any,
                      mainEl: Element,
                      nodes: Element[],
                      stack: StackType,
                      node: ChildNode,
                      indexData: any,
                      eachIndex?: number,
                      importData?: ImportDataType,
                      key?: string,
                      exportFunctions?: any,
                      currentExport?: ExportDataType | ExportDynamicType,
                      eachValue?: DynamicEachDataType,
                      getStack?: GetStackType
                    ) => {
                      const newData = (currentKey.render as any)(indexData);
                      if (newData !== "") {
                        updClass.call(node, newData);
                      }
                      nodes[stackLength] = node as Element;
                    };
                  case 2:
                    const fnClass2 = (
                      nodes: Element[],
                      stack: StackType,
                      currentIndexData: any,
                      currentImportData: any,
                      currentEachIndex: number | undefined
                    ) => {
                      const classVal = (currentKey.render as any)(
                        currentImportData
                      );
                      const node = nodes[stackLength];
                      if ((node as Element).className !== classVal) {
                        updClass.call(node, classVal);
                      }
                    };
                    (obj[isImport ? "valuesImport" : "values"] as any).push(
                      fnClass2
                    );
                    return (
                      val: ValueType,
                      currentComponent: any,
                      mainEl: Element,
                      nodes: Element[],
                      stack: StackType,
                      node: ChildNode,
                      indexData: any,
                      eachIndex?: number,
                      importData?: ImportDataType,
                      key?: string,
                      exportFunctions?: any,
                      currentExport?: ExportDataType | ExportDynamicType,
                      eachValue?: DynamicEachDataType,
                      getStack?: GetStackType
                    ) => {
                      const newData = (currentKey.render as any)(importData);
                      if (newData !== "") {
                        updClass.call(node, newData);
                      }
                      nodes[stackLength] = node as Element;
                    };
                  case 3:
                    const fnClass3 = (
                      nodes: Element[],
                      stack: StackType,
                      currentIndexData: any,
                      currentImportData: any,
                      currentEachIndex: number | undefined
                    ) => {
                      const classVal = String(currentEachIndex);
                      const node = nodes[stackLength];
                      if ((node as Element).className !== classVal) {
                        updClass.call(node, classVal);
                      }
                    };
                    (obj[isImport ? "valuesImport" : "values"] as any).push(
                      fnClass3
                    );
                    return (
                      val: ValueType,
                      currentComponent: any,
                      mainEl: Element,
                      nodes: Element[],
                      stack: StackType,
                      node: ChildNode,
                      indexData: any,
                      eachIndex?: number,
                      importData?: ImportDataType,
                      key?: string,
                      exportFunctions?: any,
                      currentExport?: ExportDataType | ExportDynamicType,
                      eachValue?: DynamicEachDataType,
                      getStack?: GetStackType
                    ) => {
                      const newData = String(eachIndex);
                      if (newData !== "") {
                        updClass.call(node, newData);
                      }
                      nodes[stackLength] = node as Element;
                    };
                  default:
                    const fnClass = (
                      nodes: Element[],
                      stack: StackType,
                      currentIndexData: any,
                      currentImportData: any,
                      currentEachIndex: number | undefined
                    ) => {
                      const classVal = String(undefined);
                      const node = nodes[stackLength];
                      if ((node as Element).className !== classVal) {
                        updClass.call(node, classVal);
                      }
                    };
                    (obj[isImport ? "valuesImport" : "values"] as any).push(
                      fnClass
                    );
                    return (
                      val: ValueType,
                      currentComponent: any,
                      mainEl: Element,
                      nodes: Element[],
                      stack: StackType,
                      node: ChildNode,
                      indexData: any,
                      eachIndex?: number,
                      importData?: ImportDataType,
                      key?: string,
                      exportFunctions?: any,
                      currentExport?: ExportDataType | ExportDynamicType,
                      eachValue?: DynamicEachDataType,
                      getStack?: GetStackType
                    ) => {
                      const newData = String(undefined);
                      if (newData !== "") {
                        updClass.call(node, newData);
                      }
                      nodes[stackLength] = node as Element;
                    };
                }
              } else {
                if (currentKey.isProperty) {
                  const fnClass = (
                    nodes: Element[],
                    stack: StackType,
                    currentIndexData: any,
                    currentImportData: any,
                    currentEachIndex: number | undefined
                  ) => {
                    const firstKeyData = currentIndexData[currentKey.originKey];
                    const classVal = renderKeyData(
                      firstKeyData,
                      currentKey.properties as Array<string>
                    );
                    const node = nodes[stackLength];
                    if ((node as Element).className !== classVal) {
                      updClass.call(node, classVal);
                    }
                  };
                  (obj[isImport ? "valuesImport" : "values"] as any).push(
                    fnClass
                  );
                  return (
                    val: ValueType,
                    currentComponent: any,
                    mainEl: Element,
                    nodes: Element[],
                    stack: StackType,
                    node: ChildNode,
                    indexData: any,
                    eachIndex?: number,
                    importData?: ImportDataType,
                    key?: string,
                    exportFunctions?: any,
                    currentExport?: ExportDataType | ExportDynamicType,
                    eachValue?: DynamicEachDataType,
                    getStack?: GetStackType
                  ) => {
                    const firstKeyData = indexData[currentKey.originKey];
                    const newData = renderKeyData(
                      firstKeyData,
                      currentKey.properties as Array<string>
                    );
                    if (newData !== "") {
                      updClass.call(node, newData);
                    }
                    nodes[stackLength] = node as Element;
                  };
                } else {
                  const fnClass = (
                    nodes: Element[],
                    stack: StackType,
                    currentIndexData: any,
                    currentImportData: any,
                    currentEachIndex: number | undefined
                  ) => {
                    const classVal = currentIndexData[currentKey.originKey];
                    const node = nodes[stackLength];
                    if ((node as Element).className !== classVal) {
                      updClass.call(node, classVal);
                    }
                  };
                  (obj[isImport ? "valuesImport" : "values"] as any).push(
                    fnClass
                  );
                  return (
                    val: ValueType,
                    currentComponent: any,
                    mainEl: Element,
                    nodes: Element[],
                    stack: StackType,
                    node: ChildNode,
                    indexData: any,
                    eachIndex?: number,
                    importData?: ImportDataType,
                    key?: string,
                    exportFunctions?: any,
                    currentExport?: ExportDataType | ExportDynamicType,
                    eachValue?: DynamicEachDataType,
                    getStack?: GetStackType
                  ) => {
                    const newData = indexData[currentKey.originKey];
                    if (newData !== "") {
                      updClass.call(node, newData);
                    }
                    nodes[stackLength] = node as Element;
                  };
                }
              }
            }
          }
        }
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
              currentComponent: any,
              mainEl: Element,
              nodes: Element[],
              stack: StackType,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType,
              eachValue?: DynamicEachDataType,
              getStack?: GetStackType
            ) {
              const currentEl = currentRender.call(this);
              valueFn(
                val,
                currentComponent,
                mainEl,
                nodes,
                stack,
                currentEl,
                indexData,
                eachIndex,
                importData,
                key,
                exportFunctions,
                currentExport,
                eachValue,
                getStack
              );
              return currentEl;
            }
          : function fn(
              this: Element,
              currentComponent: any,
              mainEl: Element,
              nodes: Element[],
              stack: StackType,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType,
              eachValue?: DynamicEachDataType,
              getStack?: GetStackType
            ) {
              let currentEl = this;
              for (let j = 0; j < arrLength; j++) {
                const currentFn: RenderNodeFunctionType = arr[j];
                currentEl = currentFn.call(currentEl) as Element;
              }
              valueFn(
                val,
                currentComponent,
                mainEl,
                nodes,
                stack,
                currentEl,
                indexData,
                eachIndex,
                importData,
                key,
                exportFunctions,
                currentExport,
                eachValue,
                getStack
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
              currentComponent: any,
              mainEl: Element,
              nodes: Element[],
              stack: StackType,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType,
              eachValue?: DynamicEachDataType,
              getStack?: GetStackType
            ) {
              const currentEl = currentRender.call(this);
              for (let i = 0; i < fnsLength; i++) {
                const valueFn = valFns[i];
                valueFn(
                  nodeValues[i],
                  currentComponent,
                  mainEl,
                  nodes,
                  stack,
                  currentEl,
                  indexData,
                  eachIndex,
                  importData,
                  key,
                  exportFunctions,
                  currentExport,
                  eachValue,
                  getStack
                );
              }
              return currentEl;
            }
          : function fn(
              this: Element,
              currentComponent: any,
              mainEl: Element,
              nodes: Element[],
              stack: StackType,
              indexData: any,
              eachIndex?: number,
              importData?: ImportDataType,
              key?: string,
              exportFunctions?: any,
              currentExport?: ExportDataType | ExportDynamicType,
              eachValue?: DynamicEachDataType,
              getStack?: GetStackType
            ) {
              let currentEl = this;
              for (let j = 0; j < arrLength; j++) {
                const currentFn: RenderNodeFunctionType = arr[j];
                currentEl = currentFn.call(currentEl) as Element;
              }
              for (let i = 0; i < fnsLength; i++) {
                const valueFn = valFns[i];
                valueFn(
                  nodeValues[i],
                  currentComponent,
                  mainEl,
                  nodes,
                  stack,
                  currentEl,
                  indexData,
                  eachIndex,
                  importData,
                  key,
                  exportFunctions,
                  currentExport,
                  eachValue,
                  getStack
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
        currentComponent: any,
        mainEl: Element,
        nodes: Element[],
        stack: StackType,
        indexData: any,
        eachIndex?: number,
        importData?: ImportDataType,
        key?: string,
        exportFunctions?: any,
        currentExport?: ExportDataType | ExportDynamicType,
        eachValue?: DynamicEachDataType,
        getStack?: GetStackType
      ) {
        valueFn(
          val,
          currentComponent,
          mainEl,
          nodes,
          stack,
          this,
          indexData,
          eachIndex,
          importData,
          key,
          exportFunctions,
          currentExport,
          eachValue,
          getStack
        );
      };
    } else {
      const valFns = nodeValues.map((val) => {
        return renderValue(val);
      });
      const fnsLength = valFns.length;
      obj.render = function (
        this: Element,
        currentComponent: any,
        mainEl: Element,
        nodes: Element[],
        stack: StackType,
        indexData: any,
        eachIndex?: number,
        importData?: ImportDataType,
        key?: string,
        exportFunctions?: any,
        currentExport?: ExportDataType | ExportDynamicType,
        eachValue?: DynamicEachDataType,
        getStack?: GetStackType
      ) {
        for (let i = 0; i < fnsLength; i++) {
          const valueFn = valFns[i];
          valueFn(
            nodeValues[i],
            currentComponent,
            mainEl,
            nodes,
            stack,
            this,
            indexData,
            eachIndex,
            importData,
            key,
            exportFunctions,
            currentExport,
            eachValue,
            getStack
          );
        }
      };
    }
  }
  obj.nodes.shift();
  if (obj.valuesImport) {
    obj.valuesLength = obj.values.length + obj.valuesImport.length;
    const arr = obj.valuesImport;
    const arrLength = arr.length;
    if (arr.length === 1) {
      obj.renderImport = arr[0];
    } else {
      obj.renderImport = (
        nodes: Element[],
        stack: StackType,
        currentIndexData: any,
        currentImportData: any,
        currentEachIndex: number | undefined
      ) => {
        for (let i = 0; i < arrLength; i++) {
          const value = arr[i];
          value(
            nodes,
            stack,
            currentIndexData,
            currentImportData,
            currentEachIndex,
            value
          );
        }
      };
    }
    delete obj.valuesImport;
  } else {
    obj.valuesLength = obj.values.length;
  }
  return { obj };
};
