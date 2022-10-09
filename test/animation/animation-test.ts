import { AnimationComponent } from './../../src/animation/animation';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("Animation",()=>{
    let JSDOMdocument, animation;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body><component></component></body></html>')).window.document;
        global.document = JSDOMdocument;
        animation = new AnimationComponent("new-animation",
        'component',{
        event:"click",
        styleAnimation:``,
        attributes:{
            id:"id"
        },
        class:"animation-class",
        transition:"2s all",
        style:"",
        element:{
            selector:"div",
            id:"id",
            class:"class",
            transition:"2s all",
            attributes:{
                align:"center"
            }
        }
    });
    });
    it("Animation (1)",()=>{
        assert.equal(animation._getStyle, '.animation-class{}');
    }); 
    it("Animation (2)",()=>{
        assert.equal(animation._getSelector, 'new-animation');
    }); 
});