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
  ScriptElementsType
} from "../../../types/types";
import {
  checkFunction,
  concatArrays,
  concatObjects,
  createError,
  createWarning,
  filterDuplicate,
  filterKey,
  getDynamicElements,
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
import { renderComponentDynamicKeyData } from "../../functions/data/render-component-dynamic-key-data";
import { renderKey } from "../../functions/render/render-key";
import { renderElements } from "../../functions/render/render-elements";

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

  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType
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
      const getData = (dataId: number) => {
        const data = this._dynamic.data.data.values.filter(
          (e) => e?.id === dataId
        );
        if (data.length > 1) {
          createError("id is unique");
        }
        return data && data[0] ? data[0].value : undefined;
      };
      const renderDynamicData = (
        importData: DataType,
        isDataFunction?: boolean
      ) => {
        let data = { ...this.data };
        if (isDataFunction) {
          const dataFunction: DataFunctionType = this.data as DataFunctionType;
          data = dataFunction({ data: importData });
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
        this._dynamic.data.data.values.push(dynamicData);
        const dynamicIndex =
          this._dynamic.data.data.values.indexOf(dynamicData);
        return this._dynamic.data.data.values[dynamicIndex];
      };
      const renderDynamicNodes = (key: string, index: number) => {
        if (this._dynamic.dynamicNodes.length < 2048) {
          this._dynamic.dynamicNodes.forEach((e, i) => {
            const dataArray = renderComponentDynamicKeyData(
              getData(e.dataId),
              index,
              key
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
        } else {
          createError("Maximum render");
        }
        this._dynamic.dynamicNodes = [];
      };
      const setNode = (
        el: Element,
        index: number,
        data: DataComponentType,
        id: number
      ) => {
        const node = createNode(el, index, data, id, false);
        this._dynamic.data.nodes.push(node);
      };

      const render = (index: number) => {
        setDynamicNodes("", true);
        for (let i = 0; i < this._dynamic.dynamicNodes.length; i++) {
          this._dynamic.dynamicNodes[i].dynamicTexts.forEach((val, j) => {
            const dataArray = renderComponentDynamicKeyData(
              getData(this._dynamic.dynamicNodes[i].dataId),
              index,
              val.key
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
              const dataArray = renderComponentDynamicKeyData(
                getData(this._dynamic.dynamicNodes[i].dataId),
                index,
                keyAttr
              );
              const newData = dataArray[0];
              const isProperty = dataArray[1];
              this._dynamic.dynamicNodes[i].attrs = this._dynamic.dynamicNodes[
                i
              ].updateAttr(newData, keyAttr, isProperty);
            });
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
      const updateFunction = (
        name: string,
        key: string,
        isRender = false,
        id: IdType,
        index: number,
        keys: DynamicKeyObjectArrayType
      ) => {
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
        const updateData = (attr = defaultData) => {
          return attr;
        };
        if (this._dynamic.data.functions.hasOwnProperty(name) && isRender) {
          createError("Function name is unique");
        } else {
          this._dynamic.data.functions[name] = (
            attribute: any = updateData
          ) => {
            if (typeof attribute === "function") {
              newFunction(attribute(defaultData), key, id, index, keys);
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
        elements?: ScriptElementsType
      ) => {
        if (typeof this.script !== "undefined") {
          if (Array.isArray(this.script)) {
            if (this.script[1].start === start) {
              renderScript(
                this.script,
                e,
                this._dynamic.data.functions,
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
                  this._dynamic.data.functions,
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
                this._dynamic.data.functions,
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
      const renderDynamicArray = (
        e: Element | null,
        index: number,
        importData: DataType,
        isDataFunction?: boolean
      ) => {
        if (e) {
          const dynamicArray = getDynamicElements(e);
          const keys: DynamicKeyObjectArrayType = [];
          if (dynamicArray.length) {
            const currentId = this._dynamic.data.data.currentId;
            const data = setData(currentId, importData, isDataFunction)?.value;
            dynamicArray.forEach((el) => {
              getKeys(el).forEach((key) => {
                if (key.includes(".")) {
                  const renderedKey = renderKey(key);
                  if (renderedKey) {
                    keys.push(renderedKey as DynamicKeyObjectType);
                  }
                }
              });
            });
            const filtredKeys = filterDuplicate(keys);
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
            });
            try {
              render(index);
            } catch (err) {
              createError(`${err}`);
            }
          } else {
            const data = renderDynamicData(importData, isDataFunction);
            renderFunctionsData(
              data,
              updateFunction,
              true,
              undefined,
              index,
              []
            );
          }
          this._dynamic.data.data.currentId += 1;
        } else {
          const data = renderDynamicData(importData, isDataFunction);
          renderFunctionsData(data, updateFunction, true, undefined, index, []);
        }
      };
      const condition =
        (replaceTags && this.replaceTag === undefined) || this.replaceTag;
      const trim = (trimHTML && this.trimHTML === undefined) || this.trimHTML;
      document
        .querySelectorAll(
          condition ? `template[data-cample=${this.selector}]` : this.selector
        )
        .forEach((e, index) => {
          renderImport(e, this.import);
          this.importId = renderExportId(e, importId);
          const importData = renderImportData(e, exportData, condition);
          this.dataSet.push(importData);
          const isDataFunction = this.data && checkFunction(this.data);
          renderScriptsAndStyles(e, "beforeLoad", importData);
          const functionsArray: FunctionsArray = [];
          const scriptOptionElements = renderElements(this.script);
          functionsArray.push((el: Element | null) =>
            renderDynamicArray(el, index, importData, isDataFunction)
          );
          functionsArray.push(
            (el: Element | null, elements?: ScriptElementsType) =>
              renderScriptsAndStyles(el, "afterLoad", importData, elements)
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
        });
    } else {
      createError("Property 'selector' is required");
    }
  }
}
