import { component0 } from "./../../components/component/component-examples";
import { renderTemplate } from "../../../../src/core/functions/render/render-template";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("renderTemplate", () => {
  let d;
  beforeEach(() => {
    d = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>")
      .window.document;
    global.document = d;
  });
  it("renderTemplate (1)", () => {
    assert.equal(renderTemplate("", undefined), "");
  });
  it("renderTemplate (2)", () => {
    assert.equal(renderTemplate("{{text}}", {}), "{{text}}");
  });
  it("renderTemplate (3)", () => {
    assert.equal(
      renderTemplate("{{component0}}", { component0 }),
      "<new-component></new-component>"
    );
  });
  it("renderTemplate (4)", () => {
    assert.equal(renderTemplate("{{text}}", { text: "text" }), "{{text}}");
  });
});
