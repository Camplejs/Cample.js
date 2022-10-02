import { renderData } from './../../src/functions/render-data';
import assert from "assert";

describe("renderData",()=>{
    it("renderData:",()=>{
        assert.equal(renderData("",undefined,0),"");
    });
})