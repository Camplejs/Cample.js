"use-strict";
import {
  checkFunction,
  concatObjects,
  createError,
  createWarning,
  checkObject,
  objectEmpty,
  cloneValue,
  testValuesRegex
} from "../../../shared/utils";
import {
  DataType,
  DynamicDataType,
  DynamicDataValueType,
  EachDynamicNodeComponentType,
  DynamicFunctionsType,
  DynamicNodeComponentNodeType,
  DynamicTextType,
  EachDataFunctionType,
  EachDataValueType,
  EachOptionsType,
  ElementsType,
  ExportDataType,
  ExportIdType,
  FunctionsArray,
  LastNodeType,
  NodeType,
  SelectorType,
  StartType,
  ComponentRenderType,
  ImportObjectType,
  ImportDataType,
  DynamicKeyObjectType,
  IdType,
  ValuesArguments,
  DynamicEl,
  EachTemplateType,
  ValuesTemplateType,
  NodeValuesType,
  FunctionEventType,
  AttributesValType,
  NodeTextType,
  CurrentKeyType,
  IterationFunctionType,
  ValueType,
  ScriptElementsType,
  ClassType,
  ValueItemsType,
  ArrayNodeType
} from "../../../types/types";
import { createEachDynamicNodeComponentType } from "../../functions/data/create-each-dynamic-node-component";
import { createNode } from "../../functions/data/create-node";
import { renderAttributes } from "../../functions/render/render-attributes";
import { renderExportId } from "../../functions/render/render-export-id";
import { renderHTML } from "../../functions/render/render-html";
import { renderImport } from "../../functions/render/render-import";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderIndexData } from "../../functions/render/render-index-data";
import { renderScript } from "../../functions/render/render-script";
import { DataComponent } from "../data-component/data-component";
import { renderKey } from "../../functions/render/render-key";
import { renderDynamicKey } from "../../functions/render/render-dynamic-key";
import { updateAttributes } from "../../functions/data/update-attributes";
import { updateText } from "../../functions/data/update-text";
import { renderKeyData } from "../../functions/render/render-key-data";
import { renderValues } from "../../functions/render/render-values";
import { parseTemplate } from "../../functions/parse/parse-template";
import { createArgumentsTemplateFunction } from "../../functions/data/create-arguments-template-function";
import { updateClass } from "../../functions/data/update-class";

export class Each extends DataComponent {
  public data: EachDataFunctionType;
  public eachTemplate: string;
  public eachFunctions: DynamicFunctionsType;
  public functionName: string;
  public valueName: string;
  public importedDataName: string;
  public iteration: IterationFunctionType | undefined;
  public indexName: string;

  constructor(
    selector: SelectorType,
    data: EachDataFunctionType,
    template: string,
    options: EachOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.data = data;
    this.eachTemplate = template;
    this.eachFunctions = {};
    this.valueName = options.valueName ? options.valueName : "data";
    this.functionName = options.functionName ? options.functionName : "setData";
    this.importedDataName = options.importedDataName
      ? options.importedDataName
      : "importedData";
    this.iteration = options.iteration;
    this.indexName = options.indexName ? options.indexName : "index";
    if (
      this.indexName === this.valueName ||
      this.indexName === this.importedDataName ||
      this.valueName === this.importedDataName
    ) {
      createError("Name error");
    }
  }

  _getExport(): ExportDataType | undefined {
    return this.export;
  }

