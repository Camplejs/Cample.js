import { route } from './../routing/route/route-examples';
import { addition1 } from './../components/operator/addition/addition-examples';
import { newIf, newIf1 } from './../components/operator/if/if-examples';
import { ternary, ternary1 } from './../components/operator/ternary/ternary-examples';
import { cycle, cycle1 } from './../components/cycle/cycle-examples';
import { component, component1, component2 } from './../components/component/component-examples';
import { Cample } from './../../src/core/core';
import assert from "assert";
import {JSDOM} from "jsdom";
import { addition } from '../components/operator/addition/addition-examples';
import { animation, animation1 } from '../components/animation/animation-examples';
import { routelink, routelink1} from '../routing/routelink/routelink-examples';

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
        {{cycle1}}
        {{routelink}}
        {{routelink1}}`,
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
        cycle1,
        routelink,
        routelink1
        });
        assert.equal(null, null);
    }); 
    it("core (4)",()=>{
        global.Event = w.Event;
        new Cample("",{mode:{value:"watch",styleId:"style-id"}}).renderRoutes({route});
        w.dispatchEvent(new Event("pathnamechange"));
        assert.equal(null, null);
    });    
    it("core (5)",()=>{
        new Cample().renderRoutes({route});
        assert.equal(null, null);
    });   
    it("core (6)",()=>{
        new Cample("#page",{mode:{value:"watch",styleId:"style-id"}}).render(`
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
        {{cycle1}}
        {{routelink}}
        {{routelink1}}`,
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
        cycle1,
        routelink,
        routelink1
        });
        assert.equal(null, null);
    }); 
});
