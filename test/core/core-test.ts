import { route } from './../route/route-examples';
import { addition1 } from './../operator/addition/addition-examples';
import { newIf, newIf1 } from './../operator/if/if-examples';
import { ternary, ternary1 } from './../operator/ternary/ternary-examples';
import { cycle, cycle1 } from './../cycle/cycle-examples';
import { component, component1, component2 } from './../component/component-examples';
import { Cample } from './../../src/core/core';
import assert from "assert";
import {JSDOM} from "jsdom";
import { addition } from '../operator/addition/addition-examples';
import { animation, animation1 } from '../animation/animation-examples';

describe("core",()=>{
    let w;
    beforeEach(() => {
        w = (new JSDOM('<!DOCTYPE html><html><head></head><body><div id="page"></div></body></html>',{url: 'https://camplejs.github.io'})).window;
        global.window = w;
        global.document = w.document;
    });
    it("core (1)",()=>{
        new Cample("#page").render("{{component}}",{component})
        assert.equal(document.querySelector("#page")?.outerHTML, '<div id="page"><new-component id="id">Component</new-component></div>');
    }); 
    it("core (2)",()=>{
        new Cample(undefined);
        assert.equal(document.querySelector("#page")?.outerHTML, '<div id="page"></div>');
    }); 
    
    it("core (3)",()=>{
        new Cample("#page").render(`
        {{newIf}},
        {{newIf1}},
        {{cycle}},
        {{addition}},
        {{addition1}},
        {{component1}},
        {{animation}},
        {{animation1}},
        {{ternary}},
        {{component2}},
        {{ternary1}},
        {{cycle1}}`,
        {newIf,
        newIf1,
        cycle,
        addition,
        addition1,
        component1,
        animation,
        animation1,
        ternary,
        component2,
        ternary1,
        cycle1});
        assert.equal(null, null);
    }); 
    it("core (4)",()=>{
        new Cample().renderRoutes({route})
    });
});
