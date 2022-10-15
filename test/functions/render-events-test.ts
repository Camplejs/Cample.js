import { renderEvents } from './../../src/functions/render-events';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderEvents",()=>{
    let w, el;
    beforeEach(() => {
        w = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')).window;
        global.document = w.document;
        global.Event = w.Event;
        el=document.createElement("div");
    });
    it("renderEvents (1)",()=>{
        renderEvents(el,"hover","animation-class",undefined);
        let event1 = new Event("mouseenter");
        let event2 = new Event("mouseleave");
        el.dispatchEvent(event1);
        el.dispatchEvent(event2);
        assert.deepEqual(null, null);
    }); 
    it("renderEvents (2)",()=>{
        renderEvents(el,"toggle","animation-class",undefined);
        let event = new Event("click");
        el.dispatchEvent(event);
        el.dispatchEvent(event);
        assert.deepEqual(null, null);
    }); 
    it("renderEvents (3)",()=>{
        renderEvents(el,"pause","animation-class","resume");
        let event1 = new Event("pause");
        let event2 = new Event("resume");
        el.dispatchEvent(event1);
        el.dispatchEvent(event2);
        assert.deepEqual(null, null);
    }); 
});
