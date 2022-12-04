import { renderScript } from "../../../../src/core/functions/render/render-script";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("renderScript", () => {
  let d, el;
  beforeEach(() => {
    d = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>")
      .window.document;
    global.document = d;
    el = document.createElement("div");
    el.setAttribute("class", "component");
    document.body.appendChild(el);
  });
  it("renderScript (1)", () => {
    renderScript(
      [
        (elements) => {
          assert.deepEqual(elements.component, el);
        },
        {
          start: "afterLoad",
          elements: [{ component: ".component" }]
        }
      ],
      document.body
    );
  });
});
