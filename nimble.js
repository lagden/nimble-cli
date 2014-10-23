'use strict';
var core, inquirer, noArgs, program;

program = require('commander');

inquirer = require('inquirer');

core = require('./lib/core');

program.version('0.1.0');

program.command('instala <cliente>').alias('i').description('Instala uma nova instância do Nimble').option('-c, --codigo <codigo>', 'Código do cliente', parseInt, 0).action(function(cliente, opts) {
  var question;
  if (opts.codigo === 0) {
    question = {
      type: 'input',
      name: 'cod',
      message: 'Qual é o código do cliente (' + cliente + ')?',
      validate: function(v) {
        var pass;
        pass = /^\d+$/.test(v);
        if (pass) {
          return true;
        } else {
          return 'Digite um código válido';
        }
      }
    };
    inquirer.prompt(question, function(res) {
      core(cliente, res.cod).install();
    });
  } else {
    core(cliente, opts.codigo).install();
  }
});

program.command('remove <cliente>').alias('rm').description('Remove uma instância do Nimble').action(function(cliente) {
  console.log(cliente);
});

program.parse(process.argv);

noArgs = program.args;

if (!noArgs.length) {
  program.help();
}
