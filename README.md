# decomponentify1

A browserify transform to enable the easy use of [componentjs](https://github.com/component) components in browserify client javascript projects.

This can be used in conjunction with [deamdify](https://github.com/jaredhanson/deamdify) to require AMD components from bower as well.

NB: For more information about how to use debowerify to create stand-alone library bundles
check out [bower-resolve](https://github.com/eugeneware/bower-resolve) and the 
examples in the README.

[![build status](https://secure.travis-ci.org/frankwallis/decomponentify1.png)](http://travis-ci.org/frankwallis/decomponentify1)

## Installation

Installation is via npm:

```
$ npm install decomponentify1
```

## How to use.

Install some bower components:

```
# creates files in components/screenfull/
$ component install screenfull
```

Require the component file by it's component identifier (ie. in this case "screenfull"):

``` js
// public/scripts/app.js
var _screenfull = require('screenfull'); // the remote component
var domready = require('domready'); // a regular browserify npm component

domready(function () {
  var button = document.getElementById('fullscreen');
  button.addEventListener('click', function (evt) {
    // screenfull adds itself to window.screenfull - but we can get to it
    if (screenfull.enabled) {
      screenfull.toggle(this);
    }
  });
});
```

Build out your browserify bundle using the decomponentif transform:

```
$ browserify -t decomponentify1 public/scripts/app.js -o public/scripts/build/bundle.js
```

Then include your bundle.js in your HTML file and you're done!
