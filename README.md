<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img src="https://github.com/Camplejs/media/blob/main/logo.png" alt="cample" >
    </a>
</p>
<h1 align="center">Cample.js - perspective javascript framework.</h1>
<h3 align="center">Reactivity without Virtual DOM!</h3>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample?logo=npm&color=blue&style=flat-square)](https://www.npmjs.com/package/cample)
[![downloads](https://img.shields.io/npm/dt/cample?color=blue&style=flat-square)](https://www.npmjs.com/package/cample)
[![stars](https://img.shields.io/github/stars/Camplejs/Cample.js?logo=github&style=flat-square)](https://github.com/Camplejs/Cample.js)
[![types](https://img.shields.io/npm/types/cample?logo=typescript&style=flat-square)](https://github.com/Camplejs/Cample.js)<br>
[![license](https://img.shields.io/npm/l/cample?color=blue&style=flat-square)](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
[![repo-size](https://img.shields.io/github/repo-size/Camplejs/Cample.js?logo=github&style=flat-square)](https://github.com/Camplejs/Cample.js)
[![minified size](https://img.shields.io/bundlephobia/min/cample?logo=npm&style=flat-square)](https://www.npmjs.com/package/cample)

</div>

<div align="center"><b>Links:<br> <a href="https://camplejs.github.io">Website</a> • <a href="https://camplejs.github.io/documentation/introduction.html">Documentation</a> • <a href="https://camplejs.github.io/examples.html"> Examples </a> • <a href="https://codepen.io/Camplejs">Examples source</a></div>
<br>

## :watch: Benchmark

| Name                       | Cample.js |
| -------------------------- | --------- |
| create rows                | 41.9      |
| replace all rows           | 19.4      |
| partial update             | 110.7     |
| select row                 | 35.7      |
| swap rows                  | 25.1      |
| remove row                 | 73.9      |
| create many rows           | 469.8     |
| append rows to large table | 96.4      |
| clear rows                 | 31.3      |
| geometric mean             | 1.46      |

js-framework-benchmark/frameworks/non-keyed/cample

## About

Cample.js - perspective javascript framework.

This framework supports component approach and reactivity without Virtual DOM.

## Why Cample.js?

Cample.js is a new, frequently updated framework that works through class instances. The component approach, as well as reactivity without a virtual DOM and data export and import, will make creating a site much faster than if a site was developed using just js. Also, the framework is new, and you can try it as something new in building a website.

## Features

Cample.js provides the following features:

- **Reactivity without Virtual DOM**
- **Supporting component approach**
- **Each component**
- **Working with data**
- **No dependencies**
- **Typed**

## Installation

Install via NPM:

```bash
npm i -D cample
```

Installing via npm is currently the default. The framework can work with most modern bundlers.

## Getting started

An instance of the Cample class is created, which is the main handler for all components.

### JavaScript

```javascript
const newComponent = component("new-component", "<span>component</span>");

const newCample = cample("#page");
newCample.render(
`
    <div class="content">
        {{newComponent}}
    </div>
`,
  {
    newComponent
  }
);
```

### HTML

```html
<div id="page"></div>
```

Link article: <a href="https://camplejs.github.io/documentation/getting-started.html">Getting started</a>.<br>
See <a href="https://camplejs.github.io/documentation/introduction.html">Cample.js docs</a> for more details.

## Repository

[Repository](https://github.com/Camplejs/Cample.js)

## Changelog

[Changelog](https://github.com/Camplejs/Cample.js/releases)

## Contribution

If you would like to contribute to this framework, please see [Contributing Guide](https://github.com/Camplejs/Cample.js/blob/main/CONTRIBUTING.md). Thank you!

## Inspiration

If you like the framework, it will be very cool if you rate the repository with a star ★

## License

[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
