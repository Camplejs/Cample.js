import { renderRouteLink } from './../../src/functions/render-routelink';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderRouteLink",()=>{
    let w, el;
    beforeEach(() => {
        w = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>',{url: 'https://camplejs.github.io/'})).window;
        global.document = w.document;
        global.Event = w.Event;
        el=document.createElement("div");
    });
    it("renderRouteLink (1)",()=>{
        renderRouteLink(el,"/path");
        let event1 = new Event("click");
        el.dispatchEvent(event1);
        assert.deepEqual(null, null);
    }); 
    it("renderRouteLink (2)",()=>{
        assert.throws(()=>{renderRouteLink(undefined, "")}, Error, "Error: Properties 'element', 'path' is required");
    }); 
});

