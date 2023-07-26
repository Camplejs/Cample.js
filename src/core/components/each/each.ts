"use-strict";
import {
  checkFunction,
  concatObjects,
  createError,
  createWarning,
  checkObject,
  objectEmpty,
  cloneValue,
  testValuesRegex
} from "../../../shared/utils";
import {
  DataType,
  DynamicDataType,
  DynamicDataValueType,
  EachDynamicNodeComponentType,
  DynamicFunctionsType,
  DynamicNodeComponentNodeType,
  DynamicTextType,
  EachDataFunctionType,
  EachDataValueType,
  EachOptionsType,
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
  ValuesArguments,
  DynamicEl,
  EachTemplateType,
  ValuesTemplateType,
  NodeValuesType,
  FunctionEventType,
  AttributesValType,
  NodeTextType,
  CurrentKeyType,
  IterationFunctionType,
  ValueType,
  ScriptElementsType,
  ClassType
} from "../../../types/types";
import { createEachDynamicNodeComponentType } from "../../functions/data/create-each-dynamic-node-component";
import { createNode } from "../../functions/data/create-node";
import { renderAttributes } from "../../functions/render/render-attributes";
import { renderExportId } from "../../functions/render/render-export-id";
import { renderHTML } from "../../functions/render/render-html";
import { renderImport } from "../../functions/render/render-import";
import { renderImportData } from "../../functions/render/render-import-data";
import { renderIndexData } from "../../functions/render/render-index-data";
import { renderScript } from "../../functions/render/render-script";
import { DataComponent } from "../data-component/data-component";
import { renderKey } from "../../functions/render/render-key";
import { renderDynamicKey } from "../../functions/render/render-dynamic-key";
import { updateAttributes } from "../../functions/data/update-attributes";
import { updateText } from "../../functions/data/update-text";
import { renderKeyData } from "../../functions/render/render-key-data";
import { renderValues } from "../../functions/render/render-values";
import { parseTemplate } from "../../functions/parse/parse-template";
import { createArgumentsTemplateFunction } from "../../functions/data/create-arguments-template-function";
import { updateClass } from "../../functions/data/update-class";

export class Each extends DataComponent {
  public data: EachDataFunctionType;
  public eachTemplate: string;
  public eachFunctions: DynamicFunctionsType;
  public functionName: string;
  public valueName: string;
  public importedDataName: string;
  public iteration: IterationFunctionType | undefined;

