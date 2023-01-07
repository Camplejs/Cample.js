"use-strict";
import { renderScript } from "../../functions/render/render-script";
import { renderData } from "../../functions/render/render-data";
import { renderAttributes } from "../../functions/render/render-attributes";
import {
  ComponentOptionsType,
  SelectorType,
  StyleType,
  DataType,
  ScriptType,
  AttributesType,
  RenderType
} from "../../../types/types";
import {
  cloneElement,
  createError,
  getTextArray,
  isDeepEqualNode,
  isEqualNodeArray,
  testRegex
} from "../../../shared/utils";
import { renderFunctionsData } from "../../functions/render/render-functions-data";
import { Dynamic } from "../../data/dynamic/dynamic";

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
    this._dynamic = new Dynamic();
    this.data = options.data
      ? this._dynamic.watcher(
          options.data,
          this._updateOldData.bind(this),
          this._dynamicRender.bind(this)
        )
      : undefined;
    this.style = options.style;
  }
  get _getSelector(): SelectorType {
    return this.selector;
  }
  get _getStyle(): StyleType {
    return this.style;
  }
  _updateOldData(): void {
    this._dynamic.oldData = { ...this.data };
  }
  _dynamicRender(): void {
    this.render("dynamic");
  }

  render(type: RenderType = "default"): void {
    if (type !== "dynamic") {
      this._dynamic.oldData = { ...this.data };
    }

    if (typeof this.selector !== "undefined") {
      const newFunction = (attribute: any, key: string) => {
        if (this.data && key && this.data[key]) {
          this.data[key] = attribute;
        }
      };
      const updateFunction = (name: string, key: string) => {
        const defaultData =
          this.data && this.data[key] ? this.data[key] : undefined;
        const updateData = (attr = defaultData) => {
          return attr;
        };
        this._dynamic.functions[name] = (attribute: any = updateData) => {
          if (typeof attribute === "function") {
            newFunction(attribute(defaultData), key);
          } else {
            newFunction(attribute, key);
          }
        };
      };
      const returnValue = (key: string) => {
        if (this.data) {
          return this.data[key];
        } else {
          return undefined;
        }
      };
      const returnCloneValue = (key: string) => {
        if (this._dynamic.oldData) {
          return this._dynamic.oldData[key];
        } else {
          return undefined;
        }
      };
      const setRender = (index: number, child: Element) => {
        const arrayText = getTextArray(Array.from(child.childNodes));
        const regexAttr = Array.from(child.attributes)
          .map((attr) => attr.value)
          .filter((a) => testRegex(a));
        if (
          (arrayText.length &&
            testRegex(
              arrayText
                .map((n) => n.textContent)
                .join()
                .trim()
            )) ||
          regexAttr.length
        ) {
          if (!this._dynamic.updatingSet.get(child)) {
            this._dynamic.updatingSet.set(child, child.cloneNode(true));
          }
        }
        if (regexAttr.length) {
          Array.from(child.attributes).forEach((attr) => {
            if (testRegex(attr.value)) {
              attr.value = renderData(
                attr.value ?? "",
                this.data,
                index,
                returnValue
              );
            }
          });
        }
        if (
          arrayText.length &&
          testRegex(
            arrayText
              .map((n) => n.textContent)
              .join()
              .trim()
          )
        ) {
          const text = getTextArray([...child.childNodes]);
          text.forEach((t) => {
            Array.from(child.childNodes).forEach((ch) => {
              if (ch.nodeType === Node.TEXT_NODE) {
                if (ch.nodeValue === t.nodeValue) {
                  ch.textContent = renderData(
                    t.nodeValue ?? "",
                    this.data,
                    index,
                    returnValue
                  );
                }
              }
            });
          });
        }
      };
      const updatingSetRender = (el: Element, index: number) => {
        for (const child of el.getElementsByTagName("*")) {
          setRender(index, child);
        }
      };
      const dynamicRender = (
        constructor: Element,
        node: Element,
        index: number,
        data: DataType | undefined,
        returnValueFunction: (key: string) => any
      ) => {
        const clonedValue = constructor;
        renderAttributesValue(
          node,
          clonedValue,
          index,
          data,
          returnValueFunction
        );
        renderTextContent(node, clonedValue, index, data, returnValueFunction);
      };
      const renderTextContent = (
        node: Element,
        cloneNode: Element,
        index: number,
        data: DataType | undefined,
        returnValueFunction: (key: string) => any
      ) => {
        const arrayText = getTextArray(Array.from(cloneNode.childNodes));
        if (
          arrayText.length &&
          testRegex(
            arrayText
              .map((n) => n.textContent)
              .join()
              .trim()
          )
        ) {
          Array.from(node.childNodes).forEach((el, i) => {
            if (el.nodeType === Node.TEXT_NODE) {
              const val = cloneNode.childNodes[i].nodeValue;
              el.textContent = renderData(
                val ?? "",
                data,
                index,
                returnValueFunction
              );
            }
          });
        }
      };
      const renderAttributesValue = (
        node: Element,
        cloneNode: Element,
        index: number,
        data: DataType | undefined,
        returnValueFunction: (key: string) => any
      ) => {
        const regexAttr = Array.from(cloneNode.attributes)
          .map((attr) => attr.value)
          .filter((a) => testRegex(a));
        if (regexAttr.length) {
          Array.from(node.attributes).forEach((attr, i) => {
            const val = Array.from(cloneNode.attributes)[i].nodeValue;
            if (testRegex(val ?? "")) {
              attr.value = renderData(
                val ?? "",
                data,
                index,
                returnValueFunction
              );
            }
          });
        }
      };
      document.querySelectorAll(this.selector).forEach((e, index) => {
        this._dynamic.functions = new Set();
        renderFunctionsData(this.data, updateFunction);
        if (typeof this.script !== "undefined") {
          if (this.script[1].start === "beforeLoad")
            renderScript(this.script, e, this._dynamic.functions);
        }
        if (typeof this.attributes !== "undefined") {
          renderAttributes(e, this.attributes);
        }
        if (type !== "dynamic") {
          e.innerHTML = this.template;
          updatingSetRender(e, index);
          this._dynamic.oldNode = e.cloneNode(true);
        } else {
          if (
            this._dynamic.oldNode &&
            isDeepEqualNode(this._dynamic.oldNode, e)
          ) {
            this._dynamic.updatingSet.forEach(
              (constructor: Element, node: Element) => {
                dynamicRender(constructor, node, index, this.data, returnValue);
              }
            );
            this._dynamic.oldNode = e.cloneNode(true);
          } else {
            this._dynamic.updatingSet.forEach(
              (constructor: Element, node: Element) => {
                if (!e.contains(node)) {
                  this._dynamic.updatingSet.delete(node);
                } else {
                  let cloneAttrs = Array.from(constructor.attributes);
                  const nodeAttrs = Array.from(node.attributes);
                  let cloneAttrsLength = cloneAttrs.length;
                  const nodeAttrsLength = nodeAttrs.length;
                  if (!nodeAttrsLength && cloneAttrsLength) {
                    while (constructor.attributes.length > 0) {
                      constructor.removeAttributeNode(
                        constructor.attributes[0]
                      );
                    }
                  }
                  cloneAttrs.forEach((attr) => {
                    if (
                      !nodeAttrs.map((a) => a.nodeName).includes(attr.nodeName)
                    ) {
                      constructor.removeAttribute(attr.nodeName);
                    } else {
                      const nodeAttr = node.getAttribute(attr.nodeName);
                      const constructorAttr = constructor.getAttribute(
                        attr.nodeName
                      );
                      if (!(nodeAttr === "" && constructorAttr === "")) {
                        if (nodeAttr !== constructorAttr) {
                          if (
                            renderData(
                              constructorAttr ?? "",
                              this._dynamic.oldData,
                              index,
                              returnCloneValue
                            ) !== nodeAttr
                          ) {
                            constructor.setAttribute(
                              attr.nodeName,
                              nodeAttr ?? ""
                            );
                          }
                        }
                      }
                    }
                  });
                  cloneAttrs = Array.from(constructor.attributes);
                  cloneAttrsLength = cloneAttrs.length;
                  if (cloneAttrsLength !== nodeAttrsLength) {
                    nodeAttrs.forEach((attr) => {
                      if (
                        !cloneAttrs
                          .map((a) => a.nodeName)
                          .includes(attr.nodeName)
                      ) {
                        constructor.setAttribute(
                          attr.nodeName,
                          attr.nodeValue ?? ""
                        );
                      }
                    });
                  }
                  let cloneNodes = Array.from(constructor.childNodes);
                  const nodeNodes = Array.from(node.childNodes);
                  const cloneValue = cloneElement(constructor);
                  renderAttributesValue(
                    cloneValue,
                    constructor,
                    index,
                    this._dynamic.oldData,
                    returnCloneValue
                  );
                  renderTextContent(
                    cloneValue,
                    constructor,
                    index,
                    this._dynamic.oldData,
                    returnCloneValue
                  );
                  let clonedValueNodes = Array.from(cloneValue.childNodes);
                  clonedValueNodes.forEach((child, i) => {
                    const equalNodes = isEqualNodeArray(nodeNodes, child);
                    const equalCloneNodes = isEqualNodeArray(
                      clonedValueNodes,
                      child
                    );
                    if (!equalNodes.length) {
                      constructor.removeChild(cloneNodes[i]);
                      cloneValue.removeChild(clonedValueNodes[i]);
                    } else {
                      if (equalCloneNodes.length > 1) {
                        const equalNodesLength = equalNodes.length;
                        const len = equalCloneNodes.length;
                        if (len > equalNodesLength) {
                          constructor.removeChild(cloneNodes[i]);
                          cloneValue.removeChild(clonedValueNodes[i]);
                        }
                      }
                      if (
                        equalNodes.length > 1 &&
                        !(equalCloneNodes.length > 1)
                      ) {
                        const equalNodesLength = equalNodes.length;
                        let len = equalCloneNodes.length;
                        if (len > equalNodesLength) {
                          while (equalNodesLength < len) {
                            constructor.removeChild(cloneNodes[i]);
                            cloneValue.removeChild(clonedValueNodes[i]);
                            len--;
                          }
                        } else {
                          while (len < equalNodesLength) {
                            constructor.appendChild(
                              cloneNodes[i].cloneNode(true)
                            );
                            cloneValue.appendChild(
                              clonedValueNodes[i].cloneNode(true)
                            );
                            len++;
                          }
                        }
                      }
                    }
                  });
                  clonedValueNodes = Array.from(cloneValue.childNodes);
                  if (clonedValueNodes.length !== nodeNodes.length) {
                    nodeNodes.forEach((child) => {
                      const equalNodes = isEqualNodeArray(nodeNodes, child);
                      const equalCloneNodes = isEqualNodeArray(
                        clonedValueNodes,
                        child
                      );
                      if (!equalCloneNodes.length) {
                        let indexEqualNodes = 0;
                        while (indexEqualNodes < equalNodes.length) {
                          constructor.appendChild(child.cloneNode(true));
                          cloneValue.appendChild(child.cloneNode(true));
                          clonedValueNodes = Array.from(cloneValue.childNodes);
                          indexEqualNodes++;
                        }
                      } else {
                        if (equalCloneNodes.length > 1) {
                          const equalNodesLength = equalNodes.length;
                          let len = equalCloneNodes.length;
                          if (len < equalNodesLength) {
                            while (len < equalNodesLength) {
                              constructor.appendChild(child.cloneNode(true));
                              cloneValue.appendChild(child.cloneNode(true));
                              clonedValueNodes = Array.from(
                                cloneValue.childNodes
                              );
                              len++;
                            }
                          }
                        }
                      }
                    });
                  }
                  const indexesArray: Array<number> = [];
                  const multipleMap = new Map();
                  nodeNodes.forEach((child) => {
                    const isEqualArray = isEqualNodeArray(
                      clonedValueNodes,
                      child
                    );
                    let index: number;
                    if (isEqualArray.length > 1) {
                      const equalityArray: Array<undefined | ChildNode> = [];
                      for (const elem of multipleMap.keys()) {
                        if (isDeepEqualNode(elem, child)) {
                          equalityArray.push(elem);
                          break;
                        }
                      }
                      if (!equalityArray.length) {
                        multipleMap.set(child.cloneNode(true), 0);
                        index = clonedValueNodes.indexOf(isEqualArray[0]);
                      } else {
                        const val = multipleMap.get(equalityArray[0]) + 1;
                        multipleMap.set(equalityArray[0], val);
                        index = clonedValueNodes.indexOf(
                          isEqualArray[multipleMap.get(equalityArray[0])]
                        );
                      }
                    } else {
                      index = clonedValueNodes.indexOf(isEqualArray[0]);
                    }
                    indexesArray.push(index);
                  });
                  clonedValueNodes = Array.from(cloneValue.childNodes);
                  const cloneElements = cloneElement(constructor).childNodes;
                  const cloneValueElements =
                    cloneElement(cloneValue).childNodes;
                  indexesArray.forEach((i, index) => {
                    constructor.replaceChild(
                      cloneElements[i].cloneNode(true),
                      constructor.childNodes[index]
                    );
                    cloneValue.replaceChild(
                      cloneValueElements[i].cloneNode(true),
                      cloneValue.childNodes[index]
                    );
                  });
                  cloneNodes = Array.from(constructor.childNodes);
                  clonedValueNodes = Array.from(cloneValue.childNodes);
                  dynamicRender(
                    constructor,
                    node,
                    index,
                    this.data,
                    returnValue
                  );
                }
              }
            );
            for (const child of e.getElementsByTagName("*")) {
              if (!this._dynamic.updatingSet.get(child)) {
                setRender(index, child);
              }
            }
            this._dynamic.oldNode = e.cloneNode(true);
          }
        }
        if (typeof this.script !== "undefined") {
          if (
            this.script[1].start === "afterLoad" ||
            this.script[1].start === undefined
          )
            renderScript(this.script, e, this._dynamic.functions);
        }
      });
    } else {
      createError("Error: Property 'selector' is required");
    }
  }
}
