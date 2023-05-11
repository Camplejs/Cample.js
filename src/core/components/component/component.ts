"use-strict";
import { renderScript } from "../../functions/render/render-script";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  NodeType,
  DynamicTextType,
  StartType,
  FunctionsArray,
  ExportDataType,
  DataComponentType,
  IdType,
  DataType,
  DataFunctionType,
  ExportIdType,
  DynamicKeyObjectArrayType,
  DynamicKeyObjectType,
  ScriptElementsType,
  ComponentDynamicNodeComponentType,
  ComponentRenderType,
  ExportObjectDataType,
  DataExportObjectType,
  ExportTemplateDataType,
  ImportObjectStringType,
  IndexValuesType,
  DataExportObjectDataType,
  ArrayStringType,
  DataIndexesType,
  ImportObjectType,
  DynamicDataType,
  TemplateExportValueType,
  ExportDataValuesValueType,
  ExportTemplateDataNewType,
  ImportObjectArrayType,
  DataIndexesObjectType,
  ExportTemplateFunctionArrayType,
  FunctionsType,
  ExportTemplateFunctionsValueType,
  EventKeyObjectArrayType,
  ValuesArguments
} from "../../../types/types";
import {
  checkFunction,
  cloneObject,
  concatArrays,
  concatObjects,
  createError,
  createWarning,
  filterDuplicate,
  filterKey,
  getDynamicElements,
  getEventAttrs,
  getKeys
} from "../../../shared/utils";
import { renderFunctionsData } from "../../functions/render/render-functions-data";
import { renderHTML } from "../../functions/render/render-html";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderExportId } from "../../functions/render/render-export-id";
import { checkObject } from "../../../shared/utils";
import { renderImport } from "../../functions/render/render-import";
import { DataComponent } from "../data-component/data-component";
import { createNode } from "../../functions/data/create-node";
import { renderKey } from "../../functions/render/render-key";
import { renderElements } from "../../functions/render/render-elements";
import { createComponentDynamicNodeComponentType } from "../../functions/data/create-component-dynamic-node-component";
import { renderData } from "../../functions/render/render-data";
import { renderEventKey } from "../../functions/render/render-event-key";
import { renderStaticExport } from "../../functions/data/render-static-export";
import { renderDynamicKey } from "../../functions/render/render-dynamic-key";

export class Component extends DataComponent {
  public data: DataComponentType;

  constructor(
    selector: SelectorType,
    template: string,
    options: ComponentOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.template = template;
    this.data = options.data;
  }

