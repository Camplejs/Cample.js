import { renderStyle } from './../../src/functions/render-style';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderStyle",()=>{
    let JSDOMdocument;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')).window.document;
        global.document = JSDOMdocument;
    });
    it("renderStyle (1)",()=>{
        assert.equal(renderStyle(undefined), undefined);
    });
    it("renderStyle (2)",()=>{
        renderStyle("");
        let html = document.head.outerHTML;
        assert.equal(html, '<head><style type="text/css"></style></head>');
    }); 
});
