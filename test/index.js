var expect = require('chai').expect,
    browserify = require('browserify'),
    vm = require('vm'),
    path = require('path'),
    decomponentify = require('..'),
    fs = require('fs');

describe('decomponentify', function() {

  it('should be able to decomponentify a basic file from dependencies', function(done) {
    var jsPath = path.join(__dirname, 'fixtures', 'call-underscore.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(decomponentify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal('hello, world');
            done();
          }
        }
      });
    });
  });

  it('should be able to decomponentify a basic file from developent.dependencies', function(done) {
    var jsPath = path.join(__dirname, 'fixtures', 'call-humanize.js');
    var b = browserify();
    b.add(jsPath);
    b.transform(decomponentify);
    b.bundle(function (err, src) {
      if (err) return done(err);
      vm.runInNewContext(src, {
        console: {
          log: function (msg) {
            expect(msg).to.equal('12,345');
            done();
          }
        }
      });
    });
  });

  // it('should be able to decomponentify a submodule', function(done) {
  //   var jsPath = path.join(__dirname, '..', 'public', 'by_subpath.js');
  //   var b = browserify();
  //   b.add(jsPath);
  //   b.transform(decomponentify);
  //   b.bundle(function (err, src) {
  //     if (err) return done(err);
  //     vm.runInNewContext(src, {
  //       console: {
  //         log: function (msg) {
  //           expect(msg).to.equal(12345);
  //           done();
  //         }
  //       }
  //     });
  //   });
  // });

  // it('should be able to decomponentify a module with other dependencies', function(done) {
  //   var b = browserify();
  //   b.add(path.join(__dirname, '..', 'public', 'deep_dependencies_test.js'));
  //   b.transform(decomponentify);
  //   b.bundle(function (err, src) {
  //     if (err) return done(err);
  //     vm.runInNewContext(src);
  //     done();
  //   });
  // });

});
