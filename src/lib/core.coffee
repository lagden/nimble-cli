'use strict'

APACHE = '/etc/apache2/sites-available/'
SUFIX  = '.nimble.com.br.conf'

fs   = require 'fs'
path = require 'path'
slug = require 'slug'

class Core
  constructor: (cliente, cod) ->
    return new Core cliente, cod if (@ instanceof Core) is false
    @cliente = cliente
    @cod = cod || null

  install: () ->
    nome = (slug @cliente).toLowerCase()
    cod  = @cod
    file = "#{APACHE}#{nome}#{SUFIX}"
    fs.exists file, (exists) ->
      if exists
        console.log 'Cliente já criado'
      else

        r =
          'cliente': nome
          'codigo' : cod

        templateFile = path.join __dirname, '../template'
        template = fs.readFileSync(templateFile).toString()
        content = template.replace /\{(.*?)\}/g, (a, b) ->
          return r[b]

        console.log content
    return

module.exports = Core