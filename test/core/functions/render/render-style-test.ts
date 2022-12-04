import { renderStyle } from "../../../../src/core/functions/render/render-style";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("renderStyle", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>")
      .window.document;
    global.document = d;
  });
  it("renderStyle (1)", () => {
    assert.equal(renderStyle(undefined), undefined);
  });
  it("renderStyle (2)", () => {
    renderStyle("");
    const html = document.head.outerHTML;
    assert.equal(html, '<head><style type="text/css"></style></head>');
  });
});
