import { renderScript } from './../../src/functions/render-script';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("renderScript",()=>{
    let JSDOMdocument, el;
    beforeEach(() => {
        JSDOMdocument = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>')).window.document;
        global.document = JSDOMdocument;
        el=document.createElement("div");
        el.setAttribute("class","component");
        document.body.appendChild(el)
    });
    it("renderScript (1)",()=>{
     renderScript([(elements)=>{
      assert.deepEqual(elements.component, el);
    },
    {
        start:'afterLoad',
        elements:[
            {component:".component"}
        ]
    }],document.body);
    }); 
});