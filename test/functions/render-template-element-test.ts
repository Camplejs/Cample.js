import { renderTemplateElement } from './../../src/functions/render-template-element';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderTemplateElement",()=>{
    let JSDOMdocument;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')).window.document;
        global.document = JSDOMdocument;
    });
    it("renderTemplateElement (1)",()=>{
        assert.equal(renderTemplateElement(undefined, undefined, undefined, undefined ), null);
    });
    it("renderTemplateElement (2)",()=>{
        assert.equal(renderTemplateElement("div", "id", "class", {style:""}).outerHTML, '<div id="id" class="class" style=""></div>');
    });
});

