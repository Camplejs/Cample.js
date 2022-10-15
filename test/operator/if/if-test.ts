import assert from "assert";
import {JSDOM} from "jsdom";
import { newIf, newIf2 } from "./if-examples";

describe("If",()=>{
    let d;
    beforeEach(() => {
        d = (new JSDOM('<!DOCTYPE html><html><head></head><body><component></component></body></html>')).window.document;
        global.document = d;
    });
    it("If (1)",()=>{
        assert.equal(newIf._getStyle, '');
    }); 
    it("If (2)",()=>{
        assert.equal(newIf._getSelector, 'new-if');
    }); 
    it("If (3)",()=>{
        assert.throws(()=>{newIf2.render()}, Error, "Error: If operator renders one and more components");
    }); 
});