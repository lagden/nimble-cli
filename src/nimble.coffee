'use strict'

program = require 'commander'
inquirer = require 'inquirer'

core = require './lib/core'

getCode = (cliente) ->
  type: 'input'
  name: 'cod'
  message: "Qual é o código do cliente (#{cliente})?"
  validate: (v) ->
    pass = /^\d+$/.test v
    return if pass then true else 'Digite um código válido'

getDelete = (cliente) ->
  type: 'confirm'
  name: 'rm'
  message: "Deseja remover o cliente (#{cliente})?"
  default: true

run = (cmd, cliente, cod) ->
  cod = cod || null
  core(cliente, cod)[cmd]().then(
    (msg) ->
      console.log msg
    (err) ->
      console.log err
  )
  return

program
  .version '0.1.0'

program
  .command 'instala <cliente>'
  .alias('i')
  .description 'Instala uma nova instância do Nimble'
  .option '-c, --codigo <codigo>', 'Código do cliente', parseInt, 0
  .action (cliente, opts) ->
    if opts.codigo == 0
      inquirer.prompt getCode(cliente), (res) ->
        run 'install', cliente, res.cod
        return
    else
      run 'install', cliente, opts.codigo
    return

program
  .command 'remove <cliente>'
  .alias('rm')
  .description 'Remove uma instância do Nimble'
  .action (cliente) ->
    inquirer.prompt getDelete(cliente), (res) ->
      run 'rm', cliente if res.rm
      return
    return

program.parse process.argv

noArgs = program.args
program.help() if !noArgs.length