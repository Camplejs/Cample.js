import { renderTemplateElement } from "../../../../src/core/functions/render/render-template-element";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("renderTemplateElement", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>")
      .window.document;
    global.document = d;
  });
  it("renderTemplateElement (1)", () => {
    assert.equal(
      renderTemplateElement("div", "id", "class", { style: "" }).outerHTML,
      '<div id="id" class="class" style=""></div>'
    );
  });
  it("renderTemplateElement (2)", () => {
    assert.throws(
      () => {
        renderTemplateElement(undefined, undefined, undefined, undefined);
      },
      Error,
      "Error: Property 'selector' is required"
    );
  });
});