  _getExport(setExportData: any): ExportDataType | undefined {
    this.setExportData = setExportData;
    return this.isExportStatic
      ? renderStaticExport(this.export)
      : this.exportObj;
  }

  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType,
    typeRender: ComponentRenderType = "static"
  ): void {
    if (typeof this.selector !== "undefined") {
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
      const getData = (dataId: number, isValue = true) => {
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
      const cloneExportObject = (obj1: ExportTemplateDataType) => {
        const newObj: ExportTemplateDataType = {
          data: {},
          functions: {}
        };
        Object.entries(obj1).forEach(([key, value]) => {
          if (key === "data") {
            newObj.data = cloneObject(obj1.data);
          } else {
            Object.entries(value).forEach(([newKey, newValue]) => {
              newObj.functions[newKey] = [
                ...(newValue as ExportTemplateFunctionArrayType)
              ];
            });
          }
        });
        return newObj;
      };
      const renderDynamicData = (
        importData: DataType,
        isDataFunction?: boolean,
        oldData?: DataType,
        isDynamic?: boolean
      ) => {
        let data = isDynamic && oldData ? { ...oldData } : { ...this.data };
        if (isDataFunction) {
          const dataFunction: DataFunctionType = this.data as DataFunctionType;
          data = dataFunction({ data: importData, currentData: oldData });
        } else {
          if (data) {
            data = concatObjects(data, importData);
          } else {
            createWarning("ImportData replacing data");
            data = importData;
          }
        }
        return data;
      };
      const setData = (
        id: number,
        importData: DataType,
        isDataFunction?: boolean
      ) => {
        const data = renderDynamicData(importData, isDataFunction);
        const dynamicData = {
          value: data,
          id
        };
        const dynamicIndex = this._dynamic.data.data.values.length;
        this._dynamic.data.data.values.push(dynamicData);
        return this._dynamic.data.data.values[dynamicIndex];
      };
      const renderDynamicNodes = (key: string, index: number) => {
        this._dynamic.dynamicNodes.forEach((e, i) => {
          const values = getValues(e.dataId);
          const dataArray = renderDynamicKey(
            getData(e.dataId),
            index,
            key,
            values
          );
          const val = dataArray[0];
          const isProperty = dataArray[1];
          const filtredValues = filterKey(e.dynamicTexts, key);
          filtredValues.forEach((filtredVal: DynamicTextType) => {
            const index = e.dynamicTexts.indexOf(filtredVal);
            this._dynamic.dynamicNodes[i].dynamicTexts[index] = e.updateText(
              val,
              filtredVal,
              e.texts,
              isProperty
            );
            this._dynamic.dynamicNodes[i].texts = filterDuplicate(
              concatArrays(
                this._dynamic.dynamicNodes[i].texts,
                this._dynamic.dynamicNodes[i].dynamicTexts[index].texts
              )
            );
            this._dynamic.dynamicNodes[i].texts = this._dynamic.dynamicNodes[
              i
            ].texts.filter((text) => {
              if (text) {
                return text;
              }
            });
          });
          if (Object.keys(e.attrs).length) {
            this._dynamic.dynamicNodes[i].attrs = e.updateAttr(
              val,
              key,
              isProperty
            );
          }
        });
        this._dynamic.dynamicNodes = [];
      };
      const setNode = (
        el: Element,
        index: number,
        data: DataComponentType,
        id: number
      ) => {
        const node = createNode(el, index, getEventsData, data, id, false);
        this._dynamic.data.nodes.push(node);
      };
      const getEventsData = (key: string, dataId: number, index: number) => {
        const values = getValues(dataId);
        const dataArray = renderDynamicKey(getData(dataId), index, key, values);
        return dataArray[0];
      };
      const getValues = (dataId: number) => {
        if (this.values) {
          if (checkFunction(this.values)) {
            const valuesArguments: ValuesArguments = {
              data: getData(dataId)
            };
            const values = this.values(valuesArguments);
            return values;
          } else createError("Values error");
        } else return undefined;
      };
      const render = (index: number, isFirst = true) => {
        setDynamicNodes("", true);
        for (let i = 0; i < this._dynamic.dynamicNodes.length; i++) {
          this._dynamic.dynamicNodes[i].dynamicTexts.forEach((val, j) => {
            const values = getValues(this._dynamic.dynamicNodes[i].dataId);
            const dataArray = renderDynamicKey(
              getData(this._dynamic.dynamicNodes[i].dataId),
              index,
              val.key,
              values
            );
            const newData = dataArray[0];
            const isProperty = dataArray[1];
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
            this._dynamic.dynamicNodes[i].texts = this._dynamic.dynamicNodes[
              i
            ].texts.filter((text) => {
              if (text) {
                return text;
              }
            });
          });
          if (Object.keys(this._dynamic.dynamicNodes[i].attrs).length) {
            this._dynamic.dynamicNodes[i].dynamicAttrs.forEach((keyAttr) => {
              const values = getValues(this._dynamic.dynamicNodes[i].dataId);
              const dataArray = renderDynamicKey(
                getData(this._dynamic.dynamicNodes[i].dataId),
                index,
                keyAttr,
                values
              );
              const newData = dataArray[0];
              const isProperty = dataArray[1];
              this._dynamic.dynamicNodes[i].attrs = this._dynamic.dynamicNodes[
                i
              ].updateAttr(newData, keyAttr, isProperty);
            });
          }
          if (Object.keys(this._dynamic.dynamicNodes[i].listeners).length) {
            Object.entries(this._dynamic.dynamicNodes[i].listeners).forEach(
              ([key, value]) => {
                const newArgs = [...value.value.arguments];
                this._dynamic.dynamicNodes[i].updateListeners(
                  value.fn,
                  newArgs,
                  key,
                  isFirst
                );
              }
            );
          }
        }
        this._dynamic.dynamicNodes = [];
      };
      const newFunction = (
        attribute: any,
        key: string,
        id: IdType,
        index: number,
        keys: DynamicKeyObjectArrayType
      ) => {
        const renderNewFunction = (data: DataType, currentKey: string) => {
          setDynamicNodes(currentKey);
          try {
            renderDynamicNodes(currentKey, index);
          } catch (err) {
            this._dynamic.dynamicNodes = [];
            createError("Error: Maximum render");
          }
          renderFunctionsData(data, updateFunction, false, id, index, keys);
        };
        if (id !== undefined) {
          const data = this._dynamic.data.data.values.filter(
            (e) => e?.id === id
          );
          if (data.length > 1) {
            createError("Error: id is unique");
          }
          if (data && data[0]) {
            const index = this._dynamic.data.data.values.indexOf(data[0]);
            if (index > -1) {
              const dataIndex = this._dynamic.data.data.values[index];
              if (
                checkObject(dataIndex) &&
                this._dynamic.data.data.values[index]!.value![key]
              ) {
                this._dynamic.data.data.values[index]!.value![key] = attribute;
                renderNewFunction(
                  this._dynamic.data.data.values[index]!.value!,
                  key
                );
                keys.forEach((currentKey) => {
                  const joinedKey = `${
                    currentKey.key
                  }.${currentKey.properties.join(".")}`;
                  renderNewFunction(
                    this._dynamic.data.data.values[index]!.value!,
                    joinedKey
                  );
                });
                if (!this.isExportStatic) {
                  renderDynamicExportData(index);
                  const exportData = getComponent(index).exportData;
                  if (this.setExportData && exportData) {
                    Object.entries(exportData).forEach(([key, value]) => {
                      if (this.setExportData) {
                        this.setExportData(key, value, this.exportId, index);
                      }
                    });
                  }
                }
              }
            }
          }
        } else {
          if (this.data && key && this.data[key]) {
            this.data[key] = attribute;
            renderNewFunction(this.data, key);
          }
        }
      };
      const renderDynamicExportData = (index: number) => {
        const component = getComponent(index);
        const exportObject = component.exportObject;
        const functions = component.functions;
        const exportObjectData = exportObject?.data;
        const exportConstructor = exportObject?.constructor;
        const indexesValue = exportObject?.indexesData;
        const newExportData = {};
        if (exportObjectData && exportConstructor) {
          Object.entries(exportObjectData).forEach(([key, value]) => {
            if (exportConstructor?.hasOwnProperty(key)) {
              const newExportObject = getExportObjectData(
                { ...exportConstructor[key] },
                indexesValue?.[key],
                index,
                functions
              );
              newExportData[key] = newExportObject;
            } else {
              createError("Export data render error");
            }
          });
        }
        component.exportData = newExportData;
      };
      const getExportObjectData = (
        obj: ExportTemplateDataType,
        indexesValue: DataIndexesObjectType | undefined,
        index: number,
        functions: FunctionsType
      ) => {
        const newObjectData = cloneExportObject(obj);
        const renderNewData = (value: string) => {
          const values = getValues(index);
          const dataArray = renderDynamicKey(
            getData(index),
            index,
            value,
            values
          );
          const newData = dataArray[0];
          const isProperty = dataArray[1];
          return isProperty ? newData : renderData(newData, index);
        };
        Object.entries(newObjectData).forEach(([key, value]) => {
          if (key === "data" || key === "functions") {
            Object.entries(value).forEach(([newKey, newValue]) => {
              if (Array.isArray(newValue)) {
                newValue.forEach((val, i) => {
                  if (key === "data") {
                    const isIndex =
                      indexesValue?.[key][newKey] &&
                      indexesValue?.[key][newKey].indexOf(i) !== -1;
                    newObjectData[key][newKey][i] = isIndex
                      ? renderNewData(val)
                      : val;
                  } else {
                    if (val.length === 2) {
                      const functionName = val[1];
                      if (functions.hasOwnProperty(functionName)) {
                        const func = functions[functionName];
                        const exportFunc = val[0];
                        const funcUser = exportFunc.bind(this, func);
                        newObjectData[key][newKey][i] = funcUser;
                      } else createError(`Function ${functionName} not found`);
                    } else createError("Data error");
                  }
                });
              } else {
                createError("Data error");
              }
            });
          }
        });
        return newObjectData;
      };
      const renderExportData = (index: number) => {
        if (!this.isExportStatic) {
          const component = getComponent(index);
          const functions = component.functions;
          const exportObject = component.exportObject;
          const indexesValue = exportObject?.indexesData;
          let exportObj: ExportDataType | undefined;
          let constructor: DataExportObjectDataType | undefined = {};
          const concatObjectsNew = (
            obj1: ExportTemplateDataType,
            obj2: object
          ) => {
            const result: ExportTemplateDataType = obj1;
            Object.entries(obj2).forEach(([key, value]) => {
              if (!result.data.hasOwnProperty(key)) {
                result.data[key] = value;
              }
            });
            return result;
          };
          const renderConstructor = (
            data: ExportTemplateDataType,
            key: string
          ) => {
            constructor = constructor as DataExportObjectDataType;
            const newData: ExportTemplateDataType = {
              data: {},
              functions: {}
            };
            Object.entries(data).forEach(([key, value]) => {
              if (key === "data" || key === "functions") {
                Object.entries(value).forEach(([newKey, newValue]) => {
                  newData[key][newKey] = [...newValue];
                });
              }
            });
            if (constructor.hasOwnProperty(key)) {
              constructor[key] = newData;
            } else {
              constructor[key] = {
                data: {},
                functions: {}
              };
            }
            constructor[key] = newData;
          };
          const exporting = this.export?.data;
          if (exporting && !exportObject) {
            const newExportData = exporting;
            Object.entries(newExportData).forEach(([key, value]) => {
              Object.entries(value).forEach(([newKey, newValue]) => {
                newExportData[key][newKey] = [newValue];
              });
            });
            exportObj = newExportData as ExportDataType;
          } else if (!exporting && exportObject) {
            const newExportData = exportObject.data;
            if (newExportData) {
              Object.entries(newExportData).forEach(([key, value]) => {
                renderConstructor({ ...value }, key);
                newExportData[key] = getExportObjectData(
                  { ...value },
                  indexesValue?.[key],
                  index,
                  functions
                ) as ExportTemplateDataType;
              });
              exportObj = newExportData as ExportDataType;
            } else exportObj = undefined;
          } else if (exporting && exportObject) {
            const newExportData = exporting;
            Object.entries(newExportData).forEach(([key, value]) => {
              if (exportObject!.data[key]) {
                renderConstructor(exportObject!.data[key], key);
                newExportData[key] = concatObjectsNew(
                  getExportObjectData(
                    { ...exportObject!.data[key] },
                    indexesValue?.[key],
                    index,
                    functions
                  ),
                  value
                );
              }
            });
            if (exportObject.data) {
              Object.entries(exportObject.data).forEach(([key, value]) => {
                if (!newExportData.hasOwnProperty(key)) {
                  renderConstructor({ ...value }, key);
                  newExportData[key] = getExportObjectData(
                    { ...value },
                    indexesValue?.[key],
                    index,
                    functions
                  );
                }
              });
            }
            exportObj = newExportData as ExportDataType;
          } else {
            constructor = undefined;
            exportObj = undefined;
          }
          getComponent(index).exportData = exportObj;
          if (exportObject && constructor) {
            exportObject.constructor = constructor;
          }
          if (exportObj) {
            if (index === 0) {
              const newExportObj: DataExportObjectType = {};
              Object.entries(exportObj).forEach(([key, value]) => {
                newExportObj[key] = [value];
              });
              this.exportObj = newExportObj;
            } else {
              if (this.exportObj) {
                Object.entries(exportObj).forEach(([key, value]) => {
                  if (this.exportObj && this.exportObj.hasOwnProperty(key)) {
                    this.exportObj[key].push(value);
                  }
                });
              }
            }
          } else {
            this.exportObj = exportObj;
          }
        }
      };
      const getComponent = (index: number) => {
        const componentArray = this._dynamic.data.data.components.filter(
          (e) => e?.id === index
        );
        if (componentArray.length > 1) {
          createError("id is unique");
        }
        const componentIndex = this._dynamic.data.data.components.indexOf(
          componentArray[0]
        );
        return this._dynamic.data.data.components[
          componentIndex
        ] as ComponentDynamicNodeComponentType;
      };
      const getDefaultData = (id: IdType, key: string) => {
        const data = this._dynamic.data.data.values.filter((e) => e?.id === id);
        if (data.length > 1) {
          createError("id is unique");
        }
        const defaultData =
          id !== undefined
            ? data && data[0] && data[0].value
              ? data[0].value[key]
              : undefined
            : this.data && this.data[key]
            ? this.data[key]
            : undefined;
        return defaultData;
      };
      const updateFunction = (
        name: string,
        key: string,
        isRender = false,
        id: IdType,
        index: number,
        keys: DynamicKeyObjectArrayType
      ) => {
        const updateData = (attr = getDefaultData(id, key)) => {
          return attr;
        };
        const component = getComponent(index);
        if (component.functions.hasOwnProperty(name) && isRender) {
          createError("Function name is unique");
        } else {
          component.functions[name] = (attribute: any = updateData) => {
            if (typeof attribute === "function") {
              newFunction(
                attribute(getDefaultData(id, key)),
                key,
                id,
                index,
                keys
              );
            } else {
              newFunction(attribute, key, id, index, keys);
            }
          };
        }
      };
      const renderScriptsAndStyles = (
        e: Element | null,
        start: StartType,
        importData: DataType,
        index: number,
        elements?: ScriptElementsType
      ) => {
        if (typeof this.script !== "undefined") {
          const component = getComponent(index);
          if (Array.isArray(this.script)) {
            if (this.script[1].start === start) {
              renderScript(
                this.script,
                e,
                component?.functions,
                importData,
                false,
                condition,
                elements
              );
            } else {
              if (this.script[1].start === undefined && start === "afterLoad") {
                renderScript(
                  this.script,
                  e,
                  component?.functions,
                  importData,
                  false,
                  condition,
                  elements
                );
              }
            }
          } else {
            if (start === "afterLoad")
              renderScript(
                this.script,
                e,
                component?.functions,
                importData,
                false,
                condition,
                elements
              );
          }
        }
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
      };
      const getExportObject = (dataId: number) => {
        if (
          this.exportDataObjects.length > 0 &&
          this.exportDataObjects[dataId]
        ) {
          return this.exportDataObjects[dataId];
        } else return undefined;
      };
      const setDynamicNodeComponentType = (
        dataId: number,
        importObject: ImportObjectType | undefined
      ) => {
        const DynamicNodeComponent = createComponentDynamicNodeComponentType(
          dataId,
          getExportObject(dataId),
          importObject
        );
        this._dynamic.data.data.components.push(DynamicNodeComponent);
      };
      const renderImportString = (
        data: ExportTemplateDataNewType | TemplateExportValueType,
        index: number,
        indexValues: IndexValuesType,
        importIndex?: number
      ): string => {
        const importObj: ImportObjectArrayType = {
          data: [],
          functions: []
        };
        Object.entries(data).forEach(([key, value]) => {
          if (key === "data" || key === "functions") {
            Object.entries(value).forEach(([newKey, newValue]) => {
              if (
                indexValues &&
                indexValues[key] &&
                indexValues[key].hasOwnProperty(newKey) &&
                indexValues[key][newKey]
              ) {
                const valString = JSON.stringify([
                  newKey,
                  Array.isArray(indexValues[key][newKey])
                    ? indexValues[key][newKey][0]
                    : indexValues[key][newKey]
                ]);
                importObj[key].push(valString);
              } else importObj[key].push(newKey);
            });
          }
        });
        const newObj = {};
        Object.entries(importObj).forEach(([key, value]) => {
          newObj[key] = value.join(";");
        });
        const importString = JSON.stringify(newObj);
        const importStringObject: ImportObjectStringType = {
          import: importString,
          exportId: this.exportId,
          index,
          importIndex
        };
        return JSON.stringify(importStringObject);
      };
      const concatExportObjects = (
        obj1: ExportTemplateDataType,
        obj2: ExportTemplateDataType | TemplateExportValueType,
        componentName: string,
        indexesValue?: object
      ) => {
        const result = obj1;
        Object.entries(result).forEach(([key, value]) => {
          if (key === "data" || key === "functions") {
            Object.entries(value).forEach(([newKey, newValue]) => {
              const valueIndex = result[key][newKey].length;
              if (obj2[key]?.hasOwnProperty(newKey)) {
                result[key][newKey].push(obj2[key]?.[newKey] as any);
                if (indexesValue) indexesValue[key][newKey] = valueIndex;
              } else {
                if (
                  this.export &&
                  this.export.data &&
                  this.export.data[componentName]
                ) {
                  result[key][newKey].push(
                    this.export.data[componentName][newKey]
                  );
                  if (indexesValue && key === "data")
                    indexesValue[key][newKey] = [valueIndex];
                } else {
                  result[key][newKey].push(undefined);
                  if (indexesValue && key === "data")
                    indexesValue[key][newKey] = [valueIndex];
                }
              }
            });
          } else
            createError("Template data contains data or functions properties");
        });
        Object.entries(obj2).forEach(([key, value]) => {
          if (key === "data" || key === "functions") {
            Object.entries(value).forEach(([newKey, newValue]) => {
              if (!result[key].hasOwnProperty(newKey)) {
                result[key][newKey] = [newValue as any];
                if (indexesValue) indexesValue[key][newKey] = 0;
              }
            });
          } else
            createError("Template data contains data or functions properties");
        });
        return result;
      };
      const renderExportObject = (
        componentName: string,
        currentData: DataExportObjectDataType,
        newData: ExportTemplateDataType | TemplateExportValueType,
        indexesValue: object
      ) => {
        if (currentData.hasOwnProperty(componentName)) {
          const newExportObject = currentData;
          newExportObject[componentName] = concatExportObjects(
            currentData[componentName],
            newData,
            componentName,
            indexesValue
          ) as ExportTemplateDataType;
          return newExportObject;
        } else {
          const newExportObject = currentData;
          newExportObject[componentName] = {
            data: {},
            functions: {}
          };
          Object.entries(newData).forEach(([key, value]) => {
            if (key === "data" || key === "functions") {
              Object.entries(value).forEach(([newKey, newValue]) => {
                newExportObject[componentName][key][newKey] = [
                  newValue as string
                ];
                indexesValue[key][newKey] = 0;
              });
            } else
              createError(
                "Template data contains data or functions properties"
              );
          });
          return newExportObject;
        }
      };
      const concatImportObject = (
        obj1: TemplateExportValueType,
        obj2: ExportDataValuesValueType | undefined
      ) => {
        const result = obj1;
        if (obj2) {
          Object.entries(obj2).forEach(([key, value]) => {
            if (result && result.data) {
              if (!result.data.hasOwnProperty(key)) {
                result.data[key] = value;
              }
            } else {
              result.data = {};
              result.data[key] = value;
            }
          });
        }
        return result;
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
      const renderIndexesValue = (
        oldIndexesData: DataIndexesType,
        componentName: string,
        indexesValue: IndexValuesType
      ): DataIndexesType => {
        const result = oldIndexesData;
        if (result.hasOwnProperty(componentName)) {
          Object.entries(indexesValue).forEach(([key, value]) => {
            if (key === "data" || key === "functions") {
              Object.entries(value).forEach(([newKey, newValue]) => {
                if (result[componentName][key][newKey]) {
                  result[componentName][key][newKey].push(newValue);
                } else {
                  result[componentName][key][newKey] = [newValue];
                }
              });
            } else
              createError(
                "Template data contains data or functions properties"
              );
          });
        } else {
          result[componentName] = {
            data: {},
            functions: {}
          };
          Object.entries(indexesValue).forEach(([key, value]) => {
            if (key === "data" || key === "functions") {
              Object.entries(value).forEach(([newKey, newValue]) => {
                result[componentName][key][newKey] = [newValue];
              });
            } else
              createError(
                "Template data contains data or functions properties"
              );
          });
        }
        return result;
      };
      const createExportObject = (
        index: number,
        componentName?: string,
        currentData?: TemplateExportValueType,
        indexesValue?: IndexValuesType
      ) => {
        let data: DataExportObjectDataType = {};
        let indexesData: DataIndexesType = {};
        if (this.export && this.export.data) {
          Object.entries(this.export.data).forEach(([key, value]) => {
            const newDataKey = {};
            Object.entries(value).forEach(([key]) => {
              newDataKey[key] = [];
            });
            const dataValue = {
              data: newDataKey,
              functions: {}
            };
            data[key] = dataValue;
          });
        }
        if (componentName && currentData && indexesValue) {
          const newExportObject = renderExportObject(
            componentName,
            { ...data },
            currentData,
            indexesValue
          );
          data = newExportObject;
          indexesData = renderIndexesValue(
            indexesData,
            componentName,
            indexesValue
          );
        }
        const exportObject: ExportObjectDataType = {
          data,
          index,
          indexesData,
          constructor: {}
        };
        this.exportDataObjects.push(exportObject);
      };
      const cloneTemplate = (obj1: TemplateExportValueType) => {
        const newObj: TemplateExportValueType = {};
        Object.entries(obj1).forEach(([key, value]) => {
          if (key === "data") {
            if (!newObj.data) {
              newObj.data = {};
            }
            newObj.data = cloneObject(obj1.data as object);
          } else if (key === "functions") {
            if (!newObj.functions) {
              newObj.functions = {};
            }
            Object.entries(value).forEach(([newKey, newValue]) => {
              newObj.functions![newKey] = [
                ...(newValue as ExportTemplateFunctionsValueType)
              ];
            });
          } else
            createError("Template data contains data or functions properties");
        });
        return newObj;
      };
      const renderComponentTemplate = (
        valueExport: string,
        index: number,
        componentName: string
      ) => {
        if (this.export && this.export.template) {
          const template: TemplateExportValueType = cloneTemplate(
            this.export.template[valueExport]
          );
          const currentExportObject = getExportObject(index);
          const indexesValue: IndexValuesType = {
            data: {},
            functions: {}
          };
          let importIndex: number | undefined = undefined;

          if (currentExportObject) {
            const newExportObject = renderExportObject(
              componentName,
              currentExportObject.data,
              template,
              indexesValue
            );
            const exportObject = getExportObject(index);
            exportObject!.data = newExportObject;
            importIndex = exportObject?.index;
          } else {
            createExportObject(index, componentName, template, indexesValue);
            importIndex = index;
          }
          if (currentExportObject) {
            const oldIndexesData = currentExportObject.indexesData;
            const indexesData = renderIndexesValue(
              oldIndexesData,
              componentName,
              indexesValue
            );
            currentExportObject.indexesData = indexesData;
          }
          const importObject = concatImportObject(
            { ...template },
            this.export.data?.[componentName]
          );

          const importString = renderImportString(
            importObject,
            index,
            indexesValue,
            importIndex
          );
          return importString;
        } else {
          createError("TemplateExport is required");
        }
      };
      const renderDynamicArray = (
        e: Element | null,
        index: number,
        importData: DataType,
        importObject: ImportObjectType | undefined,
        isDataFunction?: boolean
      ) => {
        const currentId = this._dynamic.data.data.currentId;
        const data = setData(currentId, importData, isDataFunction)?.value;
        if (e) {
          if (this.export && !this.isExportStatic) {
            const exportDynamicArray = getDynamicElements(e, true);
            if (exportDynamicArray.length) {
              exportDynamicArray.forEach((e) => {
                const importAttr = e.getAttribute("data-cample-import");
                const componentName = condition
                  ? e.getAttribute("data-cample")
                  : e.nodeName;
                const newImportAttr = importAttr?.replace(/\s+/g, "");
                const keyImportString = newImportAttr?.replace(
                  /\{{{(.*?)}}}/g,
                  (str, d) => {
                    const key: string = d.trim();
                    if (key) return key;
                    return str;
                  }
                );
                if (keyImportString && componentName) {
                  const newImportString = renderComponentTemplate(
                    keyImportString,
                    index,
                    componentName
                  );
                  renderImport(e, undefined, newImportString);
                } else {
                  createError("Render export error");
                }
              });
            } else {
              createExportObject(index);
            }
            const currentExportObject = getExportObject(index);
            if (currentExportObject && currentExportObject.data) {
              const exportData = this.export.data;
              if (exportData) {
                Object.entries(exportData).forEach(([key, value]) => {
                  if (currentExportObject.data.hasOwnProperty(key)) {
                    Object.entries(value).forEach(([newKey, newVal]) => {
                      if (
                        Array.isArray(
                          currentExportObject.data[key].data[newKey]
                        )
                      ) {
                        if (
                          !currentExportObject.data[key].data[newKey].length
                        ) {
                          (
                            currentExportObject.data[key].data[
                              newKey
                            ] as ArrayStringType
                          ).push(newVal as string);
                        }
                      } else {
                        createError("Export render error");
                      }
                    });
                  }
                });
              }
            } else {
              createError("Export error");
            }
          }
          const dynamicArray = getDynamicElements(e);
          const keys: DynamicKeyObjectArrayType = [];
          const eventKeys: EventKeyObjectArrayType = [];
          if (dynamicArray.length) {
            dynamicArray.forEach((el) => {
              const arrKeys = getKeys(el);
              const dynamicKeys = arrKeys[0];
              const currentEventKeys = arrKeys[1];
              dynamicKeys.forEach((key) => {
                const renderedKey = renderKey(key);
                if (renderedKey) {
                  keys.push(renderedKey as DynamicKeyObjectType);
                }
              });
              currentEventKeys.forEach((key) => {
                const renderedKey = renderEventKey(key);
                if (renderedKey) {
                  eventKeys.push(renderedKey);
                }
              });
            });
            const filtredKeys = filterDuplicate(keys);
            setDynamicNodeComponentType(index, importObject);
            renderFunctionsData(
              data,
              updateFunction,
              true,
              this._dynamic.data.data.currentId,
              index,
              filtredKeys
            );
            dynamicArray.forEach((el) => {
              setNode(el, index, data, currentId);
              const currentEventProperties = getEventAttrs(el);
              if (currentEventProperties.length)
                unrenderEvents(el, currentEventProperties);
            });
            try {
              render(index);
            } catch (err) {
              createError(`${err}`);
            }
          } else {
            setDynamicNodeComponentType(index, importObject);
            renderFunctionsData(
              data,
              updateFunction,
              true,
              this._dynamic.data.data.currentId,
              index,
              []
            );
          }
          this._dynamic.data.data.currentId += 1;
        } else {
          renderFunctionsData(data, updateFunction, true, undefined, index, []);
        }
      };
      const updateData = (
        id: number,
        importData: DataType,
        isDataFunction?: boolean
      ) => {
        const oldData = getData(id, false);
        const data = renderDynamicData(
          importData,
          isDataFunction,
          (oldData as DynamicDataType)?.value,
          true
        );
        if (!oldData) createError("Render error");
        const dynamicIndex = this._dynamic.data.data.values.indexOf(
          oldData as DynamicDataType
        );
        this._dynamic.data.data.values[dynamicIndex].value =
          data as DynamicDataType;
      };
      const renderComponentsDynamic = (
        index: number,
        importData: DataType,
        isDataFunction: boolean | undefined
      ) => {
        updateData(index, importData, isDataFunction);

        try {
          render(index, false);
        } catch (err) {
          createError(`${err}`);
        }
      };
      const condition =
        (replaceTags && this.replaceTag === undefined) || this.replaceTag;
      const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
      if (typeRender === "dynamic") {
        const components = this._dynamic.data.data.components;
        components.forEach((component) => {
          const index = component.id;
          if (index === undefined) createError("Index error");
          component = component as ComponentDynamicNodeComponentType;
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
            condition ? `template[data-cample=${this.selector}]` : this.selector
          )
          .forEach((e, index) => {
            const importObject = renderImport(e, this.import);
            this.importId = renderExportId(e, importId);
            const importData = renderImportData(e, exportData, condition);
            const isDataFunction = this.data && checkFunction(this.data);
            renderScriptsAndStyles(e, "beforeLoad", importData, index);
            const functionsArray: FunctionsArray = [];
            const scriptOptionElements = renderElements(this.script);
            functionsArray.push((el: Element | null) =>
              renderDynamicArray(
                el,
                index,
                importData,
                importObject,
                isDataFunction
              )
            );
            functionsArray.push(
              (el: Element | null, elements?: ScriptElementsType) =>
                renderScriptsAndStyles(
                  el,
                  "afterLoad",
                  importData,
                  index,
                  elements
                )
            );
            renderHTML(
              e,
              this.template,
              this.replaceTag,
              replaceTags,
              functionsArray,
              "component",
              trim,
              scriptOptionElements
            );
            renderExportData(index);
          });
      }
    } else {
      createError("Property 'selector' is required");
    }
  }
}
