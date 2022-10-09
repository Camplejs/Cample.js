<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img src="https://github.com/Camplejs/media/blob/main/logo.png" alt="cample" >
    </a>
</p>
<h1 align="center">Cample.js - new web framework for creating <br> the UI of the site.</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample?logo=npm)](https://www.npmjs.com/package/cample)
[![downloads](https://img.shields.io/npm/dt/cample)](https://www.npmjs.com/package/cample)
[![stars](https://img.shields.io/github/stars/Camplejs/Cample.js?logo=github)](https://github.com/Camplejs/Cample.js)
[![types](https://img.shields.io/npm/types/cample?logo=typescript)](https://github.com/Camplejs/Cample.js)<br>
[![license](https://img.shields.io/npm/l/cample)](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
[![install size](https://packagephobia.com/badge?p=cample)](https://packagephobia.com/result?p=cample)
[![repo-size](https://img.shields.io/github/repo-size/Camplejs/Cample.js?logo=github)](https://github.com/Camplejs/Cample.js)
[![coverage](https://img.shields.io/codecov/c/github/camplejs/cample.js?color=blue)](https://codecov.io/gh/Camplejs/Cample.js)

</div>
<h3 align="center">
    This framework is in beta stage!
</h3>



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
- **Working with data**
- **No dependencies**
- **Typed**

## Links

- [Documentation](https://camplejs.github.io/documentation.html)

- [Example](https://camplejs.github.io/example.html)

- [Example source](https://github.com/Camplejs/example/blob/main/example.js)

- [Website](https://camplejs.github.io)

## Changelog

[Changelog](https://github.com/Camplejs/Cample.js/releases)

## License
[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
