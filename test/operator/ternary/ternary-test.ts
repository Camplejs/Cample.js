import { Ternary } from './../../../src/operator/ternary/ternary';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("Ternary",()=>{
    let JSDOMdocument, ternary;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><component1></component1><component2></component2></body></html>')).window.document;
        global.document = JSDOMdocument;
        ternary= new Ternary("new-ternary",
        ['component1', 'component2'],
        true,{
        style:"",
        attributes:{
            id:""
        },
        element:{
            selector:"",
            class:"",
            id:"",
            attributes:{
                id:""
            }
        }
    });
    });
    it("Ternary (1)",()=>{
        assert.equal(ternary._getStyle, '');
    }); 
    it("Ternary (2)",()=>{
        assert.equal(ternary._getSelector, 'new-ternary');
    }); 
});