  render(
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType,
    typeRender: ComponentRenderType = "static"
  ): void {
    const isDataEachFunction = checkFunction(this.data);
    if (typeof this.selector !== "undefined" && isDataEachFunction) {
      const isFunction = checkFunction(this.eachTemplate);
      if (isFunction || typeof this.eachTemplate === "string") {
        const templateElement: any = null;
        const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
        const getValues = (dataId: number, eachIndex?: number) => {
          const indexData = renderIndexData(getData(dataId), eachIndex);
          if (this.values) {
            if (checkFunction(this.values)) {
              const valuesArguments: ValuesArguments = {
                [this.valueName]: indexData,
                currentData: getData(dataId),
                [this.importedDataName]: getImportData(dataId)
              };
              const values = this.values(valuesArguments);
              return values;
            } else createError("Values error");
          } else return undefined;
        };
        const getValuesData = (data: any, importData: any, allData?: any) => {
          if (this.values) {
            if (checkFunction(this.values)) {
              const valuesArguments: ValuesArguments = {
                [this.valueName]: data,
                currentData: allData,
                [this.importedDataName]: importData
              };
              const values = this.values(valuesArguments);
              return values;
            } else createError("Values error");
          } else return undefined;
        };
        const renderEachFunction = (
          updateFunction: (
            name: string,
            dataId: number | undefined,
            index: number,
            currentCompoent: EachDynamicNodeComponentType
          ) => void,
          dataId: number | undefined,
          data: EachDataValueType,
          index: number,
          currentComponent: EachDynamicNodeComponentType
        ) => {
          if (data !== undefined) {
            updateFunction(this.functionName, dataId, index, currentComponent);
          }
        };
        const renderDynamic = (
          key: CurrentKeyType,
          data: any,
          importData: any,
          allData: any,
          eachIndex: number | undefined
        ) => {
          if (key.isValue) {
            const values = getValuesData(data, importData, allData);
            let newData: undefined | string = undefined;
            if (values) newData = renderValues(key.key, values, key.isClass)[0];
            return newData;
          } else {
            if (key.isOrigin) {
              if (key.originKey === this.indexName) {
                if (key.isProperty) createError("Error properties");
                return eachIndex;
              } else {
                const firstKeyData =
                  key.originKey === this.valueName ? data : importData;
                return key.isProperty
                  ? renderKeyData(firstKeyData, key.properties as Array<string>)
                  : firstKeyData;
              }
            }
          }
          return undefined;
        };
        const renderDynamicNodes = (
          importData: ImportDataType | undefined,
          currentComponent: EachDynamicNodeComponentType
        ) => {
          this._dynamic.dynamicNodes.forEach((e, i) => {
            if (this.iteration) {
              const eachIndex = currentComponent.nodes.indexOf(e);
              const data = getData(e.dataId);
              const val = renderIndexData(data, eachIndex);
              const value = createArgumentsTemplateFunction(
                val,
                importData,
                this.valueName,
                this.importedDataName
              );
              (this.iteration as IterationFunctionType)(value, eachIndex);
            }
            if (!e.isNew) {
              const eachIndex = currentComponent.nodes.indexOf(e);
              const data = getData(e.dataId);
              const val = renderIndexData(data, eachIndex);
              e.values.forEach((value) => {
                switch (value.type) {
                  case "dynamicText":
                    const value1 = value.value as NodeTextType;
                    const newData = String(
                      renderDynamic(
                        value1.key,
                        val,
                        importData,
                        data,
                        eachIndex
                      )
                    );
                    if (value1.value !== newData) {
                      (value.value as NodeTextType).value = newData;
                      value.render(newData);
                    }
                    break;
                  case "attribute":
                    const attrFunc = (key: CurrentKeyType) =>
                      renderDynamic(key, val, importData, data, eachIndex);
                    value.render(attrFunc);
                    break;
                  case "class":
                    const classFunc = (key: CurrentKeyType) =>
                      renderDynamic(key, val, importData, data, eachIndex);
                    value.render(classFunc);
                    break;
                }
              });
            } else delete this._dynamic.dynamicNodes[i].isNew;
          });
          this._dynamic.dynamicNodes = [];
        };
        const updText = Object.getOwnPropertyDescriptor(
          CharacterData.prototype,
          "data"
        )?.set;
        const cloneNode = Node.prototype.cloneNode;
        const { push } = Array.prototype;
        const createElement = (
          indexData: any,
          index: number,
          data: DynamicDataValueType,
          dataId: number,
          templateEl: EachTemplateType | undefined,
          isFirst = false,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string
        ) => {
          if (templateEl && templateEl.el) {
            const el = cloneNode.call(templateEl.el, true);
            let nodes: Array<number | ChildNode> = [...templateEl.nodes];
            const values: ValuesTemplateType = templateEl.values.map((o) => {
              return {
                ...o,
                value: checkFunction(o.value) ? o.value : { ...o.value }
              } as ValueType;
            });
            let i = -1;
            function renderNode(node: ChildNode) {
              i++;
              if (nodes.includes(i)) {
                nodes = nodes.map((e) => (e === i ? node : e));
              }
              if (node.nodeType === Node.ELEMENT_NODE) {
                for (
                  let currentNode = node.firstChild;
                  currentNode;
                  currentNode = currentNode.nextSibling
                ) {
                  if (!nodes.some((e) => typeof e === "number")) {
                    break;
                  } else {
                    renderNode(currentNode);
                  }
                }
              }
            }
            renderNode(el as ChildNode);
            const attrFunc = (key: CurrentKeyType) =>
              renderDynamic(key, indexData, importData, data, eachIndex);
            const newValues: NodeValuesType = [];
            values.forEach((val) => {
              const node = nodes[val.id as number];
              switch (val.type) {
                case "event":
                  const value1 = val.value as FunctionEventType;
                  value1(node, key);
                  break;
                case "dynamicText":
                  const value2 = val.value as DynamicTextType;
                  const newData = String(
                    renderDynamic(
                      value2.key,
                      indexData,
                      importData,
                      data,
                      eachIndex
                    )
                  );
                  const texts = value2.texts.map((e, j) => {
                    const node = nodes[e as number] as Text;
                    updText?.call(node, newData);
                    return node;
                  });
                  push.call(newValues, {
                    render: (value: any = undefined) =>
                      updateText(value, texts),
                    type: "dynamicText",
                    value: {
                      key: value2.key,
                      value: newData
                    }
                  });
                  break;
                case "attribute":
                  const value3 = val.value as AttributesValType;
                  const fn = (fnNew: any) =>
                    updateAttributes(node as DynamicEl, value3, fnNew);
                  fn(attrFunc);
                  push.call(newValues, {
                    render: fn,
                    type: "attribute",
                    value: value3
                  });
                  break;
                case "class":
                  const value4 = val.value as ClassType;
                  const fnClass = (fnNew: any) =>
                    updateClass(node as DynamicEl, value4, fnNew);
                  fnClass(attrFunc);
                  push.call(newValues, {
                    render: fnClass,
                    type: "class",
                    value: value4
                  });
                  break;
              }
            });
            const currentNode = createNode(
              newValues,
              index,
              dataId,
              isFirst,
              key,
              el
            );
            return { el: el as Element, currentNode };
          }
          return { el: null, currentNode: undefined };
        };
        const { appendChild, insertBefore, removeChild, replaceChild } =
          Node.prototype;
        const setElement = (
          el: Element | null,
          lastNode: LastNodeType,
          parentNode: ParentNode,
          isNext?: boolean
        ) => {
          if (el) {
            if (parentNode === lastNode.parentNode || parentNode === lastNode) {
              if (parentNode === lastNode) {
                appendChild.call(parentNode, el);
              } else if (isNext) {
                insertBefore.call(parentNode, el, lastNode);
              } else {
                insertBefore.call(parentNode, el, lastNode.nextSibling);
              }
            } else {
              createError("Element of Each error");
            }
          }
        };
        const getElKey = (
          indexData: any,
          value: ValueItemsType,
          importData: ImportDataType | undefined,
          data: any,
          eachIndex: number
        ): string => {
          return value
            .map((e) => {
              const isObj = checkObject(e);
              if (isObj) {
                return renderDynamic(
                  e as CurrentKeyType,
                  indexData,
                  importData,
                  data,
                  eachIndex
                );
              }
              return e;
            })
            .join("");
        };
        const getDynamicNode = (
          currentComponent: EachDynamicNodeComponentType,
          value: any,
          isEachIndex: boolean
        ) => {
          if (isEachIndex) {
            return currentComponent.nodes[value];
          } else {
            const nodes = currentComponent.nodes.filter((e) => {
              if (e) {
                return e["key"] === value;
              } else return false;
            });
            if (nodes.length > 1) createError("Nodes error");
            return nodes[0];
          }
        };
        const getEventsFunction = (
          key: string,
          dataId: number,
          keyEl: string | undefined
        ) => {
          if (!keyEl) createError("key error");
          const newKey = getKey(key);
          if (newKey === this.valueName) createError("key error");
          const importData = getImportData(dataId);
          const dataArray = renderDynamicKey(
            importData,
            0,
            key,
            undefined,
            true
          );
          return dataArray[0];
        };
        const getCurrentComponent = (dataId: number) => {
          const currentComponentArray =
            this._dynamic.data.data.components.filter((e) => e?.id === dataId);
          if (currentComponentArray.length > 1) {
            createError("id is unique");
          }
          const currentComponent =
            currentComponentArray[0] as EachDynamicNodeComponentType;
          return currentComponent;
        };
        const renderNewData = (
          oldData: any,
          newData: any,
          currentComponent: EachDynamicNodeComponentType,
          dataId: number,
          index: number,
          importData: ImportDataType | undefined,
          isFirst = false
        ) => {
          const isObjectData = checkObject(newData);
          if (
            Array.isArray(newData) ||
            (isObjectData && (Array.isArray(oldData) || checkObject(oldData)))
          ) {
            const isOldDataArray = Array.isArray(oldData);
            const isNewDataArray = Array.isArray(newData);
            const {
              parentNode,
              template,
              nodeNext,
              nodePrevious,
              nodeParentNode,
              nodes: oldNodes
            } = currentComponent;
            const { key } = template as EachTemplateType;
            const oldDataLength = isOldDataArray
              ? oldData.length
              : Object.keys(oldData).length;
            const newDataLength = isNewDataArray
              ? newData.length
              : Object.keys(newData).length;
            const data = isObjectData ? Object.values(newData) : newData;
            if (key && key.length > 0) {
              const getCurrentKey = (indexData: any, eachIndex: number) => {
                return getElKey(
                  indexData,
                  key as ValueItemsType,
                  importData,
                  data,
                  eachIndex
                );
              };
              const clear = () => {
                const firstEl = getDynamicNode(currentComponent, 0, true)?.el;
                const lastEl = getDynamicNode(
                  currentComponent,
                  oldDataLength - 1,
                  true
                )?.el;
                const nextNode =
                  lastEl?.nextSibling !== null
                    ? lastEl?.nextSibling
                    : undefined;
                const previousNode = firstEl?.previousSibling
                  ? firstEl?.previousSibling
                  : undefined;
                const currentParentNode = firstEl?.parentNode
                  ? firstEl?.parentNode
                  : undefined;
                if (nextNode) {
                  currentComponent.nodeNext = nextNode;
                }
                if (previousNode) {
                  currentComponent.nodePrevious = previousNode;
                }
                if (currentParentNode) {
                  currentComponent.nodeParentNode = currentParentNode;
                }
                currentComponent.nodes = currentComponent.nodes.filter(
                  (node) => node.index !== index
                );
                if (nextNode && previousNode) {
                  while (
                    previousNode.nextSibling &&
                    previousNode.nextSibling !== nextNode
                  ) {
                    previousNode.nextSibling.remove();
                  }
                }
                if (nextNode && !previousNode) {
                  while (nextNode.previousSibling) {
                    nextNode.previousSibling.remove();
                  }
                }
                if (!nextNode && previousNode) {
                  while (previousNode.nextSibling) {
                    previousNode.nextSibling.remove();
                  }
                }
                if (!nextNode && !previousNode && currentParentNode) {
                  currentParentNode.replaceChildren();
                }
                currentComponent.nodes = [];
              };
              const setNewData = () => {
                let newNodePrevious = nodePrevious;
                for (let i = 0; i < newDataLength; i++) {
                  const indexData = renderIndexData(data, i);
                  const newKey = getCurrentKey(indexData, i);
                  const { el, currentNode } = createElement(
                    indexData,
                    index,
                    data,
                    dataId,
                    template,
                    isFirst,
                    i,
                    importData,
                    newKey
                  );
                  setNode(currentComponent.nodes, currentNode);
                  if (nodePrevious) {
                    setElement(el, nodePrevious, parentNode, undefined);
                    newNodePrevious = newNodePrevious?.nextSibling;
                  } else if (nodeNext) {
                    setElement(el, nodeNext, parentNode, true);
                  } else if (nodeParentNode) {
                    setElement(el, nodeParentNode, parentNode, false);
                  } else {
                    createError("Each render error");
                  }
                }
              };
              if (newDataLength === 0 && oldDataLength) clear();
              if (oldDataLength === 0 && newDataLength) setNewData();
              if (!!oldDataLength && !!newDataLength) {
                const swapElements = (
                  el1: Element,
                  el2: Element,
                  parentNode: ParentNode
                ) => {
                  const nextEl1 = el1.nextElementSibling;
                  if (nextEl1 === el2) {
                    insertBefore.call(parentNode, el2, el1);
                    return;
                  }
                  insertBefore.call(
                    parentNode,
                    replaceChild.call(parentNode, el1, el2),
                    nextEl1
                  );
                };
                newData = newData.slice();
                let oldFirstIndex = 0;
                let newFirstIndex = 0;
                let oldLastIndex = oldDataLength;
                let newLastIndex = newDataLength;
                let newFirstDataKey: string | undefined = undefined;
                let newLastDataKey: string | undefined = undefined;
                let currentOldLastIndex: number;
                let currentNewLastIndex: number;
                while (
                  oldFirstIndex < oldLastIndex ||
                  newFirstIndex < newLastIndex
                ) {
                  currentOldLastIndex = oldLastIndex - 1;
                  currentNewLastIndex = newLastIndex - 1;
                  if (
                    oldLastIndex === oldFirstIndex ||
                    newLastIndex === newFirstIndex
                  ) {
                    break;
                  }
                  if (
                    oldNodes[oldFirstIndex].key ===
                    (newFirstDataKey = getCurrentKey(
                      newData[newFirstIndex],
                      newFirstIndex
                    ))
                  ) {
                    newData[newFirstIndex++] = oldNodes[oldFirstIndex++];
                    continue;
                  }
                  if (
                    oldNodes[currentOldLastIndex].key ===
                    (newLastDataKey = getCurrentKey(
                      newData[currentNewLastIndex],
                      currentNewLastIndex
                    ))
                  ) {
                    newData[currentNewLastIndex] =
                      oldNodes[currentOldLastIndex];
                    newLastIndex--;
                    oldLastIndex--;
                    continue;
                  }
                  if (
                    oldNodes[oldFirstIndex].key === newLastDataKey &&
                    oldNodes[currentOldLastIndex].key === newFirstDataKey
                  ) {
                    swapElements(
                      (newData[newFirstIndex++] = oldNodes[currentOldLastIndex])
                        .el as Element,
                      (newData[currentNewLastIndex] = oldNodes[oldFirstIndex++])
                        .el as Element,
                      parentNode
                    );
                    newLastIndex--;
                    oldLastIndex--;
                    continue;
                  }
                  break;
                }
                if (oldLastIndex === oldFirstIndex) {
                  const lastEl = newData[newLastIndex]?.el;
                  for (let i = 0; newFirstIndex < newLastIndex--; i++) {
                    const currentIndex = newFirstIndex + i;
                    const currentNewNode = newData[currentIndex];
                    const { el, currentNode } = createElement(
                      currentNewNode,
                      index,
                      data,
                      dataId,
                      template,
                      isFirst,
                      currentIndex,
                      importData,
                      currentNewNode
                    );
                    if (currentNode) {
                      setElement(
                        el as Element,
                        (lastEl ??
                          newData[currentIndex - 1].el) as LastNodeType,
                        parentNode,
                        !!lastEl
                      );
                    }
                    newData[currentIndex] = currentNode;
                  }
                } else if (newLastIndex === newFirstIndex) {
                  for (
                    let i = oldFirstIndex;
                    oldFirstIndex < oldLastIndex--;
                    i++
                  ) {
                    const currentNode = oldNodes[i];
                    if (currentNode) {
                      const { el } = currentNode;
                      removeChild.call(parentNode, el as Node);
                    }
                  }
                } else {
                  let checkPointsMap: Map<NodeType, number> | undefined =
                    undefined;
                  const newCurrentNodes: string[] = newFirstDataKey
                    ? [newFirstDataKey]
                    : [];
                  for (let i = 1; newFirstIndex + i < newLastIndex - 1; i++) {
                    const index = newFirstIndex + i;
                    newCurrentNodes.push(getCurrentKey(newData[index], index));
                  }
                  newCurrentNodes.push(
                    newLastDataKey ?? getCurrentKey(newData[index], index)
                  );
                  for (let i = 0; oldFirstIndex + i < oldLastIndex; i++) {
                    const currentOldNode = oldNodes[oldFirstIndex + i];
                    const index = newCurrentNodes.indexOf(
                      currentOldNode.key as string
                    );
                    if (index > -1) {
                      if (!checkPointsMap) {
                        checkPointsMap = new Map();
                      }
                      checkPointsMap.set(currentOldNode, index);
                      newData[newFirstIndex + index] = currentOldNode;
                    } else {
                      removeChild.call(
                        parentNode,
                        currentOldNode.el as Element
                      );
                    }
                  }
                  if (checkPointsMap) {
                    let isNodesSwitching = false;
                    let switching = true;
                    const list = Array.from(checkPointsMap.entries());
                    const length = list.length;
                    let i: number;
                    while (switching) {
                      switching = false;
                      for (i = 0; i < length - 1; i++) {
                        isNodesSwitching = false;
                        if (list[i][1] > list[i + 1][1]) {
                          isNodesSwitching = true;
                          break;
                        }
                      }
                      if (isNodesSwitching) {
                        insertBefore.call(
                          parentNode,
                          list[i + 1][0].el as Element,
                          list[i][0].el as Element
                        );
                        [list[i], list[i + 1]] = [list[i + 1], list[i]];
                        switching = true;
                      }
                    }
                    const newList = new Map(list);
                    let checkPointIndex = 0;
                    let checkPoint = list[checkPointIndex][0].el;
                    let isBig = false;
                    let lastEl: ChildNode | null | undefined = null;
                    for (let i = 0; newFirstIndex + i < newLastIndex; i++) {
                      const currentIndex = newFirstIndex + i;
                      const currentNewNode = newData[currentIndex];
                      if (newList.has(currentNewNode)) {
                        if (list[checkPointIndex + 1]) {
                          insertBefore.call(
                            parentNode,
                            currentNewNode.el,
                            checkPoint as Element
                          );
                          checkPoint = list[++checkPointIndex][0].el;
                        } else {
                          lastEl = list[checkPointIndex][0].el?.nextSibling;
                          if (lastEl) {
                            setElement(
                              currentNewNode.el,
                              lastEl as LastNodeType,
                              parentNode,
                              true
                            );
                          } else if (nodeParentNode) {
                            setElement(
                              currentNewNode.el,
                              nodeParentNode,
                              parentNode,
                              false
                            );
                          } else {
                            createError("Each render error");
                          }
                          isBig = true;
                        }
                      } else {
                        const { el, currentNode } = createElement(
                          currentNewNode,
                          index,
                          data,
                          dataId,
                          template,
                          isFirst,
                          currentIndex,
                          importData,
                          newCurrentNodes[i]
                        );
                        if (isBig) {
                          if (lastEl) {
                            setElement(
                              el as Element,
                              lastEl as LastNodeType,
                              parentNode,
                              true
                            );
                          } else if (nodeParentNode) {
                            setElement(
                              el as Element,
                              nodeParentNode,
                              parentNode,
                              false
                            );
                          } else {
                            createError("Each render error");
                          }
                        } else {
                          insertBefore.call(
                            parentNode,
                            el as Element,
                            checkPoint as Element
                          );
                        }
                        newData[currentIndex] = currentNode;
                      }
                    }
                  } else {
                    let newNodePrevious = nodePrevious;
                    for (let i = 0; newFirstIndex + i < newLastIndex; i++) {
                      const currentIndex = newFirstIndex + i;
                      const currentNewNode = newData[currentIndex];
                      const { el, currentNode } = createElement(
                        currentNewNode,
                        index,
                        data,
                        dataId,
                        template,
                        isFirst,
                        currentIndex,
                        importData,
                        newCurrentNodes[i]
                      );
                      setNode(currentComponent.nodes, currentNode);
                      if (nodePrevious) {
                        setElement(el, nodePrevious, parentNode, undefined);
                        newNodePrevious = newNodePrevious?.nextSibling;
                      } else if (nodeNext) {
                        setElement(el, nodeNext, parentNode, true);
                      } else if (nodeParentNode) {
                        setElement(el, nodeParentNode, parentNode, false);
                      } else {
                        createError("Each render error");
                      }
                      newData[currentIndex] = currentNode;
                    }
                  }
                }
                currentComponent.nodes = newData;
              }
            } else {
              createError("Key error");
            }
          } else {
            createError("Data type error");
          }
        };
        const newFunction = (
          attribute: any,
          dataId: number | undefined,
          index: number,
          importData: ImportDataType | undefined,
          currentComponent: EachDynamicNodeComponentType
        ) => {
          const renderNewFunction = (data: DynamicDataValueType) => {
            data = data as EachDataValueType;
            setDynamicNodes();
            try {
              renderDynamicNodes(importData, currentComponent);
            } catch (err) {
              this._dynamic.dynamicNodes = [];
              createError("Render error");
            }
            renderEachFunction(
              updateFunction,
              dataId,
              data,
              index,
              currentComponent
            );
          };
          if (
            attribute &&
            (checkObject(attribute) || Array.isArray(attribute))
          ) {
            if (checkObject(attribute)) {
              Object.entries(attribute).forEach(([property]) => {
                if (attribute[property]?.function)
                  createWarning("function is not working in Each component");
              });
            } else {
              const valueLength = attribute.length;
              for (let i = 0; i < valueLength; i++) {
                if (attribute[i]?.function)
                  createWarning("function is not working in Each component");
              }
            }
          }
          if (dataId !== undefined) {
            const data = this._dynamic.data.data.values.filter(
              (e) => e?.id === dataId
            );
            if (data.length > 1) {
              createError("id is unique");
            }
            if (data && data[0]) {
              const index = this._dynamic.data.data.values.indexOf(data[0]);
              if (index > -1) {
                const dataIndex = this._dynamic.data.data.values[index];
                if (
                  checkObject(dataIndex) &&
                  this._dynamic.data.data.values[index]?.value
                ) {
                  this._dynamic.data.data.values[index].oldValue = cloneValue(
                    this._dynamic.data.data.values[index].value
                  );
                  this._dynamic.data.data.values[index].value = attribute;
                  this._dynamic.data.data.values[index].importData = importData;
                  renderNewData(
                    this._dynamic.data.data.values[index]?.oldValue,
                    this._dynamic.data.data.values[index]?.value,
                    currentComponent,
                    dataId,
                    index,
                    this._dynamic.data.data.values[index].importData
                  );
                  renderNewFunction(
                    this._dynamic.data.data.values[index].value
                  );
                }
              }
            }
          } else {
            this.data = attribute;
            renderNewFunction(this.data);
          }
        };
        const getDefaultData = (dataId: IdType) => {
          const data = this._dynamic.data.data.values.filter(
            (e) => e?.id === dataId
          );
          if (data.length > 1) {
            createError("id is unique");
          }
          const defaultData =
            dataId !== undefined
              ? data && data[0] && data[0].value
                ? cloneValue(data[0].value)
                : undefined
              : this.data
              ? this.data
              : undefined;

          return defaultData;
        };
        const updateFunction = (
          name: string,
          dataId: number | undefined,
          index: number,
          currentComponent: EachDynamicNodeComponentType
        ) => {
          const updateData = (attr = getDefaultData(dataId)) => {
            return attr;
          };
          this.eachFunctions[name] = (attribute: any = updateData) => {
            if (typeof attribute === "function") {
              newFunction(
                attribute(getDefaultData(dataId)),
                dataId,
                index,
                getImportData(dataId),
                currentComponent
              );
            } else {
              newFunction(
                attribute,
                dataId,
                index,
                getImportData(dataId),
                currentComponent
              );
            }
          };
        };

        const renderDynamicData = (
          importData: DataType | undefined,
          isDataFunction?: boolean,
          oldData?: EachDataValueType,
          isDynamic?: boolean
        ) => {
          let data: EachDataValueType;
          const currentData = isDynamic && oldData ? oldData : this.data;
          if (isDataFunction) {
            const dataFunction: EachDataFunctionType = this
              .data as EachDataFunctionType;
            data = dataFunction({
              importedData: importData,
              currentData: oldData
            });
          } else {
            if (checkObject(currentData)) {
              data = { ...currentData };
              if (importData) data = concatObjects(data, importData);
            } else {
              const dataArray = currentData as Array<any>;
              data = [...dataArray];
              if (importData && !objectEmpty(importData)) {
                createWarning("ImportData replacing data");
                data = importData;
              }
            }
          }
          return data;
        };
        const getImportData = (dataId: IdType) => {
          const data = this._dynamic.data.data.values.filter(
            (e) => e?.id === dataId
          );
          if (data.length > 1) {
            createError("id is unique");
          }
          if (data && data[0]) {
            return data[0].importData;
          } else return undefined;
        };
        const getEventsData = (
          key: string,
          dataId: number,
          keyEl: string | undefined,
          index: number
        ) => {
          if (!keyEl) createError("key error");
          const currentComponent = getCurrentComponent(dataId);
          const currentDynamicNode = getDynamicNode(
            currentComponent,
            keyEl as string,
            false
          );
          const eachIndex = currentComponent.nodes.indexOf(currentDynamicNode);

          if (eachIndex === undefined) createError("EachIndex error");
          const indexData = renderIndexData(getData(dataId), eachIndex);
          const importData = getImportData(dataId);
          const newKey = getKey(key);
          const values = testValuesRegex(key)
            ? getValues(dataId, eachIndex)
            : undefined;
          const dataArray = renderDynamicKey(
            newKey === this.valueName ? indexData : importData,
            newKey === this.valueName ? index : 0,
            key,
            values,
            true
          );
          return dataArray[0];
        };
        const setNode = (nodes: ArrayNodeType, node?: NodeType) => {
          push.call(nodes, node);
          return node;
        };

        const setDynamicNodeComponentType = (
          dataId: number,
          elements: ElementsType,
          parentNode: ParentNode,
          nodePrevious?: DynamicNodeComponentNodeType,
          nodeNext?: DynamicNodeComponentNodeType,
          importObject?: ImportObjectType,
          template?: EachTemplateType
        ) => {
          const DynamicNodeComponent = createEachDynamicNodeComponentType(
            dataId,
            elements,
            parentNode,
            nodePrevious,
            nodeNext,
            importObject,
            template
          );

          push.call(this._dynamic.data.data.components, DynamicNodeComponent);
          return DynamicNodeComponent;
        };

        const setDynamicNodes = () => {
          const componentNodes = this._dynamic.data.data.components.map(
            (component) => component.nodes
          );
          const nodes = ([] as NodeType[]).concat.apply(
            [] as NodeType[],
            componentNodes
          );
          nodes.forEach((node: NodeType) => {
            push.call(this._dynamic.dynamicNodes, node);
          });
        };
        const getData = (dataId: number | undefined, isValue = true) => {
          const data = this._dynamic.data.data.values.filter(
            (e) => e?.id === dataId
          );
          if (data.length > 1) {
            createError("id is unique");
          }
          if (data && data[0]) {
            return isValue ? data[0].value : data[0];
          } else return undefined;
        };
        const getKey = (key: string) => {
          const newKey = renderKey(key);
          return checkObject(newKey)
            ? (newKey as DynamicKeyObjectType).key
            : newKey;
        };
        const renderEach = (
          data: DynamicDataValueType,
          isDataObject: boolean,
          dataId: number,
          index: number,
          parentNode: ParentNode,
          nodePrevious?: DynamicNodeComponentNodeType,
          nodeNext?: DynamicNodeComponentNodeType,
          importObject?: ImportObjectType,
          importData?: ImportDataType
        ) => {
          data = data as EachDataValueType;
          const oldData = isDataObject ? {} : [];
          const template = this.eachTemplate;
          const newTemplateObj = parseTemplate(
            template as string,
            index,
            dataId,
            trim,
            getEventsData,
            this.valueName,
            this.importedDataName,
            this.indexName,
            true,
            getEventsFunction
          );
          const currentComponent = setDynamicNodeComponentType(
            dataId,
            [],
            parentNode,
            nodePrevious,
            nodeNext,
            importObject,
            newTemplateObj
          );
          renderEachFunction(
            updateFunction,
            dataId,
            data,
            index,
            currentComponent
          );
          const elements: ScriptElementsType = {};
          try {
            renderNewData(
              oldData,
              data,
              currentComponent,
              dataId,
              index,
              importData,
              true
            );
          } catch (e) {
            createError(`${e}`);
          }
          if (
            currentComponent.nodes.length &&
            Array.isArray(this.script) &&
            this.script[1].elements
          ) {
            const elementsComponent = currentComponent.nodes.map((e) => e.el);
            const els = this.script[1].elements;
            Object.entries(els).forEach(([key, value]) => {
              elements[key] = elementsComponent.map((el) => {
                if (el) {
                  return (el as Element).querySelector(value);
                } else return null;
              });
            });
          }
          renderScriptsAndStyles(data, null, "afterLoad", importData, elements);
          this._dynamic.data.data.currentId += 1;
        };

        const renderTemplateData = (
          id: number,
          importData: DataType | undefined,
          index: number,
          isDataFunction?: boolean
        ): DynamicDataType => {
          const data = renderDynamicData(importData, isDataFunction);
          const dynamicData = {
            value: data,
            oldValue: undefined,
            importData,
            id
          };
          push.call(this._dynamic.data.data.values, dynamicData);
          const dynamicIndex =
            this._dynamic.data.data.values.indexOf(dynamicData);

          return this._dynamic.data.data.values[dynamicIndex];
        };
        const renderScriptsAndStyles = (
          data: EachDataValueType,
          e: Element | null,
          start: StartType,
          importData: DataType | undefined,
          elements?: ScriptElementsType
        ) => {
          if (typeof this.script !== "undefined") {
            if (Array.isArray(this.script)) {
              if (this.script[1].start === start) {
                renderScript(
                  data,
                  this.script,
                  this.eachFunctions,
                  importData,
                  elements
                );
              } else {
                if (
                  this.script[1].start === undefined &&
                  start === "afterLoad"
                ) {
                  renderScript(
                    data,
                    this.script,
                    this.eachFunctions,
                    importData,
                    elements
                  );
                }
              }
            } else {
              if (start === "afterLoad")
                renderScript(
                  data,
                  this.script,
                  this.eachFunctions,
                  importData,
                  elements
                );
            }
          }
          if (typeof this.attributes !== "undefined") {
            renderAttributes(e, this.attributes);
          }
        };
        const updateData = (
          id: number,
          importData: DataType | undefined,
          isDataFunction?: boolean
        ) => {
          const oldData = getData(id, false) as DynamicDataType;
          if (!oldData) createError("Render error");
          const clonedOldData = cloneValue(oldData.value);
          const data = renderDynamicData(
            importData,
            isDataFunction,
            oldData?.value,
            true
          );
          const dynamicIndex = this._dynamic.data.data.values.indexOf(oldData);
          this._dynamic.data.data.values[dynamicIndex].oldValue = clonedOldData;
          this._dynamic.data.data.values[dynamicIndex].value =
            data as DynamicDataType;
          this._dynamic.data.data.values[dynamicIndex].importData = importData;
        };
        const renderComponentsDynamic = (
          index: number,
          importData: DataType | undefined,
          isDataFunction: boolean | undefined,
          currentComponent: EachDynamicNodeComponentType
        ) => {
          updateData(index, importData, isDataFunction);
          renderNewData(
            this._dynamic.data.data.values[index]?.oldValue,
            this._dynamic.data.data.values[index]?.value,
            currentComponent,
            index,
            index,
            importData
          );
          setDynamicNodes();
          try {
            renderDynamicNodes(importData, currentComponent);
          } catch (err) {
            this._dynamic.dynamicNodes = [];
            createError("Render error");
          }
        };
        if (this.selector) {
          if (typeRender === "dynamic") {
            const components = this._dynamic.data.data.components;
            components.forEach((component) => {
              const index = component.id;
              if (index === undefined) createError("Index error");
              const importObject = component.import;
              const importIndex =
                importObject?.importIndex !== undefined
                  ? importObject.importIndex
                  : 0;
              const importData = renderImportData(
                null,
                exportData,
                importObject,
                importIndex
              );
              const isDataFunction = this.data && checkFunction(this.data);
              renderComponentsDynamic(
                index,
                importData,
                isDataFunction,
                component as EachDynamicNodeComponentType
              );
            });
          } else {
            document
              .querySelectorAll(`template[data-cample=${this.selector}]`)
              .forEach((e, index) => {
                const importObject = renderImport(e, this.import);
                this.importId = renderExportId(e, importId);
                const importData = renderImportData(e, exportData);
                const isDataFunction = this.data && checkFunction(this.data);
                const currentId = this._dynamic.data.data.currentId;
                const templateData = renderTemplateData(
                  currentId,
                  importData,
                  index,
                  isDataFunction
                );
                const data = templateData?.value;
                const isDataObject = checkObject(data);
                renderScriptsAndStyles(
                  data as EachDataValueType,
                  e,
                  "beforeLoad",
                  importData,
                  {}
                );
                const template = templateElement;
                const functionsArray: FunctionsArray = [];
                push.call(
                  functionsArray,
                  (
                    parentNode: ParentNode,
                    nodePrevious?: DynamicNodeComponentNodeType,
                    nodeNext?: DynamicNodeComponentNodeType
                  ) =>
                    renderEach(
                      data,
                      isDataObject,
                      currentId,
                      index,
                      parentNode,
                      nodePrevious,
                      nodeNext,
                      importObject,
                      importData
                    )
                );
                renderHTML(e, template, functionsArray, "each");
              });
          }
        }
      } else {
        createError("templateFunction is function");
      }
    } else {
      if (!isDataEachFunction) {
        createError("Data error");
      } else {
        createError("Property 'selector' is required");
      }
    }
  }
}
