'use strict'

APACHE  = '/etc/apache2/sites-available/'
SUFIX   = '.nimble.com.br.conf'

fs      = require 'fs'
path    = require 'path'
slug    = require 'slug'
Q       = require 'q'

checkFile = (cliente) ->
  file = "#{APACHE}#{cliente}#{SUFIX}"
  deferred = Q.defer()
  fs.stat file, (err, stats) ->
    if err
      deferred.reject err
    else
      deferred.resolve file
    return
  return deferred.promise

writeFile = (file, content) ->
  deferred = Q.defer()
  fs.writeFile file, content, (err) ->
    if err
      deferred.reject err
    else
      deferred.resolve()
    return
  return deferred.promise

rmFile = (file, content) ->
  deferred = Q.defer()
  fs.unlink file, (err) ->
    if err
      deferred.reject err
    else
      deferred.resolve()
    return
  return deferred.promise

class Core
  constructor: (cliente, cod) ->
    return new Core cliente, cod if (@ instanceof Core) is false
    @cliente = cliente
    @cod = cod || null

  install: () ->
    cod = @cod
    cliente = (slug @cliente).toLowerCase()
    return checkFile(cliente).then(
      () ->
        return 'Esse cliente já exite.'

      (err) ->
        r =
          'cliente': cliente
          'codigo' : cod

        templateFile = path.join __dirname, '../template'
        template = fs.readFileSync(templateFile).toString()
        content = template.replace /\{(.*?)\}/g, (a, b) ->
          return r[b]

        return writeFile(err.path, content).then(
          () ->
            return 'Cliente criado.'

          (err) ->
            return 'Falha ao criar o arquivo.'
        )
    )

  rm: () ->
    cliente = (slug @cliente).toLowerCase()
    return checkFile(cliente).then(
      (file) ->
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
