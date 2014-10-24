'use strict'

APACHE  = '/etc/apache2/sites-available/'
SUFIX   = '.nimble.com.br.conf'

fs      = require 'fs'
path    = require 'path'
slug    = require 'slug'
vow     = require 'vow'
vowNode = require 'vow-node'

checkFile = vowNode.promisify fs.stat
writeFile = vowNode.promisify fs.writeFile
rmFile    = vowNode.promisify fs.unlink

class Core
  constructor: (cliente, cod) ->
    return new Core cliente, cod if (@ instanceof Core) is false
    @cliente = cliente
    @cod = cod || null
    @slug = (slug @cliente).toLowerCase()
    @file = "#{APACHE}#{@slug}#{SUFIX}"

  install: () ->
    cod = @cod
    slug = @slug
    file = @file
    return checkFile(file).then(
      () ->
        return 'Esse cliente já exite.'
      (err) ->
        r =
          'cliente': slug
          'codigo' : cod

        templateFile = path.join __dirname, '../template'
        template = fs.readFileSync(templateFile).toString()
        content = template.replace /\{(.*?)\}/g, (a, b) ->
          return r[b]

        return writeFile(file, content).then(
          () ->
            return 'Cliente criado.'
          (err) ->
            return 'Falha ao criar o arquivo.'
        )
    )

  rm: () ->
    file = @file
    return checkFile(@file).then(
      (stats) ->
        return rmFile(file).then(
          () ->
            return 'Cliente removido.'
          (err) ->
            return 'Não exite esse cliente ou já foi removido.'
        )
      (err) ->
        return 'Não exite esse cliente ou já foi removido.'
    )

module.exports = Core
