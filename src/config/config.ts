export const VALUE_REGEX = /\[+(.*?)\]+/g;
export const MAIN_REGEX = /\{{(.*?)}}/g;
export const MAIN_KEEP_DOUBLE_QUOTES_REGEX = /(\{\{.*?\}\})/g;
export const IMPORT_REGEX = /\{{{(.*?)}}}/g;
export const CONDITION_REGEX = /!/g;
export const TEXT_REGEX = /\{\{\s*([^}]+)\s*\}\}|([^{}]+)/g;
export const SPACE_REGEX = /\s+/g;
export const CLICK_FUNCTION_NAME = "__click__";
