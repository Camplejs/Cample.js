<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img src="https://github.com/Camplejs/media/blob/main/logo.png" alt="cample" >
    </a>
</p>
<h1 align="center">Cample.js - typed javascript web framework for creating site UI.</h1>
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

<div align="center"><b>Links:<br> <a href="https://camplejs.github.io/documentation/introduction.html">Documentation</a> • <a href="https://camplejs.github.io/example.html"> Example </a> • <a href="https://github.com/Camplejs/example/blob/main/example.js">Example source</a> • <a href="https://camplejs.github.io">Website</a> </div>
<br>

<p align="center">
    <a href="https://camplejs.github.io/documentation/component.html">
        <img src="https://github.com/Camplejs/media/blob/main/NewComponent.png" alt="Component" >
    </a>
</p>

## About

Cample.js - typed javascript web framework for creating site UI. This framework is great for creating most of the various sites, due to its extensive functionality.

## Features

Cample.js provides the following features:

- **Supporting component approach**
- **Cycle**
- **Some operators like in vanilla js for working with components**
- **Animation**
- **Working with data**
- **100% coverage code**
- **No dependencies**
- **Typed**
  
## Installation

Install via NPM:
```bash
npm i -D cample 
```
Installing via npm is currently the default. The framework can work with most modern bundlers.

## Getting started
An instance of the Cample class is created, which is the main handler of all technological entities (components, etc.).
  
### JavaScript
```javascript
const newComponent = component("new-component", "component")
            
const newCample = cample("#page");
newCample.render(`
    <div> class="content">
        {{newComponent}}
    </div>
`,{
    newComponent
});
```
### HTML
```html
<div id="page"></div>
```
Link article: <a href="https://camplejs.github.io/documentation/getting-started.html">Getting started</a>.<br>
See <a href="https://camplejs.github.io/documentation/introduction.html">Cample.js docs</a> for more details.
## Example code
### JavaScript
```javascript
const newCample = cample("#page");
const newComponent = component("new-component", 
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
    style:".component{width:100px}"
});

newCample.render("{{newComponent}}", {newComponent});
```
### HTML
```html
<div id="page"></div>
```

## Repository
  
[Repository](https://github.com/Camplejs/Cample.js)
  
## Changelog

[Changelog](https://github.com/Camplejs/Cample.js/releases)
  
## Contribution
  
If you would like to contribute to this framework, please see [Contributing Guide](https://github.com/Camplejs/Cample.js/blob/main/CONTRIBUTING.md). Thank you!

## License
[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
