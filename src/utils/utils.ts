"use strict";

export const createError = (text: string): Error => {
  throw new Error(text);
};