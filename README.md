<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img width="200" height="200" src="https://github.com/Camplejs/media/blob/main/logo_transparent.png" alt="cample" >
    </a>
</p>
<h1 align="center">Cample.js - fast modern javascript framework.</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/cample)
[![discussions](https://img.shields.io/badge/discussions-0183ff?style=for-the-badge&logo=github&labelColor=555555)](https://github.com/Camplejs/Cample.js/discussions)
[![twitter](https://img.shields.io/badge/twitter-0183ff?style=for-the-badge&logo=x&labelColor=555555)](https://twitter.com/Camplejs)
[![discord](https://img.shields.io/badge/discord-0183ff?style=for-the-badge&logo=discord&logoColor=FFF&labelColor=555555)](https://discord.gg/aBMdpBShju)

</div>

<div align="center"><a href="https://camplejs.github.io">Website</a> • <a href="https://camplejs.github.io/documentation/introduction.html">Documentation</a> • <a href="https://camplejs.github.io/examples.html"> Examples </a> • <a href="https://codepen.io/Camplejs">Examples source</a></div>
<br>

<div align="center"><b>Alpha version</b></div>

## Why Cample.js?

Cample.js is an actively developed and maintained framework that supports many modern technology solutions for creating user interfaces. The component-based approach, as well as reactivity without a virtual DOM and data export and import, will make building a site much faster than if the site was developed using js alone. Moreover, the framework is new and you can try it as something new when creating a website.

## Main advantage

<a href="https://krausest.github.io/js-framework-benchmark/2024/table_chrome_122.0.6261.69.html">
  <img width="100%" src="https://github.com/Camplejs/media/blob/main/diagram.svg" alt="benchmarks" >
</a>

Performance diagram of javascript frameworks and libraries.<br/>
Results based on <a href="https://krausest.github.io/js-framework-benchmark/2024/table_chrome_122.0.6261.69.html">122 release</a>

## Features

Cample.js provides the following features:

- Reactivity without Virtual DOM. The framework does not create large DOM trees for working with HTML.
- Keyed implementation. Blocks in a loop will not be overwritten by new ones if their keys match.
- Component approach. It allows to repeat many UI blocks on the site, which makes development much easier.
- Convenient approach to working with data inside a component. Transferring data between components allows to work with components even if they are in different files
- The frameworks make it easy to work with HTML files. The syntax of the framework itself is built on objects with HTML templates. When using modern project builders, HTML files are imported through a variable that does not pass through any function.
- Fast.
- CLI for creating an application.

And a few others :)

## Installation

To create an application, it is better to use the official cample-start command to generate a “starting point”, choosing from two currently available templates.

```bash
npx cample-start
```

The main two templates are based on two module bundlers such as Webpack and Parcel. To select one of them from the list in the terminal, you can select the most suitable one. All of them have official support.

Also, to install only the framework, you can use the following command:

```bash
npm i cample
```

With this installation, functions will still be available directly from the module. Installation using cample-start simply specifies the start files for the application.

## Getting started

After setting the starting point of the application, the js file will contain the following code, or the same one, but with html import.

### JavaScript

```javascript
const newComponent = component(
  "new-component",
  `<div class="component">
    <div class="clicks" data-value="{{dynamicData}}">Clicks:{{dynamicData}}</div>
    <button class="button">Click</button>
  </div>`,
  {
    script: ({ element, functions }) => {
      const button = element.querySelector(".button");
      const updateFunction = () => {
        functions?.updateClicks((data) => {
          return data + 1;
        });
      };
      button.addEventListener("click", updateFunction);
    },
    data: () => {
      return {
        dynamicData: 0,
      };
    },
    dataFunctions: {
      updateClicks: "dynamicData",
    },
  }
);
cample("#app", {
  trimHTML: true,
}).render(
  `
<template data-cample="new-component"></template>
`,
  {
    newComponent,
  }
);
```

### HTML

```html
<div id="app"></div>
```

You can change this code to any other you want. This code is presented as an example of how the framework works.

Link article: <a href="https://camplejs.github.io/documentation/getting-started.html">Getting started</a>.<br>

## Reactivity

Reactivity in the framework is understood as the ability, in response to data changes, to automatically update parts of the javascript code or HTML nodes that used this data.

<a href="https://camplejs.github.io/documentation/reactivity.html">
  <img width="50%" src="https://github.com/Camplejs/media/blob/main/reactivity.svg" alt="reactivity" >
</a>

This diagram shows that data is updated when you use a function that updates it. That is, it is as if a single-threaded data update is being created. In future versions, the structure may change slightly due to the processing of asynchronous data.

Link article: <a href="https://camplejs.github.io/documentation/reactivity.html">Reactivity</a>.<br>

## Changelog

[Changelog](https://github.com/Camplejs/Cample.js/releases)

## Contribution

If you would like to contribute to this framework, please see [Contributing Guide](https://github.com/Camplejs/Cample.js/blob/main/CONTRIBUTING.md). Thank you!

## Inspiration

If you like the framework, it will be very cool if you rate the repository with a star ★

## Contact

Email - camplejs@gmail.com

## License

[Licensed under MIT](https://github.com/Camplejs/Cample.js/blob/main/LICENSE)
