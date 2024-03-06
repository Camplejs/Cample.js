"use-strict";
import { ImportObjectType } from "./../../../types/types";
import {
  createEl,
  createError,
  checkObject,
  getArrImportString
} from "./../../../shared/utils";
import {
  ComponentType,
  ComponentsType,
  ConditionType,
  ExportIdType,
  ImportType,
  RenderComponentType
} from "../../../types/types";

export const renderComponents = (
  components: ComponentsType,
  condition: ConditionType,
  renderType: RenderComponentType,
  data: string | Element = "",
  index?: number,
  exportId?: ExportIdType
): string | Element => {
  let result = data;
  const getComponent = (component: ComponentType): string | undefined => {
    if (typeof component === "string") {
      return component;
    } else if (
      typeof component === "object" &&
      !Array.isArray(component) &&
      component !== null
    ) {
      return component.selector;
    } else createError("Component type is ComponentType");
  };
  const getValue = (component: ComponentType): string | undefined => {
    if (
      typeof component === "object" &&
      !Array.isArray(component) &&
      component !== null
    ) {
      if (component.import !== undefined) {
        if (
          Array.isArray(component.import) ||
          (checkObject(component.import) &&
            Array.isArray(component.import.value))
        ) {
          const isImportArray = Array.isArray(component.import);
          let importArray: ImportType;
          if (isImportArray) {
            importArray = [...(component.import as ImportType)];
          } else {
            const importData = component.import as ImportObjectType;
            importArray = [...importData.value] as any;
          }
          if (component.bind !== undefined) {
            if (Array.isArray(component.bind)) {
              component.bind.forEach((e) => {
                const arrayImportIndex = importArray.indexOf(e);
                if (!(arrayImportIndex !== -1)) {
                  createError("Bind values are included in import values");
                } else {
                  importArray[arrayImportIndex] =
                    importArray[arrayImportIndex] +
                    `:${renderType !== "cycle" ? 0 : index}`;
                }
              });
            } else {
              createError("Bind type is array");
            }
          }
          let exportNewId: ExportIdType | undefined;
          if (checkObject(component.import)) {
            const importData = component.import as ImportObjectType;
            exportNewId = importData.exportId;
          } else exportNewId = exportId;
          const importObj = {
            value: importArray,
            exportId: exportNewId
          };
          return getArrImportString(importObj as any, 0);
        } else {
          createError("Import type error");
        }
      } else {
        if (component.bind !== undefined) {
          createError("Bind array works with import");
        }
        if (exportId !== undefined) {
          createError("ExportId array works with import");
        }
      }
    } else {
      return "";
    }
  };

  components.forEach((component, componentIndex) => {
    if (component) {
      if (
        (renderType === "ternary" && componentIndex === index) ||
        renderType !== "ternary"
      ) {
        if (condition) {
          const el = createEl("template", [
            {
              selector: "data-cample",
              value: getComponent(component) ?? ""
            },
            {
              selector: "data-cample-import",
              value: getValue(component)
            }
          ]);
          if (renderType === "animation") {
            result = el;
          } else {
            result =
              renderType === "ternary" ? el.outerHTML : result + el.outerHTML;
          }
        } else {
          const el = createEl(getComponent(component) ?? "", [
            {
              selector: "data-cample-import",
              value: getValue(component)
            }
          ]);
          if (renderType === "animation") {
            result = el;
          } else {
            result =
              renderType === "ternary" ? el.outerHTML : result + el.outerHTML;
          }
        }
      }
    } else createError("Component type is ComponentType");
  });
  return result;
};
