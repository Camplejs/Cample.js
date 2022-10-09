import { component } from './component-example';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("Component",()=>{
    let JSDOMdocument;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><div id="page"></div></body></html>')).window.document;
        global.document = JSDOMdocument;
    });
    it("Component (1)",()=>{
        assert.equal(component._getStyle, '');
    }); 
    it("Component (2)",()=>{
        assert.equal(component._getSelector, 'new-component');
    }); 
});