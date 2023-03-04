"use-strict";
import { renderScript } from "../../functions/render/render-script";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  ScriptType,
  DynamicTextArrayType,
  NodeType,
  DynamicTextType,
  TextArrayType,
  StartType,
  FunctionsArray,
  ExportDataType,
  DataComponentType,
  ExportDataArrayType,
  IdType,
  DataType,
  DataFunctionType,
  ExportIdType,
  ImportObjectType
} from "../../../types/types";
import {
  checkFunction,
  concatArrays,
  concatObjects,
  createError,
  filterDuplicate,
  filterKey,
  getAttrKeys,
  getDynamicElements,
  getTextKeys,
  testRegex
} from "../../../shared/utils";
import { renderFunctionsData } from "../../functions/render/render-functions-data";
import { Dynamic } from "../../data/dynamic/dynamic";
import { returnDataValue } from "../../functions/data/return-data-value";
import { updateText } from "../../functions/data/update-text";
import { updateAttributes } from "../../functions/data/update-attributes";
import { renderHTML } from "../../functions/render/render-html";
import { ParentComponent } from "../parent-component/parent-component";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderExportId } from "../../functions/render/render-export-id";
import { equalObject } from "../../../shared/utils";
import { renderImport } from "../../functions/render/render-import";

export class Component extends ParentComponent {
  public script: ScriptType | undefined;
  public data: DataComponentType;
  private _dynamic: Dynamic;
  public import?: ImportObjectType;
  public dataSet: ExportDataArrayType;
  public importId?: ExportIdType;

  constructor(
    selector: SelectorType,
    template: string,
    options: ComponentOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.template = template;
    this.script = options.script;
    this.dataSet = [];
    this.data = options.data;
    this._dynamic = new Dynamic();
    this.import = options.import;
    this.importId = undefined;
  }

