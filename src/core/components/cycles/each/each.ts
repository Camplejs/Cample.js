"use-strict";
import {
  checkFunction,
  checkNodes,
  concatObjects,
  createError,
  createWarning,
  checkObject,
  objectEmpty,
  getDynamicElements,
  filterDuplicate,
  concatArrays,
  filterKey,
  cloneValue,
  createElement,
  getEventAttrs,
  testValuesRegex
} from "../../../../shared/utils";
import {
  DataType,
  DynamicDataType,
  DynamicDataValueType,
  EachDynamicNodeComponentType,
  DynamicFunctionsType,
  DynamicNodeComponentNodeType,
  DynamicTextType,
  EachDataFunctionType,
  EachDataObjectType,
  EachDataType,
  EachDataValueType,
  EachOptionsType,
  EachTemplateFunction,
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
  ArrayStringType,
  ValuesArguments
} from "../../../../types/types";
import { createEachDynamicNodeComponentType } from "../../../functions/data/create-each-dynamic-node-component";
import { createNode } from "../../../functions/data/create-node";
import { renderAttributes } from "../../../functions/render/render-attributes";
import { renderExportId } from "../../../functions/render/render-export-id";
import { renderHTML } from "../../../functions/render/render-html";
import { renderImport } from "../../../functions/render/render-import";
import { renderImportData } from "../../../functions/render/render-import-data";
import { renderIndexData } from "../../../functions/render/render-index-data";
import { renderScript } from "../../../functions/render/render-script";
import { renderTemplateElement } from "../../../functions/render/render-template-element";
import { DataComponent } from "../../data-component/data-component";
import { createArgumentsTemplateFunction } from "../../../functions/data/create-arguments-template-function";
import { renderKey } from "../../../functions/render/render-key";
import { renderStaticExport } from "../../../functions/data/render-static-export";
import { renderDynamicKey } from "../../../functions/render/render-dynamic-key";

export class Each extends DataComponent {
  public data: EachDataType;
  public templateFunction: EachTemplateFunction;
  public function: DynamicFunctionsType;
  public functionName: string;
  public valueName: string;
  public importedDataName: string;
  public componentData: boolean;

  constructor(
    selector: SelectorType,
    data: EachDataType,
    templateFunction: EachTemplateFunction,
    options: EachOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.data = data;
    this.templateFunction = templateFunction;
    this.function = {};
    this.valueName = options.valueName ? options.valueName : "data";
    this.functionName = options.functionName ? options.functionName : "setData";
    this.importedDataName = options.importedDataName
      ? options.importedDataName
      : "importedData";
    this.componentData =
      options.componentData !== undefined ? options.componentData : false;
  }

