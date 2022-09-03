<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img src="https://github.com/Camplejs/media/blob/main/logo.png" alt="cample" >
    </a>
</p>
<h3 align="center">Cample.js - new web framework for creating the UI of the site.</h3>
<h3 align="center">
    This framework is in beta stage!
</h3>

<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample?logo=npm)](https://www.npmjs.com/package/cample)
[![repo-size](https://img.shields.io/github/repo-size/Camplejs/Cample.js?logo=github)](https://github.com/Camplejs/Cample.js)
[![license](https://img.shields.io/npm/l/cample)](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)

</div>

<div id='usage'></div>

## Usage
```javascript
import { Cample, Component } from 'cample';
const component = new Component("new-component", 
`<div class="component">
    {{component_text}}
</div>`,{
    script:[(elements)=>{
      console.log(elements.component);
    },
    {
        start:'afterLoad',
        elements:[
            {component:".component"}
        ]
    }],
    data:{
        component_text:"Component"
    },
    style:""
});
new Cample("#page").render(`
    <div class="content">
        {{component}}
    </div>
`,{
    component
});
```

<div id='installation'></div>

## Installation

Install via NPM:
```bash
npm i -D cample 
```

<div id='feauters'></div>

## Feauters

- Supporting component approach
- Cycle
- Some operators like in vanilla js for working with components
- Animation
- Working with data

<div id='documentation'></div>

## Documentation

[Documentation](https://camplejs.github.io/documentation.html)

<div id='example'></div>

## Example

[Example](https://camplejs.github.io/example.html)

[Example source](https://github.com/Camplejs/example/blob/main/example.js)

<div id='license'></div>

## License
[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
