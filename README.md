# decomponentify1

A browserify transform to enable the easy use of [componentjs](https://github.com/component) components in browserify client javascript projects.

Shamelessly copied from [debowerify](https://github.com/eugeneware/debowerify)

[![build status](https://secure.travis-ci.org/frankwallis/decomponentify1.png)](http://travis-ci.org/frankwallis/decomponentify1)

## Installation

Installation is via npm:

```
$ npm install decomponentify1
```

## How to use.

Install some components directly from github:

```
$ component install components/underscore
```

Require the component file by it's component identifier (ie. in this case "underscore"):

``` js
// public/scripts/app.js
var _ = require('underscore'); // the remote component directly from github
var $ = require('jquery');     // from bower via debowerify
var domready = require('domready'); // a regular browserify npm component

domready(function () {
  var button = document.getElementById('fullscreen');
  button.addEventListener('click', function (evt) {
  	evt.preventDefault();
    var name = 'harry';
    var templateData = $('#sayHello').text();
        var compiled = _.template(templateData, {'data': name });
        $('#helloDiv').html(compiled);
  });
});
```

Build out your browserify bundle using the decomponentif transform:

```
$ browserify -t decomponentify1 public/scripts/app.js -o public/scripts/build/bundle.js
```

Then include your bundle.js in your HTML file and you're done!
