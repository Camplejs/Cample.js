<p align="center">
    <a href="https://www.npmjs.com/package/cample">
        <img width="200" height="200" src="https://github.com/Camplejs/media/blob/main/logo_transparent.png" alt="cample" >
    </a>
</p>
<h1 align="center">(Framework at the stage of complete rework) Cample.js - one of the fastest frameworks without a virtual DOM on the Internet!</h1>
<div align="center">

[![npm-version](https://img.shields.io/npm/v/cample?logo=npm&color=0183ff&style=for-the-badge)](https://www.npmjs.com/package/cample)
[![discussions](https://img.shields.io/badge/discussions-0183ff?style=for-the-badge&logo=github&labelColor=555555)](https://github.com/Camplejs/Cample.js/discussions)
[![twitter](https://img.shields.io/badge/twitter-0183ff?style=for-the-badge&logo=x&labelColor=555555)](https://twitter.com/Camplejs)
[![license](https://img.shields.io/badge/MIT-0183ff?style=for-the-badge&label=license&logoColor=FFF&labelColor=555555)](https://discord.gg/aBMdpBShju)

</div>

<div align="center"><a href="https://camplejs.github.io">Website</a> • <a href="https://camplejs.github.io/documentation/introduction.html">Documentation</a> • <a href="https://camplejs.github.io/examples.html"> Examples </a> • <a href="https://codepen.io/Camplejs">Examples source</a></div>
<br>
<div align="center"><b>Alpha version</b></div>

## About Cample.js?

Cample.js is an open source javascript framework for creating user interfaces. The framework works on a component-based approach, where each component can be interconnected by importing and exporting the current state. Cample.js doesn't use a virtual DOM to interact with the real DOM, which makes the reactivity process much faster.

## Main advantage

<a href="https://krausest.github.io/js-framework-benchmark/2024/table_chrome_123.0.6312.59.html">
  <img width="100%" src="https://github.com/Camplejs/media/blob/main/diagram.svg" alt="benchmarks" >
</a>

Performance diagram of javascript frameworks and libraries.<br/>
Results based on <a href="https://krausest.github.io/js-framework-benchmark/2024/table_chrome_123.0.6312.59.html">123 release</a>

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
      updateClicks: "dynamicData"
    },
  }
);
cample("#app", {
  trimHTML: true,
}).render(
`<template data-cample="new-component">
</template>`,
  {
    newComponent
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
