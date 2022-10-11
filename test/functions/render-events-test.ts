import { renderEvents } from './../../src/functions/render-events';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderEvents",()=>{
    let JSDOMdocument, el;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')).window.document;
        global.document = JSDOMdocument;
        el=document.createElement("div");
    });
    it("renderEvents (1)",()=>{
        renderEvents(el,"hover","animation-class",undefined);
        assert.deepEqual(null, null);
    }); 
    it("renderEvents (2)",()=>{
        renderEvents(el,"toggle","animation-class",undefined);
        assert.deepEqual(null, null);
    }); 
    it("renderEvents (3)",()=>{
        renderEvents(el,"pause","animation-class","resume");
        assert.deepEqual(null, null);
    }); 
});

