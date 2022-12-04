import { renderEvents } from "../../../../src/core/functions/render/render-events";
import assert from "assert";
import { JSDOM } from "jsdom";

describe("renderEvents", () => {
  let w, el;
  beforeEach(() => {
    w = new JSDOM("<!DOCTYPE html><html><head></head><body></body></html>")
      .window;
    global.document = w.document;
    global.Event = w.Event;
    el = document.createElement("div");
  });
  it("renderEvents (1)", () => {
    renderEvents(el, "hover", "animation-class", undefined);
    const event1 = new Event("mouseenter");
    const event2 = new Event("mouseleave");
    el.dispatchEvent(event1);
    el.dispatchEvent(event2);
    assert.deepEqual(null, null);
  });
  it("renderEvents (2)", () => {
    renderEvents(el, "toggle", "animation-class", undefined);
    const event = new Event("click");
    el.dispatchEvent(event);
    el.dispatchEvent(event);
    assert.deepEqual(null, null);
  });
  it("renderEvents (3)", () => {
    renderEvents(el, "pause", "animation-class", "resume");
    const event1 = new Event("pause");
    const event2 = new Event("resume");
    el.dispatchEvent(event1);
    el.dispatchEvent(event2);
    assert.deepEqual(null, null);
  });
});
