<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img width="400" height="400" src="https://github.com/Camplejs/media/blob/main/logo_cample.png" alt="cample" >
    </a>
</p>
<h1 align="center">Cample.js - moderately fast reactive javascript framework.</h1>
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

## Installation

Install via NPM:

```bash
npm i -D cample
```

Installing via npm is currently the default. The framework can work with most modern bundlers.

## Why Cample.js?

Cample.js is an actively developed and maintained framework that supports many modern technology solutions for creating a website. The component-based approach, as well as reactivity without a virtual DOM and data export and import, will make building a site much faster than if the site was developed using js alone. Moreover, the framework is new and you can try it as something new when creating a website.

## Features

Cample.js provides the following features:

- Reactivity without Virtual DOM. The framework does not create large DOM trees for working with HTML.
- Keyed implementation. Blocks in a loop will not be overwritten by new ones if their keys match.
- Component approach. It allows to repeat many UI blocks on the site, which makes development much easier.
- Convenient approach to working with data inside a component. Transferring data between components allows to work with components even if they are in different files
- The frameworks make it easy to work with HTML files. The syntax of the framework itself is built on objects with HTML templates. When using modern project builders, HTML files are imported through a variable that does not pass through any function.
- He is moderately fast.

And a few others :)

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
