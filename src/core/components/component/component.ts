"use-strict";
import { renderScript } from "../../functions/render/render-script";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  StyleType,
  DataType,
  ScriptType,
  AttributesType,
  DynamicTextArrayType,
  NodeType,
  DynamicTextType,
  TextArrayType
} from "../../../types/types";
import {
  concatArrays,
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

export class Component {
  public selector: SelectorType;
  public template: string;
  public attributes: AttributesType | undefined;
  public script: ScriptType | undefined;
  public data: DataType | undefined;
  public style: StyleType | undefined;
  private _dynamic: Dynamic;

  constructor(
    selector: SelectorType,
    template: string,
    options: ComponentOptionsType | undefined = {}
  ) {
    this.selector = selector;
    this.template = template;
    this.attributes = options.attributes;
    this.script = options.script;
    this.data = options.data ? options.data : undefined;
    this.style = options.style;
    this._dynamic = new Dynamic();
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
  render(): void {
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
    const renderDynamicNodes = (key: string) => {
      if (this._dynamic.dynamicNodes.length < 2048) {
        this._dynamic.dynamicNodes.forEach((e, i) => {
          const val = returnDataValue(this.data, key);
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
    const setNode = (el: Element, index: number) => {
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
          oldValue: returnDataValue(this.data, e),
          value: returnDataValue(this.data, e)
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
        dynamicTexts
      };
      this._dynamic.data.nodes.push(node);
    };
    const render = () => {
      setDynamicNodes("", true);
      this._dynamic.dynamicNodes.forEach((e, i) => {
        e.dynamicTexts.forEach((val, j) => {
          this._dynamic.dynamicNodes[i].dynamicTexts[j] = e.updateText(
            returnDataValue(this.data, val.key),
            val,
            e.texts
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
        if (Object.keys(e.attrs).length) {
          e.dynamicAttrs.forEach((keyAttr) => {
            e.attrs = e.updateAttr(
              returnDataValue(this.data, keyAttr),
              keyAttr
            );
          });
        }
      });
      this._dynamic.dynamicNodes = [];
    };
    const newFunction = (attribute: any, key: string) => {
      if (this.data && key && this.data[key]) {
        this.data[key] = attribute;
        setDynamicNodes(key);
        try {
          renderDynamicNodes(key);
        } catch (err) {
          this._dynamic.dynamicNodes = [];
          createError("Error: Maximum render");
        }
        renderFunctionsData(this.data, updateFunction, false);
      }
    };
    const updateFunction = (name: string, key: string, isRender = false) => {
      const defaultData =
        this.data && this.data[key] ? this.data[key] : undefined;
      const updateData = (attr = defaultData) => {
        return attr;
      };
      if (this._dynamic.data.functions.hasOwnProperty(name) && isRender) {
        createError("Error: Function name is unique");
      } else {
        this._dynamic.data.functions[name] = (attribute: any = updateData) => {
          if (typeof attribute === "function") {
            newFunction(attribute(defaultData), key);
          } else {
            newFunction(attribute, key);
          }
        };
      }
    };
    if (typeof this.selector !== "undefined") {
      document.querySelectorAll(this.selector).forEach((e, index) => {
        renderFunctionsData(this.data, updateFunction, true);
        if (typeof this.script !== "undefined") {
          if (this.script[1].start === "beforeLoad")
            renderScript(this.script, e, this._dynamic.data.functions);
        }
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
        e.innerHTML = this.template;
        const dynamicArray = getDynamicElements(e);
        dynamicArray.forEach((el) => {
          setNode(el, index);
        });
        try {
          render();
        } catch (err) {
          createError(`Error: ${err}`);
        }
        if (typeof this.script !== "undefined") {
          if (
            this.script[1].start === "afterLoad" ||
            this.script[1].start === undefined
          )
            renderScript(this.script, e, this._dynamic.data.functions);
        }
      });
    } else {
      createError("Error: Property 'selector' is required");
    }
  }
}
