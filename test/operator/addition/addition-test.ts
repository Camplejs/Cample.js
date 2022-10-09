import { Addition } from './../../../src/operator/addition/addition';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("Addition",()=>{
    let JSDOMdocument, addition;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><component></component></body></html>')).window.document;
        global.document = JSDOMdocument;
        addition= new Addition("new-addition",
        ['component', 'component'],{
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
    it("Addition (1)",()=>{
        assert.equal(addition._getStyle, '');
    }); 
    it("Addition (2)",()=>{
        assert.equal(addition._getSelector, 'new-addition');
    }); 
});