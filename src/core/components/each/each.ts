"use-strict";
import {
  checkFunction,
  createError,
  checkObject,
  cloneValue,
  getKey,
  getData,
  getCurrentComponent,
  swapElements
} from "../../../shared/utils";
import {
  DataType,
  DynamicEachDataType,
  EachDynamicNodeComponentType,
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
  EachTemplateType,
  IterationFunctionType,
  ValueItemsType,
  FunctionsType
} from "../../../types/types";
import { createEachDynamicNodeComponentType } from "../../functions/data/create-each-dynamic-node-component";
import { renderAttributes } from "../../functions/render/render-attributes";
import { renderExportId } from "../../functions/render/render-export-id";
import { renderHTML } from "../../functions/render/render-html";
import { renderImport } from "../../functions/render/render-import";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderScript } from "../../functions/render/render-script";
import { DataComponent } from "../data-component/data-component";
import { parseTemplate } from "../../functions/parse/parse-template";
import { createArgumentsTemplateFunction } from "../../functions/data/create-arguments-template-function";
import {
  appendChild,
  insertBefore,
  nextSibling,
  push,
  remove,
  removeChild
} from "../../../config/config";
import { renderDynamic2 as renderDynamic } from "../../functions/render/render-dynamics";
import {
  renderFn1,
  renderFn2,
  renderFn3,
  renderFn5,
  renderFn6,
  renderFn7,
  renderFn8,
  renderFn9,
  renderFn10,
  renderFn11,
  renderFn12
} from "../../functions/render/render-template-functions";
import { createElement } from "../../functions/data/create-element";
import { renderFunctionsData } from "../../functions/render/render-functions-data";
import { renderFunctions } from "../../functions/render/render-functions";
import { renderComponentDynamicKeyData } from "../../functions/data/render-component-dynamic-key-data";
import { renderKey } from "../../functions/render/render-key";
import { renderComponentDynamicKey } from "../../functions/render/render-component-dynamic-key";

