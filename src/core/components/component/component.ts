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
  ScriptElementsType,
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
  FunctionsType,
  ExportTemplateFunctionsValueType,
  ValuesTemplateType,
  EachTemplateType,
  DynamicDataValueType,
  NodeValuesType,
  CurrentKeyType,
  AttributesValType,
  CampleImportType,
  NodeTextType,
  ValueType,
  ClassType
} from "../../../types/types";
import {
  checkFunction,
  cloneJSON,
  concatObjects,
  createError,
  createWarning,
  filterDuplicateArrObj
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
import { renderDynamicKey } from "../../functions/render/render-dynamic-key";
import { parseTemplate } from "../../functions/parse/parse-template";
import { renderValues } from "../../functions/render/render-values";
import { renderKeyData } from "../../functions/render/render-key-data";
import { updateText } from "../../functions/data/update-text";
import { updateAttributes } from "../../functions/data/update-attributes";
import { updateClass } from "../../functions/data/update-class";

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
    return this.exportObj;
  }

  render(
    setEventListener: () => void,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType,
    typeRender: ComponentRenderType = "static"
  ): void {
    const isObjectData = checkObject(this.data);
    if (typeof this.selector !== "undefined" && !isObjectData) {
      const setDynamicNodes = (key: string, isAllUpdate = false) => {
        const componentNodes = this._dynamic.data.data.components.map(
          (component) => component.nodes
        );
        const nodes = ([] as NodeType[]).concat.apply(
          [] as NodeType[],
          componentNodes
        );
        nodes.forEach((node: NodeType) => {
          if (isAllUpdate) {
            this._dynamic.dynamicNodes.push(node);
          } else {
            let nodeIsKey = false;
            for (let i = 0; i < node.values.length; i++) {
              const val = node.values[i];
              if (val.type === 1 || val.type === 2) {
                if (val.type === 1) {
                  const value = val.value as NodeTextType;
                  if (value.key.key === key) {
                    nodeIsKey = true;
                    break;
                  }
                } else {
                  const value = val.value as AttributesValType;
                  if (value.keys.hasOwnProperty(key)) {
                    nodeIsKey = true;
                    break;
                  }
                  if (nodeIsKey) {
                    break;
                  }
                }
              }
            }
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
            newObj.data = cloneJSON(obj1.data);
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
        importData: DataType | undefined,
        isDataFunction?: boolean,
        oldData?: DataType,
        isDynamic?: boolean
      ) => {
        let data: DataType | undefined =
          isDynamic && oldData ? { ...oldData } : { ...this.data };
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
      const renderDynamicNodes = (isAllUpdate = false) => {
        if (isAllUpdate) setDynamicNodes("", true);
        this._dynamic.dynamicNodes.forEach((e, i) => {
          if (!e.isNew) {
            const data = getData(e.dataId);
            e.values.forEach((value) => {
              switch (value.type) {
                case 1:
                  const value1 = value.value as NodeTextType;
                  const newData = String(renderDynamic(value1.key, data));
                  if (value1.value !== newData) {
                    (value.value as NodeTextType).value = newData;
                    value.render(newData);
                  }
                  break;
                case 2:
                  const attrFunc = (key: CurrentKeyType) =>
                    renderDynamic(key, data);
                  value.render(attrFunc);
                  break;
                case 4:
                  const classFunc = (key: CurrentKeyType) =>
                    renderDynamic(key, data);
                  value.render(classFunc);
                  break;
              }
            });
          } else delete this._dynamic.dynamicNodes[i].isNew;
        });
        this._dynamic.dynamicNodes = [];
      };
      const setNode = (
        values: NodeValuesType,
        index: number,
        id: number,
        currentComponent: ComponentDynamicNodeComponentType | undefined
      ) => {
        const node = createNode(values, index, id, true);
        if (currentComponent) {
          currentComponent.nodes.push(node);
        }
      };
      const getValues = (dataId: number) => {
        if (this.values) {
          if (checkFunction(this.values)) {
            // const valuesArguments: ValuesArguments = {
            //   currentData: getData(dataId)
            // };
            // const values = this.values(valuesArguments);
            return undefined;
          } else createError("Values error");
        } else return undefined;
      };
      const getValuesData = (data: any) => {
        if (this.values) {
          if (checkFunction(this.values)) {
            // const valuesArguments: ValuesArguments = {
            //   currentData: data
            // };
            // const values = this.values(valuesArguments);
            return undefined;
          } else createError("Values error");
        } else return undefined;
      };
      const renderDynamic = (key: CurrentKeyType, data: any) => {
        switch (key.type) {
          case 0:
            const firstKeyData = data[key.originKey];
            return key.isProperty
              ? renderKeyData(firstKeyData, key.properties as Array<string>)
              : firstKeyData;
          case 1:
            const values = getValuesData(data);
            let newData: undefined | string = undefined;
            if (values) newData = renderValues(key.key, values, key.isClass)[0];
            return newData;
          default:
            return undefined;
        }
      };
      const newFunction = (
        attribute: any,
        key: string,
        id: IdType,
        index: number,
        keys: DynamicKeyObjectArrayType
      ) => {
        renderKey(key);
        const renderNewFunction = (data: DataType, currentKey: string) => {
          setDynamicNodes(currentKey);
          try {
            renderDynamicNodes();
          } catch (err) {
            this._dynamic.dynamicNodes = [];
            createError("Error: Maximum render");
          }
          renderFunctionsData(
            updateFunction,
            false,
            id,
            this.functions,
            index,
            keys
          );
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
                this._dynamic.data.data.values[index]!.value!.hasOwnProperty(
                  key
                )
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
          return newData;
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
      const { push } = Array.prototype;
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
        importData: DataType | undefined,
        index: number,
        elements?: ScriptElementsType
      ) => {
        if (typeof this.script !== "undefined") {
          const component = getComponent(index);
          const oldData = getData(index, true);
          if (Array.isArray(this.script)) {
            if (this.script[1].start === start) {
              renderScript(
                oldData,
                this.script,
                component?.functions,
                importData,
                elements
              );
            } else {
              if (this.script[1].start === undefined && start === "afterLoad") {
                renderScript(
                  oldData,
                  this.script,
                  component?.functions,
                  importData,
                  elements
                );
              }
            }
          } else {
            if (start === "afterLoad")
              renderScript(
                oldData,
                this.script,
                component?.functions,
                importData,
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
      const cloneTemplate = (obj1: TemplateExportValueType) => {
        const newObj: TemplateExportValueType = {};
        Object.entries(obj1).forEach(([key, value]) => {
          if (key === "data") {
            if (!newObj.data) {
              newObj.data = {};
            }
            newObj.data = cloneJSON(obj1.data as object);
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
        if (this.export) {
          const template: TemplateExportValueType = cloneTemplate(
            this.export[valueExport]
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
          const importObject = { ...template };

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
      const cloneNode = Node.prototype.cloneNode;
      const createElement = (
        index: number,
        data: DynamicDataValueType,
        dataId: number,
        templateEl: EachTemplateType | undefined,
        importObject: any
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
          const updText = Object.getOwnPropertyDescriptor(
            CharacterData.prototype,
            "data"
          )?.set;
          const attrFunc = (key: CurrentKeyType) => renderDynamic(key, data);
          const newValues: NodeValuesType = [];
          if (!values.some((e) => e.type === 3)) {
            if (this.export) {
              createExportObject(index);
            }
          }
          const filtredKeys: DynamicKeyObjectArrayType = [];
          values.forEach((val) => {
            const node = nodes[val.id as number] as Element;
            switch (val.type) {
              case 1:
                const value2 = val.value as DynamicTextType;
                filtredKeys.push({
                  key: value2.key.originKey,
                  properties: value2.key.properties ?? []
                });
                const newData = String(renderDynamic(value2.key, data));
                const texts = value2.texts.map((e, j) => {
                  const node = nodes[e as number] as Text;
                  updText?.call(node, newData);
                  return node;
                });
                newValues.push({
                  render: (value: any = undefined) => updateText(value, texts),
                  type: 1,
                  value: {
                    key: value2.key,
                    value: newData
                  }
                });
                break;
              case 2:
                const value3 = val.value as AttributesValType;
                const fn = (fnNew: any, keys?: DynamicKeyObjectArrayType) =>
                  updateAttributes(node, value3, fnNew, keys);
                fn(attrFunc, filtredKeys);
                newValues.push({
                  render: fn,
                  type: 2,
                  value: value3
                });
                break;
              case 3:
                const value4 = val.value as CampleImportType;
                const componentName = node.getAttribute("data-cample");
                const keyImportString = value4.value;
                if (keyImportString && componentName) {
                  const newImportString = renderComponentTemplate(
                    keyImportString,
                    index,
                    componentName
                  );
                  renderImport(node, undefined, newImportString);
                } else {
                  createError("Render export error");
                }
                break;
              case 4:
                const value5 = val.value as ClassType;
                const fnClass = (fnNew: any) =>
                  updateClass(node, value5, fnNew);
                fnClass(attrFunc);
                push.call(newValues, {
                  render: fnClass,
                  type: 4,
                  value: value5
                });
                break;
            }
          });
          let currentComponent: ComponentDynamicNodeComponentType | undefined =
            undefined;
          if (el) {
            currentComponent = setDynamicNodeComponentType(index, importObject);
            renderFunctionsData(
              updateFunction,
              true,
              this._dynamic.data.data.currentId,
              this.functions,
              index,
              filterDuplicateArrObj(filtredKeys)
            );
            this._dynamic.data.data.currentId += 1;
          } else {
            renderFunctionsData(
              updateFunction,
              true,
              undefined,
              this.functions,
              index,
              []
            );
          }
          setNode(newValues, index, dataId, currentComponent);
          return el as Element;
        }
        return null;
      };
      const updateData = (
        id: number,
        importData: DataType | undefined,
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
        importData: DataType | undefined,
        isDataFunction: boolean | undefined
      ) => {
        updateData(index, importData, isDataFunction);
        try {
          renderDynamicNodes(true);
        } catch (err) {
          createError(`${err}`);
        }
      };
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
            importObject,
            importIndex
          );
          const isDataFunction = this.data && checkFunction(this.data);
          renderComponentsDynamic(index, importData, isDataFunction);
        });
      } else {
        document
          .querySelectorAll(`template[data-cample=${this.selector}]`)
          .forEach((e, index) => {
            const importObject = renderImport(e, this.import);
            this.importId = renderExportId(e, importId);
            const importData = renderImportData(e, exportData);
            const isDataFunction = this.data && checkFunction(this.data);
            renderScriptsAndStyles(e, "beforeLoad", importData, index);
            const functionsArray: FunctionsArray = [];
            const scriptOptionElements = renderElements(this.script);
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
            const currentId = this._dynamic.data.data.currentId;
            const data = setData(currentId, importData, isDataFunction)?.value;
            const newTemplateObj = parseTemplate(
              setEventListener,
              this.template as string,
              index,
              currentId,
              this.values,
              trim
            );
            const el = createElement(
              index,
              data,
              currentId,
              newTemplateObj,
              importObject
            );
            renderHTML(
              e,
              el,
              functionsArray,
              "component",
              scriptOptionElements
            );
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