  constructor(
    selector: SelectorType,
    data: EachDataFunctionType,
    template: string,
    options: EachOptionsType | undefined = {}
  ) {
    super(selector, options);
    this.data = data;
    this.eachTemplate = template;
    this.eachFunctions = {};
    this.valueName = options.valueName ? options.valueName : "data";
    this.functionName = options.functionName ? options.functionName : "setData";
    this.importedDataName = options.importedDataName
      ? options.importedDataName
      : "importedData";
    this.iteration = options.iteration;
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
        const getValuesData = (data: any, importData: any, allData?: any) => {
          if (this.values) {
            if (checkFunction(this.values)) {
              const valuesArguments: ValuesArguments = {
                [this.valueName]: data,
                currentData: allData,
                [this.importedDataName]: importData
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
        const renderDynamic = (
          key: CurrentKeyType,
          data: any,
          importData: any,
          allData: any
        ) => {
          if (key.isValue) {
            const values = getValuesData(data, importData, allData);
            let newData: undefined | string = undefined;
            if (values) newData = renderValues(key.key, values, key.isClass)[0];
            return newData;
          } else {
            if (key.isOrigin) {
              const firstKeyData =
                key.originKey === this.valueName ? data : importData;
              return key.isProperty
                ? renderKeyData(firstKeyData, key.properties as Array<string>)
                : firstKeyData;
            }
          }
          return undefined;
        };
        const renderDynamicNodes = (importData: ImportDataType | undefined) => {
          this._dynamic.dynamicNodes.forEach((e, i) => {
            if (this.iteration) {
              const data = getData(e.dataId);
              const val = renderIndexData(data, e.eachIndex);
              const value = createArgumentsTemplateFunction(
                val,
                importData,
                this.valueName,
                this.importedDataName
              );
              (this.iteration as IterationFunctionType)(value, e.eachIndex);
            }
            if (!e.isNew) {
              const data = getData(e.dataId);
              const val = renderIndexData(data, e.eachIndex);
              e.values.forEach((value) => {
                switch (value.type) {
                  case "dynamicText":
                    const value1 = value.value as NodeTextType;
                    const newData = String(
                      renderDynamic(value1.key, val, importData, data)
                    );
                    if (value1.value !== newData) {
                      (value.value as NodeTextType).value = newData;
                      value.render(newData);
                    }
                    break;
                  case "attribute":
                    const attrFunc = (key: CurrentKeyType) =>
                      renderDynamic(key, val, importData, data);
                    value.render(attrFunc);
                    break;
                  case "class":
                    const classFunc = (key: CurrentKeyType) =>
                      renderDynamic(key, val, importData, data);
                    value.render(classFunc);
                    break;
                }
              });
            } else delete this._dynamic.dynamicNodes[i].isNew;
          });
          this._dynamic.dynamicNodes = [];
        };
        const updText = Object.getOwnPropertyDescriptor(
          CharacterData.prototype,
          "data"
        )?.set;
        const cloneNode = Node.prototype.cloneNode;
        const { push, splice } = Array.prototype;
        const createElement = (
          index: number,
          data: DynamicDataValueType,
          dataId: number,
          templateEl: EachTemplateType | undefined,
          isFirst = false,
          eachIndex?: number,
          importData?: ImportDataType
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
            const indexData = renderIndexData(data, eachIndex);
            const attrFunc = (key: CurrentKeyType) =>
              renderDynamic(key, indexData, importData, data);
            const newValues: NodeValuesType = [];
            values.forEach((val) => {
              const node = nodes[val.id as number];
              switch (val.type) {
                case "event":
                  const value1 = val.value as FunctionEventType;
                  value1(node, eachIndex);
                  break;
                case "dynamicText":
                  const value2 = val.value as DynamicTextType;
                  const newData = String(
                    renderDynamic(value2.key, indexData, importData, data)
                  );
                  const texts = value2.texts.map((e, j) => {
                    const node = nodes[e as number] as Text;
                    updText?.call(node, newData);
                    return node;
                  });
                  push.call(newValues, {
                    render: (value: any = undefined) =>
                      updateText(value, texts),
                    type: "dynamicText",
                    value: {
                      key: value2.key,
                      value: newData
                    }
                  });
                  break;
                case "attribute":
                  const value3 = val.value as AttributesValType;
                  const fn = (fnNew: any) =>
                    updateAttributes(node as DynamicEl, value3, fnNew);
                  fn(attrFunc);
                  push.call(newValues, {
                    render: fn,
                    type: "attribute",
                    value: value3
                  });
                  break;
                case "class":
                  const value4 = val.value as ClassType;
                  const fnClass = (fnNew: any) =>
                    updateClass(node as DynamicEl, value4, fnNew);
                  fnClass(attrFunc);
                  push.call(newValues, {
                    render: fnClass,
                    type: "class",
                    value: value4
                  });
                  break;
              }
            });
            setNode(
              newValues,
              index,
              dataId,
              eachIndex !== undefined ? eachIndex : 0,
              isFirst
            );
            return el as Element;
          }
          return null;
        };
        const { appendChild, insertBefore, removeChild } = Node.prototype;
        const setElement = (
          currentDynamicNodeComponentType: EachDynamicNodeComponentType,
          data: any,
          lastNode: LastNodeType,
          parentNode: ParentNode,
          index: number,
          dataId: number,
          eachIndex: number,
          isFirst = false,
          isNext?: boolean,
          importData?: ImportDataType
        ) => {
          const el = createElement(
            index,
            data,
            dataId,
            currentDynamicNodeComponentType?.template,
            isFirst,
            eachIndex,
            importData
          );
          if (el) {
            if (parentNode === lastNode.parentNode || parentNode === lastNode) {
              if (parentNode === lastNode) {
                appendChild.call(parentNode, el);
              } else if (isNext) {
                insertBefore.call(parentNode, el, lastNode);
              } else {
                insertBefore.call(parentNode, el, lastNode.nextSibling);
              }
              push.call(currentDynamicNodeComponentType?.elements, el);
            } else {
              createError("Element of Each error");
            }
          }
        };
        const deleteElement = (
          currentDynamicNodeComponentType: EachDynamicNodeComponentType,
          element: Element,
          parentNode: ParentNode,
          dataId: number,
          eachIndex: number
        ) => {
          deleteDynamicArrayNodes(dataId, eachIndex);
          splice.call(currentDynamicNodeComponentType.elements, eachIndex, 1);
          removeChild.call(parentNode, element);
        };
        const renderNewData = (
          oldData: any,
          newData: any,
          dataId: number,
          index: number,
          importData: ImportDataType | undefined,
          isFirst = false
        ) => {
          const isObjectData = checkObject(newData);
          if (
            Array.isArray(newData) ||
            (isObjectData && (Array.isArray(oldData) || checkObject(oldData)))
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
                      isObjectData ? Object.values(newData) : newData,
                      newNodePrevious,
                      parentNode,
                      index,
                      dataId,
                      newIndex,
                      isFirst,
                      undefined,
                      importData
                    );
                    newNodePrevious = newNodePrevious.nextSibling;
                  } else if (nodeNext) {
                    setElement(
                      currentDynamicNodeComponentType,
                      isObjectData ? Object.values(newData) : newData,
                      nodeNext,
                      parentNode,
                      index,
                      dataId,
                      newIndex,
                      isFirst,
                      true,
                      importData
                    );
                  } else if (nodeParentNode) {
                    setElement(
                      currentDynamicNodeComponentType,
                      isObjectData ? Object.values(newData) : newData,
                      nodeParentNode,
                      parentNode,
                      index,
                      dataId,
                      newIndex,
                      isFirst,
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
                    isFirst,
                    undefined,
                    importData
                  );
                  if (el.nextSibling) {
                    el = el.nextSibling;
                  } else createError("Each render error");
                }
              }
            } else if (oldDataLength > newDataLength) {
              if (newDataLength === 0) {
                const nextNode =
                  elements[oldDataLength - 1].nextSibling !== null
                    ? elements[oldDataLength - 1].nextSibling
                    : undefined;
                const previousNode = elements[0].previousSibling
                  ? elements[0].previousSibling
                  : undefined;
                const currentParentNode = elements[0].parentNode
                  ? elements[0].parentNode
                  : undefined;
                if (nextNode) {
                  currentDynamicNodeComponentType.nodeNext = nextNode;
                }
                if (previousNode) {
                  currentDynamicNodeComponentType.nodePrevious = previousNode;
                }
                if (currentParentNode) {
                  currentDynamicNodeComponentType.nodeParentNode =
                    currentParentNode;
                }
                this._dynamic.data.nodes = this._dynamic.data.nodes.filter(
                  (node) => node.index !== index
                );
                currentDynamicNodeComponentType.elements = [];
                if (nextNode && previousNode) {
                  while (
                    previousNode.nextSibling &&
                    previousNode.nextSibling !== nextNode
                  ) {
                    previousNode.nextSibling.remove();
                  }
                }
                if (nextNode && !previousNode) {
                  while (nextNode.previousSibling) {
                    nextNode.previousSibling.remove();
                  }
                }
                if (!nextNode && previousNode) {
                  while (previousNode.nextSibling) {
                    previousNode.nextSibling.remove();
                  }
                }
                if (!nextNode && !previousNode && currentParentNode) {
                  currentParentNode.replaceChildren();
                }
              } else {
                const diffrenceLength = oldDataLength - newDataLength;
                const lastIndex = oldDataLength ? oldDataLength - 1 : 0;
                for (let i = 0; i < diffrenceLength; i++) {
                  const oldIndex = lastIndex - i;
                  deleteElement(
                    currentDynamicNodeComponentType,
                    elements[oldIndex],
                    parentNode,
                    dataId,
                    oldIndex
                  );
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
            setDynamicNodes();
            try {
              renderDynamicNodes(importData);
            } catch (err) {
              this._dynamic.dynamicNodes = [];
              createError("Render error");
            }
            renderEachFunction(updateFunction, dataId, data, index, importData);
          };
          if (
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
                  this._dynamic.data.data.values[index].importData = importData;
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
          this.eachFunctions[name] = (attribute: any = updateData) => {
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
          importData: DataType | undefined,
          isDataFunction?: boolean,
          oldData?: EachDataValueType,
          isDynamic?: boolean
        ) => {
          let data: EachDataValueType;
          const currentData = isDynamic && oldData ? oldData : this.data;
          if (isDataFunction) {
            const dataFunction: EachDataFunctionType = this
              .data as EachDataFunctionType;
            data = dataFunction({
              importedData: importData,
              currentData: oldData
            });
          } else {
            if (checkObject(currentData)) {
              data = { ...currentData };
              if (importData) data = concatObjects(data, importData);
            } else {
              const dataArray = currentData as Array<any>;
              data = [...dataArray];
              if (importData && !objectEmpty(importData)) {
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
            true
          );
          return dataArray[0];
        };
        const setNode = (
          values: NodeValuesType,
          index: number,
          id: number,
          eachIndex: number,
          isFirst = false
        ) => {
          const node = createNode(values, index, id, true, eachIndex, isFirst);
          push.call(this._dynamic.data.nodes, node);
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

        const setDynamicNodes = () => {
          this._dynamic.data.nodes.forEach((node: NodeType) => {
            push.call(this._dynamic.dynamicNodes, node);
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
          const currentDynamicNodes = this._dynamic.data.nodes.filter(
            (e) => e?.index === currentId && e?.eachIndex === eachIndex
          );
          const nodeIndex = this._dynamic.data.nodes.indexOf(
            currentDynamicNodes[0]
          );
          if (nodeIndex > -1)
            splice.call(this._dynamic.data.nodes, nodeIndex, 1);
        };
        const getKey = (key: string) => {
          const newKey = renderKey(key);
          return checkObject(newKey)
            ? (newKey as DynamicKeyObjectType).key
            : newKey;
        };
        const renderEach = (
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
          const oldData = isDataObject ? {} : [];
          const template = this.eachTemplate;
          const newTemplateObj = parseTemplate(
            template as string,
            index,
            dataId,
            trim,
            getEventsData,
            this.valueName,
            this.importedDataName
          );
          renderEachFunction(updateFunction, dataId, data, index, importData);
          const component = setDynamicNodeComponentType(
            dataId,
            [],
            parentNode,
            nodePrevious,
            nodeNext,
            importObject,
            newTemplateObj
          );
          const elements: ScriptElementsType = {};
          try {
            renderNewData(oldData, data, dataId, index, importData, true);
          } catch (e) {
            createError(`${e}`);
          }
          if (
            component.elements.length > 0 &&
            Array.isArray(this.script) &&
            this.script[1].elements
          ) {
            const els = this.script[1].elements;
            Object.entries(els).forEach(([key, value]) => {
              elements[key] = component.elements.map((el) =>
                el.querySelector(value)
              );
            });
          }
          renderScriptsAndStyles(data, null, "afterLoad", importData, elements);
          this._dynamic.data.data.currentId += 1;
        };

        const renderTemplateData = (
          id: number,
          importData: DataType | undefined,
          index: number,
          isDataFunction?: boolean
        ): DynamicDataType => {
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

          return this._dynamic.data.data.values[dynamicIndex];
        };
        const renderScriptsAndStyles = (
          data: EachDataValueType,
          e: Element | null,
          start: StartType,
          importData: DataType | undefined,
          elements?: ScriptElementsType
        ) => {
          if (typeof this.script !== "undefined") {
            if (Array.isArray(this.script)) {
              if (this.script[1].start === start) {
                renderScript(
                  data,
                  this.script,
                  this.eachFunctions,
                  importData,
                  elements
                );
              } else {
                if (
                  this.script[1].start === undefined &&
                  start === "afterLoad"
                ) {
                  renderScript(
                    data,
                    this.script,
                    this.eachFunctions,
                    importData,
                    elements
                  );
                }
              }
            } else {
              if (start === "afterLoad")
                renderScript(
                  data,
                  this.script,
                  this.eachFunctions,
                  importData,
                  elements
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
          const oldData = getData(id, false) as DynamicDataType;
          if (!oldData) createError("Render error");
          const clonedOldData = cloneValue(oldData.value);
          const data = renderDynamicData(
            importData,
            isDataFunction,
            oldData?.value,
            true
          );
          const dynamicIndex = this._dynamic.data.data.values.indexOf(oldData);
          this._dynamic.data.data.values[dynamicIndex].oldValue = clonedOldData;
          this._dynamic.data.data.values[dynamicIndex].value =
            data as DynamicDataType;
          this._dynamic.data.data.values[dynamicIndex].importData = importData;
        };
        const renderComponentsDynamic = (
          index: number,
          importData: DataType | undefined,
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
          setDynamicNodes();
          try {
            renderDynamicNodes(importData);
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
                const currentId = this._dynamic.data.data.currentId;
                const templateData = renderTemplateData(
                  currentId,
                  importData,
                  index,
                  isDataFunction
                );
                const data = templateData?.value;
                const isDataObject = checkObject(data);
                renderScriptsAndStyles(
                  data as EachDataValueType,
                  e,
                  "beforeLoad",
                  importData,
                  {}
                );
                const template = templateElement;
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
                renderHTML(e, template, functionsArray, "each");
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
