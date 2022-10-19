<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img src="https://github.com/Camplejs/media/blob/main/logo.png" alt="cample" >
    </a>
</p>
<h1 align="center">Cample.js - functional web framework for creating site UI.</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample?logo=npm&color=blue&style=flat-square)](https://www.npmjs.com/package/cample)
[![downloads](https://img.shields.io/npm/dt/cample?color=blue&style=flat-square)](https://www.npmjs.com/package/cample)
[![stars](https://img.shields.io/github/stars/Camplejs/Cample.js?logo=github&style=flat-square)](https://github.com/Camplejs/Cample.js)
[![types](https://img.shields.io/npm/types/cample?logo=typescript&style=flat-square)](https://github.com/Camplejs/Cample.js)<br>
[![license](https://img.shields.io/npm/l/cample?color=blue&style=flat-square)](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
[![repo-size](https://img.shields.io/github/repo-size/Camplejs/Cample.js?logo=github&style=flat-square)](https://github.com/Camplejs/Cample.js)
[![minified size](https://img.shields.io/bundlephobia/min/cample?logo=npm&style=flat-square)](https://www.npmjs.com/package/cample)
[![coverage](https://img.shields.io/codecov/c/github/camplejs/cample.js?color=blue&style=flat-square)](https://codecov.io/gh/Camplejs/Cample.js)

</div>

<div align="center"><b>Links:<br> <a href="https://camplejs.github.io/documentation.html">Documentation</a> • <a href="https://camplejs.github.io/example.html"> Example </a> • <a href="https://github.com/Camplejs/example/blob/main/example.js">Example source</a> • <a href="https://camplejs.github.io">Website</a> </div>

## About

> Cample.js - web framework for creating site UI. This framework is great for creating most of the various sites, due to its extensive functionality.

## Installation and Usage

Install via NPM:
```bash
npm i -D cample 
```

### JavaScript
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
    attributes:{
        id:"id"
    },
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
### HTML
```html
<div id="page"></div>
```

## Feauters

- **Supporting component approach**
- **Cycle**
- **Some operators like in vanilla js for working with components**
- **Animation**
- **Route**
- **Working with data**
- **100% coverage code**
- **No dependencies**
- **Typed**
  
## Repository
  
[Repository](https://github.com/Camplejs/Cample.js)
  
## Changelog

[Changelog](https://github.com/Camplejs/Cample.js/releases)

## License
[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
