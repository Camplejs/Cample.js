import {routelink, routelink2} from './routelink-examples';
import assert from "assert";
import {JSDOM} from "jsdom";

describe("RouteLink",()=>{
    let w;
    beforeEach(() => {
        w = (new JSDOM('<!DOCTYPE html><html><head></head><body></body></html>',{url: 'https://camplejs.github.io/'})).window;
        global.window = w;
        global.document = w.document;
    });
    it("RouteLink (1)",()=>{
        assert.equal(routelink._getStyle, '.test{}');
    }); 
    it("RouteLink (2)",()=>{
        assert.equal(routelink._getSelector, 'new-routelink');
    }); 
    it("RouteLink (3)",()=>{
        assert.throws(()=>{routelink2.render()}, Error, "Error: Properties 'selector', 'path', 'component' is required");
    }); 
});

