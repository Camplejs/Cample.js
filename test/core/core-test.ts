import { component } from './../component/component-example';
import { Cample } from './../../src/core/core';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("core",()=>{
    let JSDOMdocument;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><div id="page"></div></body></html>')).window.document;
        global.document = JSDOMdocument;
    });
    it("core (1)",()=>{
        new Cample("#page").render("{{component}}",{component})
        assert.equal(document.querySelector("#page")?.outerHTML, '<div id="page"><new-component id="id">Component</new-component></div>');
    }); 
    it("core (2)",()=>{
        new Cample(undefined);
        assert.equal(document.querySelector("#page")?.outerHTML, '<div id="page"></div>');
    }); 
});