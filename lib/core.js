'use strict';
var APACHE, Core, SUFIX, checkFile, fs, path, rmFile, slug, vow, vowNode, writeFile;
APACHE = '/etc/apache2/sites-available/';
SUFIX = '.nimble.com.br.conf';
fs = require('fs');
path = require('path');
slug = require('slug');
vow = require('vow');
vowNode = require('vow-node');
checkFile = vowNode.promisify(fs.stat);
writeFile = vowNode.promisify(fs.writeFile);
rmFile = vowNode.promisify(fs.unlink);
Core = function () {
  function Core(cliente, cod) {
    if (this instanceof Core === false) {
      return new Core(cliente, cod);
    }
    this.cliente = cliente;
    this.cod = cod || null;
    this.slug = slug(this.cliente).toLowerCase();
    this.file = '' + APACHE + this.slug + SUFIX;
  }
  Core.prototype.install = function () {
    var cod, file;
    cod = this.cod;
    slug = this.slug;
    file = this.file;
    return checkFile(file).then(function () {
      return 'Esse cliente j\xE1 exite.';
    }, function (err) {
      var content, r, template, templateFile;
      r = {
        'cliente': slug,
        'codigo': cod
      };
      templateFile = path.join(__dirname, '../template');
      template = fs.readFileSync(templateFile).toString();
      content = template.replace(/\{(.*?)\}/g, function (a, b) {
        return r[b];
      });
      return writeFile(file, content).then(function () {
        return 'Cliente criado.';
      }, function (err) {
        return 'Falha ao criar o arquivo.';
      });
    });
  };
  Core.prototype.rm = function () {
    var file;
    file = this.file;
    return checkFile(this.file).then(function (stats) {
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