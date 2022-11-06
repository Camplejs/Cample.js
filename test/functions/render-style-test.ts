import { renderStyle } from './../../src/functions/render-style';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderStyle",()=>{
    let d;
    beforeEach(() => {
        d = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')).window.document;
        global.document = d;
    });
    it("renderStyle (1)",()=>{
        assert.equal(renderStyle(undefined), undefined);
    });
    it("renderStyle (2)",()=>{
        renderStyle("");
        let html = document.head.outerHTML;
        assert.equal(html, '<head><style type="text/css"></style></head>');
    }); 
    it("renderStyle (3)",()=>{
        renderStyle("", true, undefined);
        let html = document.head.outerHTML;
        assert.equal(html, '<head><style type="text/css" id="style-watch-mode"></style></head>');
    });
    it("renderStyle (4)",()=>{
        renderStyle("", true, "style-id");
        let html = document.head.outerHTML;
        assert.equal(html, '<head><style type="text/css" id="style-id"></style></head>');
    });
    it("renderStyle (5)",()=>{
        d = (new JSDOM('<!DOCTYPE html><html><head><style type="text/css" id="style-id">.example{}</style></head><body></body></html>')).window.document;
        global.document = d; 
        renderStyle("", true, "style-id");
        let html = document.head.outerHTML;
        assert.equal(html, '<head><style type="text/css" id="style-id"></style></head>');
    });
});
