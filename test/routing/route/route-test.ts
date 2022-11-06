import assert from "assert";
import { route1 } from "./route-examples";

describe("Route",()=>{
    it("Route (1)",()=>{
        assert.throws(()=>{route1.render()}, Error, "Error: Property 'selector', 'path' is required");
    }); 
});