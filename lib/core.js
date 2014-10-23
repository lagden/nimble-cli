'use strict';
var APACHE, Core, Q, SUFIX, checkFile, fs, path, rmFile, slug, writeFile;
APACHE = '/etc/apache2/sites-available/';
SUFIX = '.nimble.com.br.conf';
fs = require('fs');
path = require('path');
slug = require('slug');
Q = require('q');
checkFile = function (cliente) {
  var deferred, file;
  file = '' + APACHE + cliente + SUFIX;
  deferred = Q.defer();
  fs.stat(file, function (err, stats) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(file);
    }
  });
  return deferred.promise;
};
writeFile = function (file, content) {
  var deferred;
  deferred = Q.defer();
  fs.writeFile(file, content, function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
};
rmFile = function (file, content) {
  var deferred;
  deferred = Q.defer();
  fs.unlink(file, function (err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve();
    }
  });
  return deferred.promise;
};
Core = function () {
  function Core(cliente, cod) {
    if (this instanceof Core === false) {
      return new Core(cliente, cod);
    }
    this.cliente = cliente;
    this.cod = cod || null;
  }
  Core.prototype.install = function () {
    var cliente, cod;
    cod = this.cod;
    cliente = slug(this.cliente).toLowerCase();
    return checkFile(cliente).then(function () {
      return 'Esse cliente j\xE1 exite.';
    }, function (err) {
      var content, r, template, templateFile;
      r = {
        'cliente': cliente,
        'codigo': cod
      };
      templateFile = path.join(__dirname, '../template');
      template = fs.readFileSync(templateFile).toString();
      content = template.replace(/\{(.*?)\}/g, function (a, b) {
        return r[b];
      });
      return writeFile(err.path, content).then(function () {
        return 'Cliente criado.';
      }, function (err) {
        return 'Falha ao criar o arquivo.';
      });
    });
  };
  Core.prototype.rm = function () {
    var cliente;
    cliente = slug(this.cliente).toLowerCase();
    return checkFile(cliente).then(function (file) {
      return rmFile(file).then(function () {
        return 'Cliente removido.';
      }, function (err) {
        return 'N\xE3o exite esse cliente ou j\xE1 foi removido.';
      });
    }, function (err) {
      return 'N\xE3o exite esse cliente ou j\xE1 foi removido.';
    });
  };
  return Core;
}();
module.exports = Core;