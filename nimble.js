'use strict';
var core, getCode, getDelete, inquirer, noArgs, program, run;
program = require('commander');
inquirer = require('inquirer');
core = require('./lib/core');
getCode = function (cliente) {
  return {
    type: 'input',
    name: 'cod',
    message: 'Qual \xE9 o c\xF3digo do cliente (' + cliente + ')?',
    validate: function (v) {
      var pass;
      pass = /^\d+$/.test(v);
      if (pass) {
        return true;
      } else {
        return 'Digite um c\xF3digo v\xE1lido';
      }
    }
  };
};
getDelete = function (cliente) {
  return {
    type: 'confirm',
    name: 'rm',
    message: 'Deseja remover o cliente (' + cliente + ')?',
    'default': true
  };
};
run = function (cmd, cliente, cod) {
  cod = cod || null;
  core(cliente, cod)[cmd]().then(function (msg) {
    return console.log(msg);
  }, function (err) {
    return console.log(err);
  });
};
program.version('0.1.0');
program.command('instala <cliente>').alias('i').description('Instala uma nova inst\xE2ncia do Nimble').option('-c, --codigo <codigo>', 'C\xF3digo do cliente', parseInt, 0).action(function (cliente, opts) {
  if (opts.codigo === 0) {
    inquirer.prompt(getCode(cliente), function (res) {
      run('install', cliente, res.cod);
    });
  } else {
    run('install', cliente, opts.codigo);
  }
});
program.command('remove <cliente>').alias('rm').description('Remove uma inst\xE2ncia do Nimble').action(function (cliente) {
  inquirer.prompt(getDelete(cliente), function (res) {
    if (res.rm) {
      run('rm', cliente);
    }
  });
});
program.parse(process.argv);
noArgs = program.args;
if (!noArgs.length) {
  program.help();
}