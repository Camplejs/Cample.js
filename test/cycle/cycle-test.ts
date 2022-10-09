import { Cycle } from './../../src/cycle/cycle';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("Cycle",()=>{
    let JSDOMdocument, cycle;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><component></component></body></html>')).window.document;
        global.document = JSDOMdocument;
        cycle= new Cycle("new-cycle",['component'],2,
        {
            attributes:{
                id:"id"
            },
            style:"",
            element:{
                selector:"div",
                id:"",
                class:"",
                attributes:{
                    id:""
                }
            }
        });
    });
    it("Cycle (1)",()=>{
        assert.equal(cycle._getStyle, '');
    }); 
    it("Cycle (2)",()=>{
        assert.equal(cycle._getSelector, 'new-cycle');
    }); 
});