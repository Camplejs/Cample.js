import { If } from './../../../src/operator/if/if';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("If",()=>{
    let JSDOMdocument, newIf;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><component></component></body></html>')).window.document;
        global.document = JSDOMdocument;
        newIf= new If("new-if",
        ['component'],
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
        }});
    });
    it("If (1)",()=>{
        assert.equal(newIf._getStyle, '');
    }); 
    it("If (2)",()=>{
        assert.equal(newIf._getSelector, 'new-if');
    }); 
});