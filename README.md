<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img src="https://github.com/Camplejs/media/blob/main/logo.png" alt="cample" >
    </a>
</p>
<h3 align="center">Cample.js - new web framework for creating sites.</h3>
<h3 align="center">
    This framework is in beta stage!
</h3>


## Table of contents
- [Installation](#installation)
- [Start framework](#start)
- [Component](#component)
- [AnimationComponent](#animation-component)
- [Cycle](#cycle)
- [Operators](#operators)
    - [Addition](#addition)
    - [If](#if)
    - [Ternary](#ternary)
- [License](#license)

<div id='installation'></div>

## Installation

```bash
npm i -D cample 
```

<div id='start'></div>

## Start framework

```javascript
import { Cample } from 'cample';

new Cample("#page").render(`
    {{component}}
`,{
    component
});
```
<div id='component'></div>

## Component

```javascript
import { Component } from 'cample';
const component = new Component("new-component", 
`<div class="component">
    {{component_text}}
</div>`,
{
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
        component_text:"Text"
    },
    style:`
        .component{
            width:100px;
            height:100px;
        }
    `
});
```
<div id='animation-component'></div>

## AnimationComponent

```javascript
import { AnimationComponent } from 'cample';
const animation = new AnimationComponent("new-animation",'new-component',
{
    event:"click",
    styleAnimation:`width:200px;`,
    class:"animation-class",
    transition:"2s all"
});
```
<div id='cycle'></div>

## Cycle

```javascript
import { Cycle } from 'cample';
const cycle = new Cycle("new-cycle",['new-component'],2);
```
<div id='operators'></div>

## Operators
<div id='addition'></div>

### Addition

```javascript
import { Addition } from 'cample';
const addition = new Addition("new-addition",['new-component', 'new-component']);
```
<div id='if'></div>

### If

```javascript
import { If } from 'cample';
const newIf = new If("new-if",['new-component'],true);
```
<div id='ternary'></div>

### Ternary

```javascript
import { Ternary } from 'cample';
const ternary = new Ternary("new-ternary",['new-component', 'new-component'],true);
```

<div id='license'></div>

## License
[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
