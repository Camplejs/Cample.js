import { Component } from "../../../src/components/component/component";

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

export const component1 = new Component("new-component1", 
`{{component_text}}`,{
    script:[(elements)=>{
    },
    {
        start:undefined,
        elements:[
            {component:".component"}
        ]
    }]
});

export const component2 = new Component("new-component2", 
`{{component_text}}`,{
    script:[(elements)=>{
    },
    {
        start:"beforeLoad",
        elements:[
            {component:".component"}
        ]
    }]
});
export const component3 = new Component(undefined,"");