  _getExport(): ExportDataType | undefined {
    return renderStaticExport(this.export);
  }

  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType,
    typeRender: ComponentRenderType = "static"
  ): void {
    if (typeof this.selector !== "undefined") {
      if (
        (this.data && (Array.isArray(this.data) || checkObject(this.data))) ||
        checkFunction(this.data)
      ) {
        if (checkFunction(this.templateFunction)) {
          let templateElement: any = null;
          const trim =
            (trimHTML && this.trimHTML === undefined) || this.trimHTML;
          if (typeof this.options !== "undefined") {
            if (this.options.element) {
              templateElement = renderTemplateElement(
                this.options.element.selector,
                this.options.element.id,
                this.options.element.class,
                this.options.element.attributes
              );
            }
          }
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
          const renderEachFunction = (
            updateFunction: (
              name: string,
              dataId: number | undefined,
              index: number,
              importData: ImportDataType | undefined
            ) => void,
            dataId: number | undefined,
            data: EachDataValueType,
            index: number,
            importData: ImportDataType | undefined
          ) => {
            if (data !== undefined) {
              updateFunction(this.functionName, dataId, index, importData);
            }
          };
          const condition =
            (replaceTags && this.replaceTag === undefined) || this.replaceTag;
          const renderDynamicNodes = (
            index: number,
            importData: ImportDataType | undefined
          ) => {
            this._dynamic.dynamicNodes.forEach((e, i) => {
              const val = renderIndexData(getData(e.dataId), e.eachIndex);
              e.dynamicTexts.forEach((filtredVal: DynamicTextType) => {
                const index = e.dynamicTexts.indexOf(filtredVal);
                let newData: any = undefined;
                let isProperty = false;
                const newKey = getKey(filtredVal.key);
                if (
                  newKey === this.valueName ||
                  newKey === this.importedDataName ||
                  testValuesRegex(filtredVal.key)
                ) {
                  const values = testValuesRegex(filtredVal.key)
                    ? getValues(e.dataId, e.eachIndex)
                    : undefined;
                  const dataArray = renderDynamicKey(
                    newKey === this.valueName ? val : importData,
                    newKey === this.valueName ? index : 0,
                    filtredVal.key,
                    values,
                    true,
                    newKey === this.valueName ? this.componentData : false
                  );
                  newData = dataArray[0];
                  isProperty = dataArray[1];
                }
                this._dynamic.dynamicNodes[i].dynamicTexts[index] =
                  e.updateText(newData, filtredVal, e.texts, isProperty);
                this._dynamic.dynamicNodes[i].texts = filterDuplicate(
                  concatArrays(
                    this._dynamic.dynamicNodes[i].texts,
                    this._dynamic.dynamicNodes[i].dynamicTexts[index].texts
                  )
                );
                this._dynamic.dynamicNodes[i].texts =
                  this._dynamic.dynamicNodes[i].texts.filter((text) => {
                    if (text) {
                      return text;
                    }
                  });
              });
              if (Object.keys(e.attrs).length) {
                e.dynamicAttrs.forEach((keyAttr) => {
                  const indexData = renderIndexData(
                    getData(e.dataId),
                    e.eachIndex
                  );
                  let newData: any = undefined;
                  let isProperty = false;
                  const newKey = getKey(keyAttr);
                  if (
                    newKey === this.valueName ||
                    newKey === this.importedDataName ||
                    testValuesRegex(keyAttr)
                  ) {
                    const values = testValuesRegex(keyAttr)
                      ? getValues(e.dataId, e.eachIndex)
                      : undefined;
                    const dataArray = renderDynamicKey(
                      newKey === this.valueName ? indexData : importData,
                      newKey === this.valueName ? index : 0,
                      keyAttr,
                      values,
                      true,
                      newKey === this.valueName ? this.componentData : false
                    );
                    newData = dataArray[0];
                    isProperty = dataArray[1];
                  }
                  this._dynamic.dynamicNodes[i].attrs =
                    this._dynamic.dynamicNodes[i].updateAttr(
                      newData,
                      keyAttr,
                      isProperty
                    );
                });
              }
              if (Object.keys(e.listeners).length) {
                Object.entries(e.listeners).forEach(([key, value]) => {
                  const newArgs = [...value.value.arguments];
                  this._dynamic.dynamicNodes[i].updateListeners(
                    value.fn,
                    newArgs,
                    key,
                    e.isListeners,
                    e.eachIndex
                  );
                  this._dynamic.dynamicNodes[i].isListeners = false;
                });
              }
            });
            this._dynamic.dynamicNodes = [];
          };
          const setElement = (
            currentDynamicNodeComponentType: EachDynamicNodeComponentType,
            data: any,
            lastNode: LastNodeType,
            parentNode: ParentNode,
            index: number,
            dataId: number,
            eachIndex: number,
            isNext?: boolean,
            importData?: ImportDataType
          ) => {
            const value = createArgumentsTemplateFunction(
              checkObject(data)
                ? Object.entries(data)[eachIndex]
                : data[eachIndex],
              importData,
              this.valueName,
              this.importedDataName
            );
            const template = this.templateFunction(value, eachIndex);
            const el = createElement(template);
            if (el) {
              if (
                parentNode === lastNode.parentNode ||
                parentNode === lastNode
              ) {
                if (parentNode === lastNode) {
                  parentNode.appendChild(el);
                } else if (isNext) {
                  parentNode.insertBefore(el, lastNode);
                } else {
                  parentNode.insertBefore(el, lastNode.nextSibling);
                }
                currentDynamicNodeComponentType?.elements.push(el);
                setDynamicArrayNodes(
                  [el],
                  index,
                  data,
                  dataId,
                  eachIndex,
                  importData
                );
              } else {
                createError("Element of Each error");
              }
            }
          };
          const deleteElement = (
            currentDynamicNodeComponentType: EachDynamicNodeComponentType,
            element: Element,
            parentNode: ParentNode,
            index: number,
            dataId: number,
            eachIndex: number
          ) => {
            if (parentNode === element.parentNode) {
              deleteDynamicArrayNodes(dataId, eachIndex);
              const currentIndex =
                currentDynamicNodeComponentType.elements.indexOf(element);
              if (currentIndex > -1) {
                currentDynamicNodeComponentType.elements.splice(
                  currentIndex,
                  1
                );
              } else {
                createError("Element error");
              }
              parentNode.removeChild(element);
            } else {
              createError("Element of Each error");
            }
          };
          const renderNewData = (
            oldData: any,
            newData: any,
            dataId: number,
            index: number,
            importData: ImportDataType | undefined
          ) => {
            if (
              Array.isArray(newData) ||
              (checkObject(newData) &&
                (Array.isArray(oldData) || checkObject(oldData)))
            ) {
              const currentDynamicNodeComponentTypeArray =
                this._dynamic.data.data.components.filter(
                  (e) => e?.id === dataId
                );
              if (currentDynamicNodeComponentTypeArray.length > 1) {
                createError("id is unique");
              }
              const isOldDataArray = Array.isArray(oldData);
              const isNewDataArray = Array.isArray(newData);
              const currentDynamicNodeComponentType =
                currentDynamicNodeComponentTypeArray[0] as EachDynamicNodeComponentType;
              const {
                elements,
                parentNode,
                nodeNext,
                nodePrevious,
                nodeParentNode
              } = currentDynamicNodeComponentType;
              const oldDataLength = isOldDataArray
                ? oldData.length
                : Object.keys(oldData).length;
              const newDataLength = isNewDataArray
                ? newData.length
                : Object.keys(newData).length;
              if (oldDataLength < newDataLength) {
                const diffrenceLength = newDataLength - oldDataLength;
                let newNodePrevious = nodePrevious;
                for (let i = 0; i < diffrenceLength; i++) {
                  const newIndex = oldDataLength + i;
                  if (oldDataLength === 0) {
                    if (newNodePrevious) {
                      setElement(
                        currentDynamicNodeComponentType,
                        newData,
                        newNodePrevious,
                        parentNode,
                        index,
                        dataId,
                        newIndex,
                        undefined,
                        importData
                      );
                      newNodePrevious = newNodePrevious.nextSibling;
                    } else if (nodeNext) {
                      setElement(
                        currentDynamicNodeComponentType,
                        newData,
                        nodeNext,
                        parentNode,
                        index,
                        dataId,
                        newIndex,
                        true,
                        importData
                      );
                    } else if (nodeParentNode) {
                      setElement(
                        currentDynamicNodeComponentType,
                        newData,
                        nodeParentNode,
                        parentNode,
                        index,
                        dataId,
                        newIndex,
                        undefined,
                        importData
                      );
                    } else {
                      createError("Each render error");
                    }
                  } else {
                    if (elements.length === 0) createError("Elements error");
                    let el: LastNodeType = elements[elements.length - 1];
                    setElement(
                      currentDynamicNodeComponentType,
                      newData,
                      el,
                      parentNode,
                      index,
                      dataId,
                      newIndex,
                      undefined,
                      importData
                    );
                    if (el.nextSibling) {
                      el = el.nextSibling;
                    } else createError("Each render error");
                  }
                }
              } else if (oldDataLength > newDataLength) {
                const diffrenceLength = oldDataLength - newDataLength;
                const lastIndex = oldDataLength ? oldDataLength - 1 : 0;
                for (let i = 0; i < diffrenceLength; i++) {
                  const oldIndex = lastIndex - i;
                  if (elements[oldIndex] !== undefined) {
                    if (newDataLength === 0 && oldIndex === 0) {
                      const lengthNextNode =
                        elements[oldIndex].nextSibling !== null
                          ? elements[oldIndex].nextSibling
                          : undefined;
                      const lengthPreviousNode = elements[oldIndex]
                        .previousSibling
                        ? elements[oldIndex].previousSibling
                        : undefined;
                      const lengthParentNode = elements[oldIndex].parentNode
                        ? elements[oldIndex].parentNode
                        : undefined;
                      if (lengthNextNode) {
                        currentDynamicNodeComponentType.nodeNext =
                          lengthNextNode;
                      }
                      if (lengthPreviousNode) {
                        currentDynamicNodeComponentType.nodePrevious =
                          lengthPreviousNode;
                      }
                      if (lengthParentNode) {
                        currentDynamicNodeComponentType.nodeParentNode =
                          lengthParentNode;
                      }
                    }
                    deleteElement(
                      currentDynamicNodeComponentType,
                      elements[oldIndex],
                      parentNode,
                      index,
                      dataId,
                      oldIndex
                    );
                  } else {
                    createError("Delete error");
                  }
                }
              }
            } else {
              createError("Data type error");
            }
          };
          const newFunction = (
            attribute: any,
            dataId: number | undefined,
            index: number,
            importData: ImportDataType | undefined
          ) => {
            const renderNewFunction = (data: DynamicDataValueType) => {
              data = data as EachDataValueType;
              setDynamicNodes("", true);
              try {
                renderDynamicNodes(index, importData);
              } catch (err) {
                this._dynamic.dynamicNodes = [];
                createError("Render error");
              }
              renderEachFunction(
                updateFunction,
                dataId,
                data,
                index,
                importData
              );
            };
            if (
              this.componentData &&
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
                    this._dynamic.data.data.values[index].importData =
                      importData;
                    renderNewData(
                      this._dynamic.data.data.values[index]?.oldValue,
                      this._dynamic.data.data.values[index]?.value,
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
            importData: ImportDataType | undefined
          ) => {
            const updateData = (attr = getDefaultData(dataId)) => {
              return attr;
            };
            this.function[name] = (attribute: any = updateData) => {
              if (typeof attribute === "function") {
                newFunction(
                  attribute(getDefaultData(dataId)),
                  dataId,
                  index,
                  getImportData(dataId)
                );
              } else {
                newFunction(attribute, dataId, index, getImportData(dataId));
              }
            };
          };

          const renderDynamicData = (
            importData: DataType,
            isDataFunction?: boolean,
            oldData?: EachDataValueType,
            isDynamic?: boolean
          ) => {
            let data: EachDataValueType;
            const currentData = isDynamic && oldData ? oldData : this.data;
            if (isDataFunction) {
              const dataFunction: EachDataFunctionType = this
                .data as EachDataFunctionType;
              data = dataFunction({ data: importData, currentData: oldData });
            } else {
              if (checkObject(currentData)) {
                data = { ...currentData };
                data = concatObjects(data, importData);
              } else {
                const dataArray = currentData as Array<any>;
                data = [...dataArray];
                if (!objectEmpty(importData)) {
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
            eachIndex: number | undefined,
            index: number
          ) => {
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
              true,
              newKey === this.valueName ? this.componentData : false
            );
            return dataArray[0];
          };
          const setNode = (
            el: Element,
            index: number,
            data: EachDataValueType,
            id: number,
            eachIndex: number,
            importData: ImportDataType | undefined
          ) => {
            const node = createNode(
              el,
              index,
              getEventsData,
              data,
              id,
              true,
              eachIndex,
              this.componentData,
              importData
            );
            this._dynamic.data.nodes.push(node);
          };

          const setDynamicNodeComponentType = (
            dataId: number,
            elements: ElementsType,
            parentNode: ParentNode,
            nodePrevious?: DynamicNodeComponentNodeType,
            nodeNext?: DynamicNodeComponentNodeType,
            importObject?: ImportObjectType
          ) => {
            const DynamicNodeComponent = createEachDynamicNodeComponentType(
              dataId,
              elements,
              parentNode,
              nodePrevious,
              nodeNext,
              importObject
            );
            this._dynamic.data.data.components.push(DynamicNodeComponent);
          };

          const setDynamicNodes = (key: string, isAllUpdate = false) => {
            this._dynamic.data.nodes.forEach((node: NodeType) => {
              if (isAllUpdate) {
                this._dynamic.dynamicNodes.push(node);
              } else {
                const nodeIsKey = filterKey(node.dynamicTexts, key).length;
                if (nodeIsKey) {
                  this._dynamic.dynamicNodes.push(node);
                }
              }
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
          const deleteDynamicArrayNodes = (
            currentId: number,
            eachIndex?: number
          ) => {
            const currentDynamicNodes = this._dynamic.data.nodes
              .filter((e) => e?.index === currentId)
              .filter((e) => e?.eachIndex === eachIndex);
            currentDynamicNodes.forEach((e) => {
              const nodeIndex = this._dynamic.data.nodes.indexOf(e);
              if (nodeIndex > -1) {
                this._dynamic.data.nodes.splice(nodeIndex, 1);
              }
            });
          };
          const setDynamicArrayNodes = (
            elements: ElementsType,
            index: number,
            data: DynamicDataValueType,
            dataId: number,
            eachIndex?: number,
            importData?: ImportDataType
          ) => {
            elements.forEach((e, i) => {
              const dynamicArray = getDynamicElements(e);
              if (dynamicArray.length) {
                dynamicArray.forEach((el) => {
                  let dataValue: any;
                  if (data !== undefined) {
                    if (checkObject(data)) {
                      dataValue = Object.entries(data)[i][1];
                    } else {
                      if (Array.isArray(data)) {
                        dataValue = data[i];
                      } else {
                        createError("Data error");
                      }
                    }
                  } else {
                    dataValue = undefined;
                  }
                  setNode(
                    el,
                    index,
                    dataValue,
                    dataId,
                    eachIndex !== undefined ? eachIndex : i,
                    importData
                  );
                  const currentEventProperties = getEventAttrs(el);
                  if (currentEventProperties.length)
                    unrenderEvents(el, currentEventProperties);
                });
              }
            });
          };
          const getKey = (key: string) => {
            const newKey = renderKey(key);
            return checkObject(newKey)
              ? (newKey as DynamicKeyObjectType).key
              : newKey;
          };
          const render = (
            index: number,
            importData: ImportDataType | undefined
          ) => {
            setDynamicNodes("", true);
            for (let i = 0; i < this._dynamic.dynamicNodes.length; i++) {
              const indexData = renderIndexData(
                getData(this._dynamic.dynamicNodes[i].dataId),
                this._dynamic.dynamicNodes[i].eachIndex
              );

              this._dynamic.dynamicNodes[i].dynamicTexts.forEach((val, j) => {
                let newData: any = undefined;
                let isProperty = false;
                const newKey = getKey(val.key);
                if (
                  newKey === this.valueName ||
                  newKey === this.importedDataName ||
                  testValuesRegex(val.key)
                ) {
                  const values = testValuesRegex(val.key)
                    ? getValues(
                        this._dynamic.dynamicNodes[i].dataId,
                        this._dynamic.dynamicNodes[i].eachIndex
                      )
                    : undefined;
                  const dataArray = renderDynamicKey(
                    newKey === this.valueName ? indexData : importData,
                    newKey === this.valueName ? index : 0,
                    val.key,
                    values,
                    true,
                    newKey === this.valueName ? this.componentData : false
                  );
                  newData = dataArray[0];
                  isProperty = dataArray[1];
                }

                this._dynamic.dynamicNodes[i].dynamicTexts[j] =
                  this._dynamic.dynamicNodes[i].updateText(
                    newData,
                    val,
                    this._dynamic.dynamicNodes[i].texts,
                    isProperty
                  );
                this._dynamic.dynamicNodes[i].texts = filterDuplicate(
                  concatArrays(
                    this._dynamic.dynamicNodes[i].texts,
                    this._dynamic.dynamicNodes[i].dynamicTexts[j].texts
                  )
                );
                this._dynamic.dynamicNodes[i].texts =
                  this._dynamic.dynamicNodes[i].texts.filter((text) => {
                    if (text) {
                      return text;
                    }
                  });
              });
              if (Object.keys(this._dynamic.dynamicNodes[i].attrs).length) {
                this._dynamic.dynamicNodes[i].dynamicAttrs.forEach(
                  (keyAttr) => {
                    let newData: any = undefined;
                    let isProperty = false;
                    const newKey = getKey(keyAttr);
                    if (
                      newKey === this.valueName ||
                      newKey === this.importedDataName ||
                      testValuesRegex(keyAttr)
                    ) {
                      const values = testValuesRegex(keyAttr)
                        ? getValues(
                            this._dynamic.dynamicNodes[i].dataId,
                            this._dynamic.dynamicNodes[i].eachIndex
                          )
                        : undefined;
                      const dataArray = renderDynamicKey(
                        newKey === this.valueName ? indexData : importData,
                        newKey === this.valueName ? index : 0,
                        keyAttr,
                        values,
                        true,
                        newKey === this.valueName ? this.componentData : false
                      );
                      newData = dataArray[0];
                      isProperty = dataArray[1];
                    }
                    this._dynamic.dynamicNodes[i].attrs =
                      this._dynamic.dynamicNodes[i].updateAttr(
                        newData,
                        keyAttr,
                        isProperty
                      );
                  }
                );
              }
              if (Object.keys(this._dynamic.dynamicNodes[i].listeners).length) {
                Object.entries(this._dynamic.dynamicNodes[i].listeners).forEach(
                  ([key, value]) => {
                    const newArgs = [...value.value.arguments];
                    this._dynamic.dynamicNodes[i].updateListeners(
                      value.fn,
                      newArgs,
                      key,
                      this._dynamic.dynamicNodes[i].isListeners,
                      this._dynamic.dynamicNodes[i].eachIndex
                    );
                    this._dynamic.dynamicNodes[i].isListeners = false;
                  }
                );
              }
            }
            this._dynamic.dynamicNodes = [];
          };
          const unrenderEvents = (
            el: Element,
            eventProperties: ArrayStringType
          ) => {
            if (el) {
              eventProperties.forEach((prop) => {
                el.removeAttribute(prop);
              });
            }
          };
          const renderEach = (
            elements: ElementsType,
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
            renderEachFunction(updateFunction, dataId, data, index, importData);
            if (elements && elements.length) {
              const renderElements = () => {
                setDynamicArrayNodes(
                  elements,
                  index,
                  data,
                  dataId,
                  undefined,
                  importData
                );
                try {
                  render(index, importData);
                } catch (err) {
                  createError(`${err}`);
                }
              };
              if (isDataObject) {
                if (elements.length === Object.keys(data).length) {
                  renderElements();
                } else {
                  createError("Render data error");
                }
              } else {
                if (elements.length === data.length) {
                  renderElements();
                } else {
                  createError("Render data error");
                }
              }
            }
            setDynamicNodeComponentType(
              dataId,
              elements,
              parentNode,
              nodePrevious,
              nodeNext,
              importObject
            );
            this._dynamic.data.data.currentId += 1;
          };

          const renderTemplateData = (
            id: number,
            importData: DataType,
            index: number,
            isDataFunction?: boolean
          ): [DynamicDataType, string] => {
            const data = renderDynamicData(importData, isDataFunction);
            const dynamicData = {
              value: data,
              oldValue: undefined,
              importData,
              id
            };
            this._dynamic.data.data.values.push(dynamicData);
            const dynamicIndex =
              this._dynamic.data.data.values.indexOf(dynamicData);

            let template = "";

            const renderTemplate = (value: EachDataObjectType, i: number) => {
              const templateString = this.templateFunction(value, i);
              const newTemplate = trim ? templateString.trim() : templateString;
              if (checkNodes(newTemplate)) {
                template += newTemplate;
              } else {
                createError(
                  "Component include only one node with type 'Element'"
                );
              }
            };
            if (this._dynamic.data.data.values[dynamicIndex]?.value) {
              if (
                checkObject(this._dynamic.data.data.values[dynamicIndex].value)
              ) {
                Object.entries(
                  this._dynamic.data.data.values[dynamicIndex].value!
                ).forEach(([property], i) => {
                  if (
                    this.componentData &&
                    this._dynamic.data.data.values[dynamicIndex].value![
                      property
                    ]?.function
                  )
                    createWarning("function is not working in Each component");
                  const value = createArgumentsTemplateFunction(
                    [
                      property,
                      this._dynamic.data.data.values[dynamicIndex].value![
                        property
                      ]
                    ],
                    importData,
                    this.valueName,
                    this.importedDataName
                  );
                  renderTemplate(value, i);
                });
              } else {
                const valueLength =
                  this._dynamic.data.data.values[dynamicIndex].value?.length;
                for (let i = 0; i < valueLength; i++) {
                  if (
                    this.componentData &&
                    this._dynamic.data.data.values[dynamicIndex].value![i]
                      ?.function
                  )
                    createWarning("function is not working in Each component");
                  const value = createArgumentsTemplateFunction(
                    this._dynamic.data.data.values[dynamicIndex].value![i],
                    importData,
                    this.valueName,
                    this.importedDataName
                  );
                  renderTemplate(value, i);
                }
              }
            }

            return [this._dynamic.data.data.values[dynamicIndex], template];
          };
          const renderScriptsAndStyles = (
            e: Element | null,
            start: StartType,
            importData: DataType
          ) => {
            if (typeof this.script !== "undefined") {
              if (Array.isArray(this.script)) {
                if (this.script[1].start === start) {
                  renderScript(this.script, e, this.function, importData, true);
                } else {
                  if (
                    this.script[1].start === undefined &&
                    start === "afterLoad"
                  ) {
                    renderScript(
                      this.script,
                      e,
                      this.function,
                      importData,
                      true
                    );
                  }
                }
              } else {
                if (start === "afterLoad")
                  renderScript(this.script, e, this.function, importData, true);
              }
            }
            if (typeof this.attributes !== "undefined") {
              renderAttributes(e, this.attributes);
            }
          };
          const updateData = (
            id: number,
            importData: DataType,
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
            const dynamicIndex =
              this._dynamic.data.data.values.indexOf(oldData);
            this._dynamic.data.data.values[dynamicIndex].oldValue =
              clonedOldData;
            this._dynamic.data.data.values[dynamicIndex].value =
              data as DynamicDataType;
            this._dynamic.data.data.values[dynamicIndex].importData =
              importData;
          };
          const renderComponentsDynamic = (
            index: number,
            importData: DataType,
            isDataFunction: boolean | undefined
          ) => {
            updateData(index, importData, isDataFunction);
            renderNewData(
              this._dynamic.data.data.values[index]?.oldValue,
              this._dynamic.data.data.values[index]?.value,
              index,
              index,
              importData
            );
            setDynamicNodes("", true);
            try {
              renderDynamicNodes(index, importData);
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
                  condition,
                  importObject,
                  importIndex
                );
                const isDataFunction = this.data && checkFunction(this.data);
                renderComponentsDynamic(index, importData, isDataFunction);
              });
            } else {
              document
                .querySelectorAll(
                  condition
                    ? `template[data-cample=${this.selector}]`
                    : this.selector
                )
                .forEach((e, index) => {
                  const importObject = renderImport(e, this.import);
                  this.importId = renderExportId(e, importId);
                  const importData = renderImportData(e, exportData, condition);
                  const isDataFunction = this.data && checkFunction(this.data);
                  const currentId = this._dynamic.data.data.currentId;
                  const templateData = renderTemplateData(
                    currentId,
                    importData,
                    index,
                    isDataFunction
                  );
                  const data = templateData[0]?.value;
                  const isDataObject = checkObject(data);
                  const templateString = templateData[1];
                  if (templateElement)
                    templateElement.insertAdjacentHTML(
                      "afterbegin",
                      templateString
                    );
                  renderScriptsAndStyles(e, "beforeLoad", importData);
                  const functionsArray: FunctionsArray = [];
                  functionsArray.push(
                    (
                      elements: ElementsType,
                      parentNode: ParentNode,
                      nodePrevious?: DynamicNodeComponentNodeType,
                      nodeNext?: DynamicNodeComponentNodeType
                    ) =>
                      renderEach(
                        elements,
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
                  functionsArray.push((el: Element | null) =>
                    renderScriptsAndStyles(el, "afterLoad", importData)
                  );
                  const template = templateElement
                    ? templateElement.outerHTML
                    : templateString;
                  renderHTML(
                    e,
                    template,
                    this.replaceTag,
                    replaceTags,
                    functionsArray,
                    "each",
                    trim
                  );
                });
            }
          }
        } else {
          createError("templateFunction is function");
        }
      } else {
        createError("Data error");
      }
    } else {
      createError("Property 'selector' is required");
    }
  }
}
