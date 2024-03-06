"use-strict";
import { renderScript } from "../../functions/render/render-script";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  StartType,
  FunctionsArray,
  ExportDataType,
  DataComponentType,
  IdType,
  DataType,
  DataFunctionType,
  ExportIdType,
  ComponentDynamicNodeComponentType,
  ComponentRenderType,
  ExportObjectDataType,
  DataExportObjectType,
  ExportTemplateDataType,
  ImportObjectStringType,
  IndexValuesType,
  DataExportObjectDataType,
  DataIndexesType,
  ImportObjectType,
  DynamicDataType,
  TemplateExportValueType,
  ExportTemplateDataNewType,
  ImportObjectArrayType,
  DataIndexesObjectType,
  ExportTemplateFunctionArrayType,
  FunctionsType
} from "../../../types/types";
import {
  checkFunction,
  concatObjects,
  createError,
  createWarning,
  getData,
  getObjData
} from "../../../shared/utils";
import { renderFunctionsData } from "../../functions/render/render-functions-data";
import { renderHTML } from "../../functions/render/render-html";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderExportId } from "../../functions/render/render-export-id";
import { checkObject } from "../../../shared/utils";
import { renderImport } from "../../functions/render/render-import";
import { DataComponent } from "../data-component/data-component";
import { createComponentDynamicNodeComponentType } from "../../functions/data/create-component-dynamic-node-component";
import { parseTemplate } from "../../functions/parse/parse-template";
import { renderDynamic1 as renderDynamic } from "../../functions/render/render-dynamics";
import {
  renderFn0,
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
import { renderFunction } from "../../functions/render/render-function";
import { renderFunctions } from "../../functions/render/render-functions";
import { renderComponentDynamicKeyData } from "../../functions/data/render-component-dynamic-key-data";

export class Component extends DataComponent {
  public data: DataComponentType;
  public isDataFunction: boolean;

  constructor(
    selector: SelectorType,
    template: string,
    options: ComponentOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.template = template;
    this.data = options.data;
    this.isDataFunction = checkFunction(this.data);
  }

  _getExport(setExportData: any): ExportDataType | undefined {
    this.setExportData = setExportData;
    return this.exportObj;
  }

  render(
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType,
    typeRender: ComponentRenderType = "static"
  ): void {
    const isObjectData = checkObject(this.data);
    if (typeof this.selector !== "undefined" && !isObjectData) {
      const renderDynamicData = (
        importData: DataType | undefined,
        isDataFunction?: boolean,
        oldData?: DataType,
        isDynamic?: boolean
      ) => {
        let data: DataType | undefined =
          isDynamic && oldData !== undefined
            ? { ...oldData }
            : { ...this.data };
        if (isDataFunction) {
          const dataFunction: DataFunctionType = this.data as DataFunctionType;
          data = dataFunction({
            importedData: importData,
            currentData: oldData
          });
        } else {
          if (data) {
            if (importData) {
              data = concatObjects(data, importData);
            }
          } else {
            createWarning("ImportData replacing data");
            data = importData;
          }
        }
        return data;
      };
      const setData = (
        id: number,
        importData: DataType | undefined,
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
      const renderDynamicNodes = () => {
        for (const component of this._dynamic.data.data.components) {
          for (const e of component.nodes) {
            const { dataId, values, nodes, stack } = e;
            const data = getData(this._dynamic.data.data.values, dataId);
            for (const value of values) {
              value(nodes, stack, data, undefined, undefined, value);
            }
          }
        }
      };
      const newFunction = (
        attribute: any,
        key: string,
        id: IdType,
        index: number
      ) => {
        const renderNewFunction = () => {
          try {
            renderDynamicNodes();
          } catch (err) {
            createError("Error: Maximum render");
          }
          renderFunctionsData(
            updateFunction,
            id,
            this.dataFunctions,
            index,
            false
          );
        };
        if (id !== undefined) {
          let data: any = undefined;
          let index = -1;
          for (let i = 0; i < this._dynamic.data.data.values.length; i++) {
            const e = this._dynamic.data.data.values[i];
            if (e?.id === id) {
              data = e;
              index = i;
              break;
            }
          }
          if (data) {
            const dataIndex = this._dynamic.data.data.values[index];
            const val = this._dynamic.data.data.values[index]!.value!;
            if (checkObject(dataIndex) && val[key] !== undefined) {
              val[key] = attribute;
              renderNewFunction();
              const currentComponent = getComponent(index);
              renderDynamicExportData(currentComponent, index);
              const exportData = currentComponent.exportData;
              if (
                this.setExportData !== undefined &&
                exportData !== undefined
              ) {
                for (const [key, value] of Object.entries(exportData)) {
                  this.setExportData(key, value, this.exportId, index);
                }
              }
            }
          }
        } else {
          if (this.data && key && this.data[key]) {
            this.data[key] = attribute;
            renderNewFunction();
          }
        }
      };
      const renderDynamicExportData = (
        currentComponent: ComponentDynamicNodeComponentType,
        index: number
      ) => {
        const { exportObject, dataFunctions: functions } = currentComponent;
        const exportObjectData = exportObject?.data;
        const exportConstructor = exportObject?.constructor;
        const indexesValue = exportObject?.indexesData;
        const newExportData = {};
        if (exportObjectData && exportConstructor) {
          for (const [key] of Object.entries(exportObjectData)) {
            if (exportConstructor?.[key] !== undefined) {
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
          }
        }
        currentComponent.exportData = newExportData;
      };
      const getExportObjectData = (
        obj: ExportTemplateDataType,
        indexesValue: DataIndexesObjectType | undefined,
        index: number,
        functions: FunctionsType
      ) => {
        const renderNewData = (value: string) => {
          // const values = getValues(index);
          const val = renderComponentDynamicKeyData(
            getData(this._dynamic.data.data.values, index),
            value
          );
          return val;
        };
        const newObj: ExportTemplateDataType = {
          data: {},
          functions: {}
        };
        for (const [key, value] of Object.entries(obj)) {
          if (key === "data") {
            for (const [newKey, newValue] of Object.entries(obj.data)) {
              const currentVal = [...newValue];
              newObj.data[newKey] = currentVal;
              for (let i = 0; i < currentVal.length; i++) {
                const val = currentVal[i];
                const isIndex =
                  indexesValue?.["data"][newKey] &&
                  indexesValue["data"][newKey].indexOf(i) > -1;
                newObj["data"][newKey][i] = isIndex
                  ? renderNewData(val as string)
                  : val;
              }
            }
          } else {
            for (const [newKey, newValue] of Object.entries(value)) {
              const currentVal = [
                ...(newValue as ExportTemplateFunctionArrayType)
              ];
              newObj.functions[newKey] = currentVal;
              for (let i = 0; i < currentVal.length; i++) {
                const val = currentVal[i];
                newObj.functions[newKey][i] = renderFunction(functions, val);
              }
            }
          }
        }
        return newObj;
      };
      const renderExportData = (index: number) => {
        const component = getComponent(index);
        const functions = component.dataFunctions;
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
          if (constructor[key] !== undefined) {
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
      };
      const getComponent = (index: number) => {
        const componentArray = this._dynamic.data.data.components.filter(
          (e) => e?.id === index
        );
        return componentArray[0] as ComponentDynamicNodeComponentType;
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
        id: IdType,
        index: number,
        isRender: boolean = false
      ) => {
        const updateData = (attr = getDefaultData(id, key)) => {
          return attr;
        };
        const component = getComponent(index);
        if (component.dataFunctions[name] !== undefined && isRender) {
          createError("Function name is unique");
        } else {
          component.dataFunctions[name] = (attribute: any = updateData) => {
            if (typeof attribute === "function") {
              newFunction(attribute(getDefaultData(id, key)), key, id, index);
            } else {
              newFunction(attribute, key, id, index);
            }
          };
        }
      };
      const renderScriptsAndStyles = (
        e: Element | null,
        start: StartType,
        importData: DataType | undefined,
        index: number
      ) => {
        if (typeof this.script !== "undefined") {
          const component = getComponent(index);
          const oldData = getData(this._dynamic.data.data.values, index, true);
          if (Array.isArray(this.script)) {
            if (this.script[1].start === start) {
              renderScript(
                e,
                oldData,
                this.script,
                component?.dataFunctions,
                importData
              );
            } else {
              if (this.script[1].start === undefined && start === "afterLoad") {
                renderScript(
                  e,
                  oldData,
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
                oldData,
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
        return DynamicNodeComponent;
      };
      const renderImportString = (
        data: ExportTemplateDataNewType | TemplateExportValueType,
        index: number,
        indexValues: IndexValuesType,
        importIndex?: number
      ): string => {
        const importObj: ImportObjectArrayType = {};
        if (data.hasOwnProperty("data")) importObj.data = [];
        if (data.hasOwnProperty("functions")) importObj.functions = [];

        Object.entries(data).forEach(([key, value]) => {
          if (key === "data" || key === "functions") {
            Object.entries(value).forEach(([newKey, _]) => {
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
                importObj[key]?.push(valString);
              } else importObj[key]?.push(newKey);
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
        indexesValue?: object
      ) => {
        const result = obj1;
        Object.entries(result).forEach(([key, value]) => {
          if (key === "data" || key === "functions") {
            Object.entries(value).forEach(([newKey, _]) => {
              const valueIndex = result[key][newKey].length;

              if (obj2[key]?.hasOwnProperty(newKey)) {
                result[key][newKey].push(obj2[key]?.[newKey] as any);
                if (indexesValue) indexesValue[key][newKey] = valueIndex;
              } else {
                result[key][newKey].push(undefined);
                if (indexesValue && key === "data")
                  indexesValue[key][newKey] = [valueIndex];
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
      const getEventsData = (key: string, dataId: number) => {
        const currentData = getData(this._dynamic.data.data.values, dataId);
        const val = renderComponentDynamicKeyData(currentData, key);
        return val;
      };
      const updateData = (
        id: number,
        importData: DataType | undefined,
        isDataFunction?: boolean
      ) => {
        const { data: oldData, index: dynamicIndex } = getObjData(
          this._dynamic.data.data.values,
          id,
          false
        );
        const data = renderDynamicData(
          importData,
          isDataFunction,
          (oldData as DynamicDataType)?.value,
          true
        );
        // if (!oldData) createError("Render error");
        this._dynamic.data.data.values[dynamicIndex as number].value =
          data as DynamicDataType;
      };
      const getEventsFunction = (
        key: string,
        dataId: number,
        _: string | undefined,
        functions?: FunctionsType
      ) => {
        const getEventData = () => {
          const currentData = getData(this._dynamic.data.data.values, dataId);
          const val = renderComponentDynamicKeyData(currentData, key);
          return val;
        };
        if (functions && Object.keys(functions).length) {
          if (key in functions) {
            return functions[key];
          } else {
            return getEventData();
          }
        } else {
          return getEventData();
        }
      };
      const renderComponentsDynamic = (
        index: number,
        importData: DataType | undefined,
        isDataFunction: boolean | undefined
      ) => {
        updateData(index, importData, isDataFunction);
        try {
          renderDynamicNodes();
        } catch (err) {
          createError(`${err}`);
        }
      };
      const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
      if (typeRender === "dynamic") {
        const components = this._dynamic.data.data.components;
        for (const component of components) {
          const index = component.id;
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
          renderComponentsDynamic(index, importData, this.isDataFunction);
        }
      } else {
        document
          .querySelectorAll(`template[data-cample=${this.selector}]`)
          .forEach((e, index) => {
            const importObject = renderImport(e, this.import);
            this.importId = renderExportId(e, importId);
            const importData = renderImportData(e, exportData);
            renderScriptsAndStyles(e, "beforeLoad", importData, index);
            const functionsArray: FunctionsArray = [];
            functionsArray.push((el: Element | null) =>
              renderScriptsAndStyles(el, "afterLoad", importData, index)
            );
            const currentId = this._dynamic.data.data.currentId;
            const data = setData(
              currentId,
              importData,
              this.isDataFunction
            )?.value;
            const setDataFunctions = () =>
              renderFunctionsData(
                updateFunction,
                this._dynamic.data.data.currentId,
                this.dataFunctions,
                index,
                true
              );
            const currentComponent: ComponentDynamicNodeComponentType =
              setDynamicNodeComponentType(index, importObject);
            const runRenderFunction = () =>
              renderFunctions(
                currentComponent.functions,
                currentComponent.dataFunctions,
                this.functions
              );
            const { obj: newTemplateObj } = parseTemplate(
              renderDynamic,
              [
                renderFn1,
                renderFn2,
                renderFn3,
                renderFn0,
                renderFn5,
                renderFn6,
                renderFn7,
                renderFn8,
                renderFn9,
                renderFn10,
                renderFn11,
                renderFn12
              ],
              this.template as string,
              index,
              currentId,
              this.values,
              trim,
              getEventsData,
              getEventsFunction,
              setDataFunctions,
              runRenderFunction,
              currentComponent.functions
            );
            // if (!newTemplateObj.values.some((e) => e.type === 3)) {
            //   if (this.export) {
            //     createExportObject(index);
            //   }
            // }
            const exportFunctions = {
              getExportObject,
              renderExportObject,
              createExportObject,
              renderIndexesValue,
              renderImportString
            };
            const { el, currentNode } = createElement(
              data,
              index,
              currentId,
              newTemplateObj,
              undefined,
              undefined,
              undefined,
              exportFunctions,
              this.export
            );
            if (currentNode) currentComponent.nodes.push(currentNode);
            if (el) {
              currentComponent.exportObject = getExportObject(currentId);
              this._dynamic.data.data.currentId += 1;
            } else {
              renderFunctionsData(
                updateFunction,
                undefined,
                this.dataFunctions,
                index,
                true
              );
            }
            renderHTML(e, el, functionsArray, "component");
            renderExportData(index);
          });
      }
    } else {
      if (isObjectData) {
        createError("Data error");
      } else {
        createError("Property 'selector' is required");
      }
    }
  }
}
