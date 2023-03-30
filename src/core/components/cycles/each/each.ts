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
  createElement
} from "../../../../shared/utils";
import {
  DataType,
  DynamicDataType,
  DynamicDataValueType,
  DynamicFunctionsType,
  DynamicNodeComponentNodeType,
  DynamicNodeComponentType,
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
  StartType
} from "../../../../types/types";
import { createDynamicNodeComponent } from "../../../functions/data/create-dynamic-node-component";
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
import { renderComponentDynamicKeyData } from "../../../functions/data/render-component-dynamic-key-data";

export class Each extends DataComponent {
  public data: EachDataType;
  public templateFunction: EachTemplateFunction;
  public function: DynamicFunctionsType;
  public functionName: string;
  public valueName: string;
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
    this.componentData =
      options.componentData !== undefined ? options.componentData : false;
  }
  render(
    replaceTags?: boolean,
    trimHTML?: boolean,
    exportData?: ExportDataType,
    importId?: ExportIdType
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
          const renderEachFunction = (
            updateFunction: (
              name: string,
              dataId: number | undefined,
              index: number
            ) => void,
            dataId: number | undefined,
            data: EachDataValueType,
            index: number
          ) => {
            if (data !== undefined) {
              updateFunction(this.functionName, dataId, index);
            }
          };
          const condition =
            (replaceTags && this.replaceTag === undefined) || this.replaceTag;
          const renderDynamicNodes = (index: number) => {
            if (this._dynamic.dynamicNodes.length < 2048) {
              this._dynamic.dynamicNodes.forEach((e, i) => {
                const val = renderIndexData(getData(e.dataId), e.eachIndex);
                e.dynamicTexts.forEach((filtredVal: DynamicTextType) => {
                  const index = e.dynamicTexts.indexOf(filtredVal);
                  const dataArray = renderComponentDynamicKeyData(
                    val,
                    index,
                    filtredVal.key,
                    true,
                    this.componentData
                  );
                  const newData = dataArray[0];
                  const isProperty = dataArray[1];
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
                    const dataArray = renderComponentDynamicKeyData(
                      indexData,
                      index,
                      keyAttr,
                      true,
                      this.componentData
                    );
                    const newData = dataArray[0];
                    const isProperty = dataArray[1];
                    this._dynamic.dynamicNodes[i].attrs =
                      this._dynamic.dynamicNodes[i].updateAttr(
                        newData,
                        keyAttr,
                        isProperty
                      );
                  });
                }
              });
            } else {
              createError("Maximum render");
            }
            this._dynamic.dynamicNodes = [];
          };
          const setElement = (
            currentDynamicNodeComponentType: DynamicNodeComponentType,
            data: any,
            lastNode: LastNodeType,
            parentNode: ParentNode,
            index: number,
            dataId: number,
            eachIndex: number,
            isNext?: boolean
          ) => {
            const value = {
              [this.valueName]: checkObject(data)
                ? Object.entries(data)[eachIndex]
                : data[eachIndex]
            };
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
                setDynamicArrayNodes([el], index, data, dataId, eachIndex);
              } else {
                createError("Element of Each error");
              }
            }
          };
          const deleteElement = (
            currentDynamicNodeComponentType: DynamicNodeComponentType,
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
            index: number
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
                currentDynamicNodeComponentTypeArray[0];
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
                const lastIndex = oldDataLength ? oldDataLength - 1 : 0;
                for (let i = 0; i < diffrenceLength; i++) {
                  const newIndex = oldDataLength + i;
                  const el: LastNodeType = elements[lastIndex];
                  if (oldDataLength === 0) {
                    if (nodePrevious) {
                      setElement(
                        currentDynamicNodeComponentType,
                        newData,
                        nodePrevious,
                        parentNode,
                        index,
                        dataId,
                        newIndex
                      );
                    } else if (nodeNext) {
                      setElement(
                        currentDynamicNodeComponentType,
                        newData,
                        nodeNext,
                        parentNode,
                        index,
                        dataId,
                        newIndex,
                        true
                      );
                    } else if (nodeParentNode) {
                      setElement(
                        currentDynamicNodeComponentType,
                        newData,
                        nodeParentNode,
                        parentNode,
                        index,
                        dataId,
                        newIndex
                      );
                    } else {
                      createError("Each render error");
                    }
                  } else {
                    setElement(
                      currentDynamicNodeComponentType,
                      newData,
                      el,
                      parentNode,
                      index,
                      dataId,
                      newIndex
                    );
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
            index: number
          ) => {
            const renderNewFunction = (data: DynamicDataValueType) => {
              data = data as EachDataValueType;
              setDynamicNodes("", true);
              try {
                renderDynamicNodes(index);
              } catch (err) {
                this._dynamic.dynamicNodes = [];
                createError("Maximum render");
              }
              renderEachFunction(updateFunction, dataId, data, index);
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
                    renderNewData(
                      this._dynamic.data.data.values[index]?.oldValue,
                      this._dynamic.data.data.values[index]?.value,
                      dataId,
                      index
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
          const updateFunction = (
            name: string,
            dataId: number | undefined,
            index: number
          ) => {
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

            const updateData = (attr = defaultData) => {
              return attr;
            };
            this.function[name] = (attribute: any = updateData) => {
              if (typeof attribute === "function") {
                newFunction(attribute(defaultData), dataId, index);
              } else {
                newFunction(attribute, dataId, index);
              }
            };
          };

          const renderDynamicData = (
            importData: DataType,
            isDataFunction?: boolean
          ) => {
            let data: EachDataValueType;
            if (isDataFunction) {
              const dataFunction: EachDataFunctionType = this
                .data as EachDataFunctionType;
              data = dataFunction({ data: importData });
            } else {
              if (checkObject(this.data)) {
                data = { ...this.data };
                data = concatObjects(data, importData);
              } else {
                const dataArray = this.data as Array<any>;
                data = [...dataArray];
                if (!objectEmpty(importData)) {
                  createWarning("ImportData replacing data");
                  data = importData;
                }
              }
            }
            return data;
          };

          const setNode = (
            el: Element,
            index: number,
            data: EachDataValueType,
            id: number,
            eachIndex: number
          ) => {
            const node = createNode(
              el,
              index,
              data,
              id,
              true,
              eachIndex,
              this.componentData
            );
            this._dynamic.data.nodes.push(node);
          };

          const setDynamicNodeComponentType = (
            dataId: number,
            elements: ElementsType,
            parentNode: ParentNode,
            nodePrevious?: DynamicNodeComponentNodeType,
            nodeNext?: DynamicNodeComponentNodeType
          ) => {
            const DynamicNodeComponent = createDynamicNodeComponent(
              dataId,
              elements,
              parentNode,
              nodePrevious,
              nodeNext
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
          const getData = (dataId: number | undefined) => {
            const data = this._dynamic.data.data.values.filter(
              (e) => e?.id === dataId
            );
            if (data.length > 1) {
              createError("id is unique");
            }
            return data && data[0] ? data[0].value : undefined;
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
            eachIndex?: number
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
                    eachIndex !== undefined ? eachIndex : i
                  );
                });
              }
            });
          };

          const render = (index: number) => {
            setDynamicNodes("", true);
            for (let i = 0; i < this._dynamic.dynamicNodes.length; i++) {
              const indexData = renderIndexData(
                getData(this._dynamic.dynamicNodes[i].dataId),
                this._dynamic.dynamicNodes[i].eachIndex
              );

              this._dynamic.dynamicNodes[i].dynamicTexts.forEach((val, j) => {
                const dataArray = renderComponentDynamicKeyData(
                  indexData,
                  index,
                  val.key,
                  true,
                  this.componentData
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
                    const dataArray = renderComponentDynamicKeyData(
                      indexData,
                      index,
                      keyAttr,
                      true,
                      this.componentData
                    );
                    const newData = dataArray[0];
                    const isProperty = dataArray[1];
                    this._dynamic.dynamicNodes[i].attrs =
                      this._dynamic.dynamicNodes[i].updateAttr(
                        newData,
                        keyAttr,
                        isProperty
                      );
                  }
                );
              }
            }
            this._dynamic.dynamicNodes = [];
          };
          const renderEach = (
            elements: ElementsType,
            data: DynamicDataValueType,
            isDataObject: boolean,
            dataId: number,
            index: number,
            parentNode: ParentNode,
            nodePrevious?: DynamicNodeComponentNodeType,
            nodeNext?: DynamicNodeComponentNodeType
          ) => {
            data = data as EachDataValueType;
            renderEachFunction(updateFunction, dataId, data, index);
            if (elements && elements.length) {
              const renderElements = () => {
                setDynamicArrayNodes(elements, index, data, dataId);
                try {
                  render(index);
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
              nodeNext
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
                  const value = {
                    [this.valueName]: [
                      property,
                      this._dynamic.data.data.values[dynamicIndex].value![
                        property
                      ]
                    ]
                  };
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
                  const value = {
                    [this.valueName]:
                      this._dynamic.data.data.values[dynamicIndex].value![i]
                  };
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
          if (this.selector)
            document
              .querySelectorAll(
                condition
                  ? `template[data-cample=${this.selector}]`
                  : this.selector
              )
              .forEach((e, index) => {
                renderImport(e, this.import);
                this.importId = renderExportId(e, importId);
                const importData = renderImportData(e, exportData, condition);
                this.dataSet.push(importData);
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
                      nodeNext
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