export class Each extends DataComponent {
  public data: EachDataFunctionType;
  public eachTemplate: string;
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
          keyEl: string | undefined,
          functions?: FunctionsType
        ) => {
          if (key === this.functionName)
            createError(
              "Data update function cannot be assigned as an event processing function"
            );
          if (!keyEl) createError("key error");
          const newKey = getKey(key);
          if (newKey === this.valueName) createError("key error");
          const importData = getImportData(dataId);
          const renderedKey = renderComponentDynamicKey(renderKey(key));
          const isImport = renderedKey[0] === this.importedDataName;
          let val = undefined;
          if (isImport) {
            val = renderComponentDynamicKeyData(
              importData,
              key,
              true,
              renderedKey
            );
          }
          if (!checkFunction(val) && functions) {
            val = renderComponentDynamicKeyData(
              functions,
              key,
              false,
              renderedKey
            );
          }
          return val;
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
          const values = currentNode.values;
          for (let i = 0; i < values.length; i++) {
            const value = values[i];
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
          if (isNewDataEmpty && oldDataLength !== 0) {
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
          } else if (isOldDataEmpty && newDataLength !== 0) {
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
                  renderDynamic,
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
                  renderDynamic,
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
                  renderDynamic,
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
                if (oldNodes[oldFirstIndex] === undefined) {
                  oldFirstIndex++;
                  continue;
                }
                currentOldLastIndex = oldLastIndex - 1;
                if (oldNodes[currentOldLastIndex] === undefined) {
                  oldLastIndex--;
                  continue;
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
                  oldNodes[currentIndex] = undefined as unknown as NodeType;
                  continue;
                }
                const { el, currentNode } = createElement(
                  renderDynamic,
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
                    renderDynamic,
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
                  if (currentNode !== undefined) {
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
          dataId: IdType,
          index: number,
          importData: ImportDataType | undefined,
          currentComponent?: EachDynamicNodeComponentType
        ) => {
          if (dataId !== undefined && currentComponent !== undefined) {
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
                  renderFunctionsData(
                    updateFunction,
                    dataId,
                    undefined,
                    index,
                    undefined,
                    currentComponent
                  );
                }
              }
            }
          } else {
            this.data = attribute;
            renderFunctionsData(
              updateFunction,
              dataId,
              undefined,
              index,
              undefined,
              currentComponent
            );
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
          key: string,
          dataId: IdType,
          index: number,
          _: boolean = false,
          currentComponent?: EachDynamicNodeComponentType
        ) => {
          const updateData = (attr = getDefaultData(dataId)) => {
            return attr;
          };
          if (currentComponent) {
            currentComponent.dataFunctions[name] = (
              attribute: any = updateData
            ) => {
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
          }
        };

        const renderDynamicData = (
          importData: DataType | undefined,
          isDataFunction?: boolean,
          oldData?: EachDataValueType,
          isDynamic?: boolean
        ) => {
          let data: EachDataValueType;
          const currentData =
            isDynamic && oldData !== undefined ? oldData : this.data;
          if (isDataFunction) {
            const dataFunction: EachDataFunctionType = this
              .data as EachDataFunctionType;
            data = dataFunction({
              importedData: importData,
              currentData: oldData
            });
          } else {
            const dataArray = currentData as Array<any>;
            data = [...dataArray];
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
          _: number
        ) => {
          if (keyEl === undefined) createError("key error");
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
          const val = renderComponentDynamicKeyData(
            newKey === this.valueName ? indexData : importData,
            key,
            true
          );
          return val;
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

        const renderEach = (
          data: EachDataValueType,
          isDataObject: boolean,
          dataId: number,
          index: number,
          parentNode: ParentNode,
          nodePrevious?: DynamicNodeComponentNodeType,
          nodeNext?: DynamicNodeComponentNodeType,
          importObject?: ImportObjectType,
          importData?: ImportDataType
        ) => {
          const oldData = isDataObject ? {} : [];
          const template = this.eachTemplate;
          const currentComponent = setDynamicNodeComponentType(
            dataId,
            [],
            parentNode,
            nodePrevious,
            nodeNext,
            importObject,
            undefined
          );
          const dataFunction = {
            [this.functionName]: this.valueName
          };
          const setDataFunctions = () => {
            renderFunctionsData(
              updateFunction,
              dataId,
              dataFunction,
              index,
              undefined,
              currentComponent
            );
          };

          const runRenderFunction = () => {
            renderFunctions(
              currentComponent.functions,
              currentComponent.dataFunctions,
              this.functions,
              true
            );
          };

          const { obj: newTemplateObj } = parseTemplate(
            [
              renderFn1,
              renderFn2,
              renderFn3,
              renderDynamic,
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
            setDataFunctions,
            runRenderFunction,
            currentComponent.functions,
            this.valueName,
            this.importedDataName,
            this.indexName,
            true
          );
          currentComponent.template = newTemplateObj;
          renderNewData(
            oldData,
            data,
            currentComponent,
            dataId,
            index,
            importData
          );
          renderScriptsAndStyles(
            data,
            null,
            "afterLoad",
            importData,
            currentComponent
          );
          this._dynamic.data.data.currentId += 1;
        };

        const renderTemplateData = (
          id: number,
          importData: DataType | undefined,
          isDataFunction?: boolean
        ): DynamicEachDataType => {
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
          return this._dynamic.data.data.values[
            dynamicIndex
          ] as DynamicEachDataType;
        };
        const renderScriptsAndStyles = (
          data: EachDataValueType,
          e: Element | null,
          start: StartType,
          importData: DataType | undefined,
          component?: EachDynamicNodeComponentType
        ) => {
          if (typeof this.script !== "undefined") {
            if (Array.isArray(this.script)) {
              if (this.script[1].start === start) {
                renderScript(
                  e,
                  data,
                  this.script,
                  component?.dataFunctions,
                  importData
                );
              } else {
                if (
                  this.script[1].start === undefined &&
                  start === "afterLoad"
                ) {
                  renderScript(
                    e,
                    data,
                    this.script,
                    component?.dataFunctions,
                    importData
                  );
                }
              }
            } else {
              if (start === "afterLoad")
                renderScript(
                  e,
                  data,
                  this.script,
                  component?.dataFunctions,
                  importData
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
          ) as DynamicEachDataType;
          const clonedOldData = (oldData.value as Array<any>).slice();
          const data = renderDynamicData(
            importData,
            isDataFunction,
            oldData?.value,
            true
          );
          const dynamicIndex = this._dynamic.data.data.values.indexOf(oldData);
          this._dynamic.data.data.values[dynamicIndex].oldValue = clonedOldData;
          this._dynamic.data.data.values[dynamicIndex].value = data;
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
                  undefined
                );
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
                renderHTML(e, templateElement, functionsArray, "each");
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
