'use strict';
var APACHE, Core, SUFIX, fs, path, slug;

APACHE = '/etc/apache2/sites-available/';

SUFIX = '.nimble.com.br.conf';

fs = require('fs');

path = require('path');

slug = require('slug');

Core = (function() {
  function Core(cliente, cod) {
    if ((this instanceof Core) === false) {
      return new Core(cliente, cod);
    }
    this.cliente = cliente;
    this.cod = cod || null;
  }

  Core.prototype.install = function() {
    var cod, file, nome;
    nome = (slug(this.cliente)).toLowerCase();
    cod = this.cod;
    file = "" + APACHE + nome + SUFIX;
    fs.exists(file, function(exists) {
      var content, r, template, templateFile;
      if (exists) {
        return console.log('Cliente já criado');
      } else {
        r = {
          'cliente': nome,
          'codigo': cod
        };
        templateFile = path.join(__dirname, '../template');
        template = fs.readFileSync(templateFile).toString();
        content = template.replace(/\{(.*?)\}/g, function(a, b) {
          return r[b];
        });
        return console.log(content);
      }
    });
  };

  return Core;

})();

module.exports = Core;
