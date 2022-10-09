import { Component } from "../../src/component/component";

export const component = new Component("new-component", 
`{{component_text}}`,{
    script:[(elements)=>{
    },
    {
        start:'afterLoad',
        elements:[
            {component:".component"}
        ]
    }],
    attributes:{
        id:"id"
    },
    data:{
        component_text:"Component"
    },
    style:""
});