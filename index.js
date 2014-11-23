var path = require('path');
var through = require('through');
var falafel = require('falafel');

var resolve = require('component-resolver');
var flatten = require('component-flatten');

var branches;

module.exports = function (file) {
  if (!/\.(js|jsx|(lit)?coffee(\.md)?|ls|ts)$/.test(file)) return through();
  var data = '';

  var tr = through(write, end);
  return tr;

  function write (buf) { data += buf; }
  function end () {
    if (branches === undefined) {
        resolve(process.cwd(), { development: true }, function (err, tree) {
          branches = flatten(tree); 
          next();
        });
    } else {
      next();
    }

    function next() {
      var output;
      try { output = parse(); }
      catch (err) {
        tr.emit('error', new Error(
          err.toString().replace('Error: ', '') + ' (' + file + ')')
        );
      }

      finish(output);
    }
  }

  function finish (output) {
    tr.queue(String(output));
    tr.queue(null);
  }

  /**
   * @param {string} name
   * @param {Object} [parent] The parent node, as provided by component
   * @returns {Object|null} The node as provided by component or null if not found
   */
  function getModule (name, parent) {
    return branches.filter(function(branch) {
      return((branch.node.name == name) || (branch.node.repository && (branch.node.repository.split('/')[1] == name)))
    })[0];
  };

  function parse () {
    var output = falafel(data, function (node) {
      if (node.type === 'CallExpression' && node.callee.type === 'Identifier' && node.callee.name === 'require') {
        var pth = node.arguments[0].value;
        if(!pth) return;

        var moduleName = getModuleName(pth);
        var moduleSubPath = getModuleSubPath(pth);

        var module = getModule(moduleName);

        if (!module) return;
    
        if (module.missing) {
          throw new Error('could not resolve dependency ' + moduleName + 
            ' : component returns the module as known but not found (did you forget to run component install ?)');
        }
	      
        var pkgMeta = module.pkgMeta;
        var requiredFilePath = moduleSubPath;

        if (!requiredFilePath){
          if (module.node.main) {
            requiredFilePath = module.node.main;
          } else {
            // if 'main' wasn't specified by this component, let's try
            // guessing that the main file is index.js
            requiredFilePath = 'index.js';
          }
        }

        var fullModulePath = path.resolve(path.join(module.path, requiredFilePath));
        var relativeRequiredFilePath = './' + path.relative(path.dirname(file), fullModulePath);

        node.arguments[0].update(JSON.stringify(relativeRequiredFilePath));
      }
    });

    function getModuleName(path){
      return path.split('/')[0]
    }

    function getModuleSubPath(path){
      var idx = path.indexOf('/')
      if (idx === -1) return null
      return path.substring(idx)
    }

    return output;
  }
};
