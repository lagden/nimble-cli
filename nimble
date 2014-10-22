#!/usr/bin/env coffee

program = require 'commander'
inquirer = require 'inquirer'

program
  .version '0.1.0'

program
  .command 'cria <cliente>'
  .description 'Cria uma nova instância do Nimble'
  .option '-c, --codigo <codigo>', 'Código do cliente', parseInt, 0
  .action (cliente, opts) ->
    if opts.codigo == 0
      question =
        type: 'input',
        name: 'cod',
        message: 'Qual é o código do cliente (' + cliente + ')?'
        validate: (v) ->
          pass = /^\d+$/.test v
          return if pass then true else 'Digite um código válido'
      inquirer.prompt question, (res) ->
        opts.codigo = res.cod
        console.log cliente, opts.codigo
    return

program
  .command 'remove <cliente>'
  .alias('rm')
  .description 'Remove uma instância do Nimble'
  .action (cliente) ->
    console.log cliente
    return

program.parse process.argv

noArgs = program.args
program.help() if !noArgs.length