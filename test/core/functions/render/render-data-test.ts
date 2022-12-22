// import { renderData } from "../../../../src/core/functions/render/render-data";
// import assert from "assert";

// describe("renderData", () => {
//   const returnValue = (key:string) =>{
//     const data ={
//       data:""
//     }
//     if(data){
//       return data[key];
//     }else{
//       return undefined;
//     }
//   }
//   it("renderData (1)", () => {
//     assert.equal(renderData("", undefined, 0), "",returnValue(""));
//   });
//   it("renderData (2)", () => {
//     assert.equal(renderData("", { text: ["Text1", "Text2"] }, 0), "");
//   });
//   it("renderData (3)", () => {
//     assert.equal(
//       renderData("{{text}}", { text: { value: ["Text1"] } }, 0),
//       "Text1"
//     );
//   });
//   it("renderData (4)", () => {
//     assert.equal(
//       renderData(
//         "{{text}}",
//         { text: { value: ["Text1"], defaultValue: "Text" } },
//         3
//       ),
//       "Text"
//     );
//   });
//   it("renderData (5)", () => {
//     assert.equal(renderData("{{text}}", {}, 0), "undefined");
//   });
//   it("renderData (6)", () => {
//     assert.equal(
//       renderData(
//         "{{text}}",
//         { text: { value: ["Text1"], defaultValue: ["Text2", "Text3"] } },
//         1
//       ),
//       "Text3"
//     );
//   });
//   it("renderData (7)", () => {
//     assert.equal(
//       renderData("{{text}}", { text: { value: ["Text1"] } }, 1),
//       "undefined"
//     );
//   });
//   it("renderData (8)", () => {
//     assert.equal(renderData("{{text}}", { text: "Text" }, 0), "Text");
//   });
//   it("renderData (9)", () => {
//     assert.equal(
//       renderData("{{text}}", { text: { value: "Text" } }, 0),
//       "Text"
//     );
//   });
//   it("renderData (10)", () => {
//     assert.equal(renderData("{{text}}", { text: ["Text"] }, 0), "Text");
//   });
//   it("renderData (11)", () => {
//     assert.equal(
//       renderData(
//         "{{text}}",
//         { text: { value: undefined, defaultValue: ["Text2", "Text3"] } },
//         1
//       ),
//       "Text3"
//     );
//   });
//   it("renderData (12)", () => {
//     assert.equal(
//       renderData(
//         "{{text}}",
//         { text: { value: "Text1", defaultValue: undefined } },
//         0
//       ),
//       "Text1"
//     );
//   });
//   it("renderData (13)", () => {
//     assert.equal(
//       renderData(
//         "{{text}}",
//         { text: { value: undefined, defaultValue: undefined } },
//         0
//       ),
//       "[object Object]"
//     );
//   });
// });
