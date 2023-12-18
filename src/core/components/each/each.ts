"use-strict";
import {
  checkFunction,
  concatObjects,
  createError,
  createWarning,
  checkObject,
  objectEmpty,
  cloneValue,
  getKey,
  getData,
  getCurrentComponent,
  swapElements
} from "../../../shared/utils";
import {
  DataType,
  DynamicDataType,
  DynamicDataValueType,
  EachDynamicNodeComponentType,
  DynamicFunctionsType,
  DynamicNodeComponentNodeType,
  EachDataFunctionType,
  EachDataValueType,
  EachOptionsType,
  ElementsType,
  ExportDataType,
  ExportIdType,
  FunctionsArray,
  NodeType,
  SelectorType,
  StartType,
  ComponentRenderType,
  ImportObjectType,
  ImportDataType,
  IdType,
  DynamicEl,
  EachTemplateType,
  NodeValuesType,
  NodeTextType,
  CurrentKeyType,
  IterationFunctionType,
  ScriptElementsType,
  ValueItemsType,
  ValueItemType,
  KeyValuesValueConditionType,
  ValueKeyStringType,
  TextArrayType,
  FunctionEventType,
  AttributesValType,
  NodeValueType,
  ClassType,
  ValuesTemplateType,
  IndexObjNode,
  RenderNodeFunctionType,
  ValueType,
  KeyValuesType,
  KeyValuesValueType
} from "../../../types/types";
import { createEachDynamicNodeComponentType } from "../../functions/data/create-each-dynamic-node-component";
import { renderAttributes } from "../../functions/render/render-attributes";
import { renderExportId } from "../../functions/render/render-export-id";
import { renderHTML } from "../../functions/render/render-html";
import { renderImport } from "../../functions/render/render-import";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderScript } from "../../functions/render/render-script";
import { DataComponent } from "../data-component/data-component";
import { renderDynamicKey } from "../../functions/render/render-dynamic-key";
import { updateAttributes } from "../../functions/data/update-attributes";
import { updateText } from "../../functions/data/update-text";
import { parseTemplate } from "../../functions/parse/parse-template";
import { createArgumentsTemplateFunction } from "../../functions/data/create-arguments-template-function";
import { updateClass } from "../../functions/data/update-class";
import {
  appendChild,
  cloneNode,
  concat,
  insertBefore,
  mapArray,
  nextSibling,
  push,
  remove,
  removeChild,
  updClass,
  updText
} from "../../../config/config";
import { renderCondition } from "../../functions/render/render-condition";
import { renderDynamic } from "../../functions/render/render-dynamic";

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
        const renderEachFunction = (
          updateFunction: (
            name: string,
            dataId: number | undefined,
            index: number,
            currentComponent: EachDynamicNodeComponentType
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
        const renderDynamicNodes = (
          importData: ImportDataType | undefined,
          currentComponent: EachDynamicNodeComponentType
        ) => {
          this._dynamic.dynamicNodes.forEach((e, i) => {
            if (!e.isNew) {
              const eachIndex = currentComponent.nodes.indexOf(e);
              const data = getData(this._dynamic.data.data.values, e.dataId);
              const val = data?.[eachIndex];
              e.values.forEach((value) => {
                switch (value.type) {
                  case 1:
                    const value1 = value;
                    const newData = String(
                      renderDynamic(value1.key, val, importData, eachIndex)
                    );
                    if (value1.value !== newData) {
                      value.value = newData;
                      value.render(newData);
                    }
                    break;
                  case 2:
                    const attrFunc = (key: CurrentKeyType) =>
                      renderDynamic(key, val, importData, eachIndex);
                    value.render(attrFunc);
                    break;
                  case 4:
                    const classFunc = (key: CurrentKeyType) =>
                      renderDynamic(key, val, importData, eachIndex);
                    value.render(classFunc);
                    break;
                }
              });
            } else delete this._dynamic.dynamicNodes[i].isNew;
          });
          this._dynamic.dynamicNodes = [];
        };
        const createElement = (
          indexData: any,
          index: number,
          dataId: number,
          templateEl: EachTemplateType,
          eachIndex?: number,
          importData?: ImportDataType,
          key?: string
        ) => {
          const {
            nodes: templateNodes,
            values: templateValues,
            el: templateElemenet
          } = templateEl;
          const el = cloneNode.call(templateElemenet, true);
          const length = templateNodes.length;
          const nodes: Array<IndexObjNode | ChildNode | null> = [];
          push.call(nodes, el as ChildNode);
          for (let i = 0; i < length; i++) {
            const templateNode = templateNodes[i];
            const { render, rootId } = templateNode;
            push.call(
              nodes,
              (render as RenderNodeFunctionType).call(nodes[rootId])
            );
          }
          const values: ValuesTemplateType = mapArray.call(
            templateValues,
            (o) => {
              return {
                ...o
              } as ValueType;
            }
          ) as ValuesTemplateType;
          const newValues: NodeValuesType = [];
          const valuesLength = values.length;
          for (let i = 0; i < valuesLength; i++) {
            const val = values[i];
            const valKey = val.key as CurrentKeyType;
            const node = nodes[val.id as number];
            switch (val.type) {
              case 0:
                const { render } = val;
                (render as FunctionEventType)(node, key);
                break;
              case 1:
                const newData = renderDynamic(
                  valKey,
                  indexData,
                  importData,
                  eachIndex
                );
                const texts = mapArray.call(val.texts, (e) => {
                  const node = nodes[e as number] as Text;
                  updText.call(node, newData);
                  return node;
                }) as TextArrayType;
                const fnText = (
                  currentIndexData: any,
                  currentImportData: any,
                  currentEachIndex: number | undefined,
                  val: NodeTextType
                ) => {
                  const newData = renderDynamic(
                    valKey,
                    currentIndexData,
                    currentImportData,
                    currentEachIndex
                  );
                  if (val.value !== newData) {
                    updateText(newData, texts);
                    val.value = newData;
                  }
                };
                push.call(newValues, {
                  render: fnText,
                  type: 1,
                  key: valKey,
                  value: newData
                } as NodeValueType);
                break;
              case 2:
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
                break;
              default:
                const { classes } = val;
                const { value: classListValue, render: renderClass } =
                  classes as ValueItemsType;
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
                  updateClass(node as Element, val, classVal);
                };
                const str = renderClass(
                  indexData,
                  classListValue,
                  importData,
                  eachIndex
                );
                if (str !== "") {
                  updClass.call(el, str);
                  val.old = str;
                }
                push.call(newValues, {
                  render: fnClass,
                  ...(val as ClassType)
                } as NodeValueType);
                break;
            }
          }
          const currentNode: NodeType = {
            index,
            values: newValues,
            dataId,
            el,
            key
          };
          return { el: el as Element, currentNode };
        };
        const getDynamicNode = (
          currentComponent: EachDynamicNodeComponentType,
          value: any
        ) => {
          let result: any = undefined;
          const array = currentComponent.nodes;
          for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (item?.["key"] === value) {
              result = item;
              break;
            }
          }
          return result;
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
          const dataArray = renderDynamicKey(importData, key, true);
          return dataArray[0];
        };
        const renderIteration = (
          eachIndex: number,
          indexData: any,
          importData: any
        ) => {
          const value = createArgumentsTemplateFunction(
            indexData,
            importData,
            this.valueName,
            this.importedDataName
          );
          (this.iteration as IterationFunctionType)(value, eachIndex);
        };
        const renderValuesNode = (
          currentNode: NodeType,
          indexData: any,
          eachIndex: number,
          importData: any
        ) => {
          for (const value of currentNode.values) {
            value.render(indexData, importData, eachIndex, value);
          }
        };
        const renderNewData = (
          oldData: any,
          newData: any,
          currentComponent: EachDynamicNodeComponentType,
          dataId: number,
          index: number,
          importData: ImportDataType | undefined
        ) => {
          const oldDataLength = oldData.length;
          const newDataLength = newData.length;
          const isOldDataEmpty = oldDataLength === 0;
          const isNewDataEmpty = newDataLength === 0;
          if (isOldDataEmpty && isNewDataEmpty) return;
          const { parentNode, nodes: oldNodes } = currentComponent;
          const template: EachTemplateType =
            currentComponent.template as EachTemplateType;
          let nodeNext = currentComponent.nodeNext as Node;
          const nodePrevious: Element =
            currentComponent.nodePrevious as Element;
          let nextElNode: CharacterData | null = null;
          const { key } = template as EachTemplateType;
          const { render: renderKey, value: keyValue } = key as ValueItemsType;
          const data = newData;
          if (isNewDataEmpty && oldDataLength) {
            if (nodePrevious !== null) {
              while (
                nextSibling.call(nodePrevious) !== null &&
                nextSibling.call(nodePrevious) !== nodeNext
              ) {
                remove.call(nextSibling.call(nodePrevious));
              }
            } else {
              if (nodeNext !== null) {
                while (nodeNext.previousSibling !== null) {
                  remove.call(nodeNext.previousSibling);
                }
              } else {
                parentNode.textContent = "";
              }
            }
            currentComponent.nodes = [];
            return;
          } else if (isOldDataEmpty && newDataLength) {
            const isNullNodeNext = nodeNext === null;
            if (isNullNodeNext) {
              nextElNode = document.createComment("");
              appendChild.call(parentNode, nextElNode);
              nodeNext = nextElNode as CharacterData;
            }
            if (this.iteration !== undefined) {
              for (let i = 0; i < newDataLength; i++) {
                const indexData = data[i];
                renderIteration(i, indexData, importData);
                const newKey = renderKey(indexData, keyValue, importData, i);
                const { el, currentNode } = createElement(
                  indexData,
                  index,
                  dataId,
                  template,
                  i,
                  importData,
                  newKey
                );
                push.call(currentComponent.nodes, currentNode);
                insertBefore.call(parentNode, el, nodeNext);
              }
            } else {
              for (let i = 0; i < newDataLength; i++) {
                const indexData = data[i];
                const newKey = renderKey(indexData, keyValue, importData, i);
                const { el, currentNode } = createElement(
                  indexData,
                  index,
                  dataId,
                  template,
                  i,
                  importData,
                  newKey
                );
                push.call(currentComponent.nodes, currentNode);
                insertBefore.call(parentNode, el, nodeNext);
              }
            }
            if (isNullNodeNext) {
              removeChild.call(parentNode, nextElNode as Node);
            }
            return;
          } else {
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
              if (
                oldLastIndex === oldFirstIndex ||
                newLastIndex === newFirstIndex
              ) {
                break;
              }
              if (
                oldNodes[oldFirstIndex].key ===
                (newFirstDataKey = renderKey(
                  newData[newFirstIndex],
                  keyValue,
                  importData,
                  newFirstIndex
                ))
              ) {
                renderValuesNode(
                  oldNodes[oldFirstIndex],
                  data[newFirstIndex],
                  newFirstIndex,
                  importData
                );
                newData[newFirstIndex++] = oldNodes[oldFirstIndex++];
                continue;
              }
              currentOldLastIndex = oldLastIndex - 1;
              currentNewLastIndex = newLastIndex - 1;
              if (
                oldNodes[currentOldLastIndex].key ===
                (newLastDataKey = renderKey(
                  newData[currentNewLastIndex],
                  keyValue,
                  importData,
                  currentNewLastIndex
                ))
              ) {
                renderValuesNode(
                  oldNodes[currentOldLastIndex],
                  data[currentNewLastIndex],
                  currentNewLastIndex,
                  importData
                );
                newData[currentNewLastIndex] = oldNodes[currentOldLastIndex];
                newLastIndex--;
                oldLastIndex--;
                continue;
              }
              if (
                oldNodes[oldFirstIndex].key === newLastDataKey &&
                oldNodes[currentOldLastIndex].key === newFirstDataKey
              ) {
                renderValuesNode(
                  oldNodes[currentOldLastIndex],
                  data[newFirstIndex],
                  newFirstIndex,
                  importData
                );
                renderValuesNode(
                  oldNodes[oldFirstIndex],
                  data[currentNewLastIndex],
                  currentNewLastIndex,
                  importData
                );
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
              const isNullNodeNext = nodeNext === null;
              if (isNullNodeNext) {
                nextElNode = document.createComment("");
                appendChild.call(parentNode, nextElNode);
                nodeNext = nextElNode as CharacterData;
              }
              const currentData = newData[newLastIndex];
              const lastEl =
                currentData !== undefined && currentData.el !== undefined
                  ? currentData.el
                  : nodeNext;
              for (
                let currentIndex = newFirstIndex;
                newFirstIndex < newLastIndex--;
                currentIndex++
              ) {
                const currentIndexData = newData[currentIndex];
                const newKey = renderKey(
                  currentIndexData,
                  keyValue,
                  importData,
                  currentIndex
                );
                const { el, currentNode } = createElement(
                  currentIndexData,
                  index,
                  dataId,
                  template,
                  currentIndex,
                  importData,
                  newKey
                );
                insertBefore.call(parentNode, el, lastEl);
                newData[currentIndex] = currentNode;
              }
              if (isNullNodeNext) {
                removeChild.call(parentNode, nextElNode as Node);
              }
            } else if (newLastIndex === newFirstIndex) {
              for (let i = oldFirstIndex; oldFirstIndex < oldLastIndex--; i++) {
                const currentNode = oldNodes[i];
                const { el } = currentNode;
                removeChild.call(parentNode, el as Node);
              }
            } else {
              const indexesOldArr = {};
              const oldLength = oldLastIndex - oldFirstIndex;
              for (
                let currentIndex = oldFirstIndex;
                currentIndex < oldLength;
                currentIndex++
              ) {
                indexesOldArr[oldNodes[currentIndex].key as string] =
                  currentIndex;
              }
              const oldСontainedKeys = {};
              while (
                oldFirstIndex < oldLastIndex ||
                newFirstIndex < newLastIndex
              ) {
                if (
                  oldLastIndex === oldFirstIndex ||
                  newLastIndex === newFirstIndex
                ) {
                  break;
                }
                if (
                  oldСontainedKeys[oldNodes[oldFirstIndex].key as string] !==
                  undefined
                ) {
                  oldFirstIndex++;
                }
                currentOldLastIndex = oldLastIndex - 1;
                if (
                  oldСontainedKeys[
                    oldNodes[currentOldLastIndex].key as string
                  ] !== undefined
                ) {
                  oldLastIndex--;
                }
                if (
                  oldNodes[oldFirstIndex].key ===
                  (newFirstDataKey = renderKey(
                    newData[newFirstIndex],
                    keyValue,
                    importData,
                    newFirstIndex
                  ))
                ) {
                  renderValuesNode(
                    oldNodes[oldFirstIndex],
                    data[newFirstIndex],
                    newFirstIndex,
                    importData
                  );
                  newData[newFirstIndex++] = oldNodes[oldFirstIndex++];
                  continue;
                }
                currentNewLastIndex = newLastIndex - 1;
                if (
                  oldNodes[currentOldLastIndex].key ===
                  (newLastDataKey = renderKey(
                    newData[currentNewLastIndex],
                    keyValue,
                    importData,
                    currentNewLastIndex
                  ))
                ) {
                  renderValuesNode(
                    oldNodes[currentOldLastIndex],
                    data[currentNewLastIndex],
                    currentNewLastIndex,
                    importData
                  );
                  newData[currentNewLastIndex] = oldNodes[currentOldLastIndex];
                  newLastIndex--;
                  oldLastIndex--;
                  continue;
                }
                if (
                  oldNodes[oldFirstIndex].key === newLastDataKey &&
                  oldNodes[currentOldLastIndex].key === newFirstDataKey
                ) {
                  renderValuesNode(
                    oldNodes[currentOldLastIndex],
                    data[newFirstIndex],
                    newFirstIndex,
                    importData
                  );
                  renderValuesNode(
                    oldNodes[oldFirstIndex],
                    data[currentNewLastIndex],
                    currentNewLastIndex,
                    importData
                  );
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
                if (indexesOldArr[newFirstDataKey] !== undefined) {
                  const currentIndex = indexesOldArr[newFirstDataKey];
                  const currentNode = oldNodes[currentIndex];
                  const { el } = currentNode;
                  oldСontainedKeys[newFirstDataKey] = null;
                  newData[newFirstIndex] = currentNode;
                  insertBefore.call(
                    parentNode,
                    el as Element,
                    oldNodes[oldFirstIndex].el as Element
                  );
                  renderValuesNode(
                    newData[newFirstIndex],
                    data[newFirstIndex],
                    newFirstIndex++,
                    importData
                  );
                  continue;
                }
                const { el, currentNode } = createElement(
                  newData[newFirstIndex],
                  index,
                  dataId,
                  template,
                  newFirstIndex,
                  importData,
                  newFirstDataKey
                );
                newData[newFirstIndex++] = currentNode;
                insertBefore.call(
                  parentNode,
                  el,
                  oldNodes[oldFirstIndex].el as Element
                );
                continue;
              }
              if (oldLastIndex === oldFirstIndex) {
                const isNullNodeNext = nodeNext === null;
                if (isNullNodeNext) {
                  nextElNode = document.createComment("");
                  appendChild.call(parentNode, nextElNode);
                  nodeNext = nextElNode as CharacterData;
                }
                const currentData = newData[newLastIndex];
                const lastEl =
                  currentData !== undefined && currentData.el !== undefined
                    ? currentData.el
                    : nodeNext;
                for (
                  let currentIndex = newFirstIndex;
                  newFirstIndex < newLastIndex--;
                  currentIndex++
                ) {
                  const currentIndexData = newData[currentIndex];
                  const newKey = renderKey(
                    currentIndexData,
                    keyValue,
                    importData,
                    currentIndex
                  );
                  const { el, currentNode } = createElement(
                    currentIndexData,
                    index,
                    dataId,
                    template,
                    currentIndex,
                    importData,
                    newKey
                  );
                  insertBefore.call(parentNode, el, lastEl);
                  newData[currentIndex] = currentNode;
                }
                if (isNullNodeNext) {
                  removeChild.call(parentNode, nextElNode as Node);
                }
              } else {
                for (
                  let i = oldFirstIndex;
                  oldFirstIndex < oldLastIndex--;
                  i++
                ) {
                  const currentNode = oldNodes[i];
                  if (
                    oldСontainedKeys[currentNode.key as string] === undefined
                  ) {
                    const { el } = currentNode;
                    removeChild.call(parentNode, el as Node);
                  }
                }
              }
            }
            currentComponent.nodes = newData;
            if (this.iteration !== undefined) {
              for (let i = 0; i < newDataLength; i++) {
                renderIteration(i, currentComponent.nodes[i], importData);
              }
            }
            return;
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
          let data: any = undefined;
          const array = this._dynamic.data.data.values;
          for (let i = 0; i < array.length; i++) {
            const item = array[i];
            if (item?.id === dataId) {
              data = item;
              break;
            }
          }
          if (data) {
            return data.importData;
          } else return undefined;
        };
        const getEventsData = (
          key: string,
          dataId: number,
          keyEl: string | undefined,
          index: number
        ) => {
          if (!keyEl) createError("key error");
          const currentComponent = getCurrentComponent(
            this._dynamic.data.data.components,
            dataId
          );
          const currentDynamicNode = getDynamicNode(
            currentComponent,
            keyEl as string
          );
          const eachIndex = currentComponent.nodes.indexOf(currentDynamicNode);
          if (eachIndex === undefined) createError("EachIndex error");
          const indexData = getData(this._dynamic.data.data.values, dataId)?.[
            eachIndex
          ];
          const importData = getImportData(dataId);
          const newKey = getKey(key);
          const dataArray = renderDynamicKey(
            newKey === this.valueName ? indexData : importData,
            key,
            true
          );
          return dataArray[0];
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
          const renderFn1 = (
            indexData: any,
            value: Array<ValueItemType>,
            importData: ImportDataType | undefined,
            eachIndex: number
          ): string => {
            let str = "";
            for (const val of value) {
              const { value: currentVal, render } = val;
              str += render(currentVal, indexData, importData, eachIndex);
            }
            return str;
          };
          const renderFn2 = (
            indexData: any,
            value: ValueItemType,
            importData: ImportDataType | undefined,
            eachIndex: number
          ): string => {
            const { value: val, render } = value;
            return render(val, indexData, importData, eachIndex);
          };
          const renderFn3 = (e: string) => e;
          const renderFn4 = (
            value: string | CurrentKeyType,
            indexData: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) =>
            renderDynamic(
              value as CurrentKeyType,
              indexData,
              importData,
              eachIndex
            );
          const renderFn5 = (
            operand: KeyValuesValueConditionType,
            indexData: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            renderCondition(operand, indexData, importData, eachIndex);
          };
          const renderFn6 = (
            str: { value: string },
            condition: boolean,
            vals: ValueKeyStringType,
            data: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            if (condition) {
              renderStr(str, vals, data, importData, eachIndex);
            }
          };
          const renderFn7 = (
            str: { value: string },
            condition: boolean,
            vals: ValueKeyStringType,
            data: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            const val = condition ? vals[0] : vals[1];
            renderStr(str, val, data, importData, eachIndex);
          };
          const renderStr = (
            str: { value: string },
            currentValues: ValueKeyStringType,
            data: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            const { value, render } = currentValues.valueClass;
            return render(str, value, data, importData, eachIndex);
          };
          const renderFn8 = (
            str: { value: string },
            currentValue: ValueItemType,
            data: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            const { value, render } = currentValue;
            const prop = render(value, data, importData, eachIndex);
            str.value += prop;
          };
          const renderFn9 = (
            str: { value: string },
            currentValues: Array<ValueItemType>,
            data: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            const length = currentValues.length;
            const lastIndex = length - 1;
            for (let i = 0; i < length; i++) {
              const { value, render } = currentValues[i];
              const prop = render(value, data, importData, eachIndex);
              str.value =
                i !== lastIndex
                  ? concat.call(str.value, " ", prop)
                  : concat.call(str.value, prop);
            }
          };
          const renderFn10 = (
            str: { value: string },
            currentValue: ValueItemType,
            data: any,
            importData: ImportDataType | undefined,
            eachIndex: number
          ) => {
            const { value, render } = currentValue;
            const prop = render(value, data, importData, eachIndex);
            str.value = prop;
          };
          const renderFn11 = (
            str: { value: string },
            currentVal: KeyValuesValueType,
            data: any,
            importData: any,
            eachIndex: number | undefined
          ) => {
            const condition = renderCondition(
              currentVal.condition,
              data,
              importData,
              eachIndex
            );
            const { values, render } = currentVal;
            render(str, condition, values, data, importData, eachIndex);
          };
          const renderFn12 = (
            str: { value: string },
            vals: KeyValuesType,
            data: any,
            importData: any,
            eachIndex: number | undefined
          ) => {
            for (let i = 0; i < vals.length; i++) {
              const currentVal = vals[i];
              const condition = renderCondition(
                currentVal.condition,
                data,
                importData,
                eachIndex
              );
              const { values, render } = currentVal;
              render(str, condition, values, data, importData, eachIndex);
            }
          };

          data = data as EachDataValueType;
          const oldData = isDataObject ? {} : [];
          const template = this.eachTemplate;
          const { obj: newTemplateObj } = parseTemplate(
            [
              renderFn1,
              renderFn2,
              renderFn3,
              renderFn4,
              renderFn5,
              renderFn6,
              renderFn7,
              renderFn8,
              renderFn9,
              renderFn10,
              renderFn11,
              renderFn12
            ],
            template as string,
            index,
            dataId,
            this.values,
            trim,
            getEventsData,
            getEventsFunction,
            undefined,
            undefined,
            undefined,
            this.valueName,
            this.importedDataName,
            this.indexName,
            true
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
          renderNewData(
            oldData,
            data,
            currentComponent,
            dataId,
            index,
            importData
          );
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
          const oldData = getData(
            this._dynamic.data.data.values,
            id,
            false
          ) as DynamicDataType;
          const clonedOldData = (oldData.value as Array<any>).slice();
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
          const data = this._dynamic.data.data.values[index];
          renderNewData(
            data.oldValue,
            data.value,
            currentComponent,
            index,
            index,
            importData
          );
        };
        if (this.selector) {
          if (typeRender === "dynamic") {
            const components = this._dynamic.data.data.components;
            for (const component of components) {
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
              const isDataFunction = checkFunction(this.data);
              renderComponentsDynamic(
                index,
                importData,
                isDataFunction,
                component as EachDynamicNodeComponentType
              );
            }
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