  get _getImport(): ImportObjectType | undefined {
    return this.import;
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
          createError("Error: id is unique");
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
      const renderDynamicNodes = (key: string) => {
        if (this._dynamic.dynamicNodes.length < 2048) {
          this._dynamic.dynamicNodes.forEach((e, i) => {
            const val = returnDataValue(getData(e.dataId), key);
            const filtredValues = filterKey(e.dynamicTexts, key);
            filtredValues.forEach((filtredVal: DynamicTextType) => {
              const index = e.dynamicTexts.indexOf(filtredVal);
              this._dynamic.dynamicNodes[i].dynamicTexts[index] = e.updateText(
                val,
                filtredVal,
                e.texts
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
              this._dynamic.dynamicNodes[i].attrs = e.updateAttr(val, key);
            }
          });
        } else {
          createError("Error: Maximum render");
        }
        this._dynamic.dynamicNodes = [];
      };
      const setNode = (
        el: Element,
        index: number,
        data: DataComponentType,
        id: number
      ) => {
        const keys = getTextKeys(el);
        const dynamicTexts: DynamicTextArrayType = [];
        const attrs = {};
        const dynamicAttrs = getAttrKeys(el);
        const arrayAttr = Array.from(el.attributes);
        const regexAttr = arrayAttr
          .map((attr) => attr.value)
          .filter((a) => testRegex(a));
        if (regexAttr.length) {
          arrayAttr.forEach((e) => {
            const valArr = {};
            const regex = /\{{(.*?)}}/g;
            e.value.replace(regex, (str, d) => {
              const key = d.trim();
              valArr[key] = undefined;
              return str;
            });
            const attr = {
              values: valArr,
              value: e.value,
              renderedValue: e.value
            };
            attrs[e.name] = attr;
          });
        }
        keys.forEach((e) => {
          const value: DynamicTextType = {
            key: e,
            texts: [],
            oldValue: returnDataValue(data, e),
            value: returnDataValue(data, e)
          };
          dynamicTexts.push(value);
        });

        const node: NodeType = {
          updateText: (
            val: any = undefined,
            updVal: DynamicTextType,
            texts: TextArrayType
          ) => updateText(el, val, updVal, index, texts),
          updateAttr: (val: any, key: string) =>
            updateAttributes(el, val, index, attrs, key),
          index,
          attrs,
          texts: [],
          dynamicAttrs,
          dynamicTexts,
          dataId: id
        };
        this._dynamic.data.nodes.push(node);
      };
      const render = () => {
        setDynamicNodes("", true);
        for (let i = 0; i < this._dynamic.dynamicNodes.length; i++) {
          this._dynamic.dynamicNodes[i].dynamicTexts.forEach((val, j) => {
            this._dynamic.dynamicNodes[i].dynamicTexts[j] =
              this._dynamic.dynamicNodes[i].updateText(
                returnDataValue(
                  getData(this._dynamic.dynamicNodes[i].dataId),
                  val.key
                ),
                val,
                this._dynamic.dynamicNodes[i].texts
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
              this._dynamic.dynamicNodes[i].attrs = this._dynamic.dynamicNodes[
                i
              ].updateAttr(
                returnDataValue(
                  getData(this._dynamic.dynamicNodes[i].dataId),
                  keyAttr
                ),
                keyAttr
              );
            });
          }
        }
        this._dynamic.dynamicNodes = [];
      };
      const newFunction = (attribute: any, key: string, id: IdType) => {
        const renderNewFunction = (data: DataType) => {
          setDynamicNodes(key);
          try {
            renderDynamicNodes(key);
          } catch (err) {
            this._dynamic.dynamicNodes = [];
            createError("Error: Maximum render");
          }
          renderFunctionsData(data, updateFunction, false, id);
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
                equalObject(dataIndex) &&
                this._dynamic.data.data.values[index]?.value[key]
              ) {
                this._dynamic.data.data.values[index].value[key] = attribute;
                renderNewFunction(this._dynamic.data.data.values[index].value);
              }
            }
          }
        } else {
          if (this.data && key && this.data[key]) {
            this.data[key] = attribute;
            renderNewFunction(this.data);
          }
        }
      };
      const updateFunction = (
        name: string,
        key: string,
        isRender = false,
        id: IdType
      ) => {
        const data = this._dynamic.data.data.values.filter((e) => e?.id === id);
        if (data.length > 1) {
          createError("Error: id is unique");
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
          createError("Error: Function name is unique");
        } else {
          this._dynamic.data.functions[name] = (
            attribute: any = updateData
          ) => {
            if (typeof attribute === "function") {
              newFunction(attribute(defaultData), key, id);
            } else {
              newFunction(attribute, key, id);
            }
          };
        }
      };
      const renderScriptsAndStyles = (
        e: Element | null,
        start: StartType,
        importData: DataType
      ) => {
        if (typeof this.script !== "undefined") {
          if (Array.isArray(this.script)) {
            if (this.script[1].start === start) {
              renderScript(
                this.script,
                e,
                this._dynamic.data.functions,
                importData
              );
            }
          } else {
            if (start === "afterLoad")
              renderScript(
                this.script,
                e,
                this._dynamic.data.functions,
                importData
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
          if (dynamicArray.length) {
            const currentId = this._dynamic.data.data.currentId;
            const data = setData(currentId, importData, isDataFunction)?.value;
            renderFunctionsData(
              data,
              updateFunction,
              true,
              this._dynamic.data.data.currentId
            );
            dynamicArray.forEach((el) => {
              setNode(el, index, data, currentId);
            });
            try {
              render();
            } catch (err) {
              createError(`Error: ${err}`);
            }
          } else {
            const data = renderDynamicData(importData, isDataFunction);
            renderFunctionsData(data, updateFunction, true, undefined);
          }
          this._dynamic.data.data.currentId += 1;
        } else {
          const data = renderDynamicData(importData, isDataFunction);
          renderFunctionsData(data, updateFunction, true, undefined);
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
          functionsArray.push((el: Element | null) =>
            renderDynamicArray(el, index, importData, isDataFunction)
          );
          functionsArray.push((el: Element | null) =>
            renderScriptsAndStyles(el, "afterLoad", importData)
          );
          renderHTML(
            e,
            this.template,
            this.replaceTag,
            replaceTags,
            functionsArray,
            "component",
            trim
          );
        });
    } else {
      createError("Error: Property 'selector' is required");
    }
  }
}
