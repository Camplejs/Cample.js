"use strict";

import { DynamicKeyObjectType, EventKeyObjectType } from "../../../types/types";

export const renderEventKey = (key: string): EventKeyObjectType => {
  const functionKey: string | DynamicKeyObjectType | undefined =
    key.split("(")[0];
  let argumentsKey = "";
  const regex1 = /\(([^)]+)\)/g;
  key.replace(regex1, (str, d) => {
    const key = d.replace(/\s/g, "");
    argumentsKey = key;
    return str;
  });
  const eventKey = {
    key: functionKey,
    arguments: argumentsKey.split(",")
  };
  return eventKey;
};
