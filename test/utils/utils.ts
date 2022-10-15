import assert from "assert";
import { createError } from "../../src/utils/utils";

describe("utils",()=>{
    it("createError (1)",()=>{
        assert.throws(()=>{createError("")}, Error,"");
    }); 
});
