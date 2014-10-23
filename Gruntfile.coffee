'use strict'

module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig

    coffeelint:
      files: ['src/{,*/}*.coffee']

    coffee:
      compile:
        options:
          bare: true
        files: [
          expand: true
          flatten: false
          cwd: 'src'
          src: ['{,*/}*.coffee']
          dest: './'
          ext: '.js'
        ]

    fixmyjs:
      options:
        jshintrc: '.jshintrc'
        indentpref: 'spaces'
      fix:
        files: [
          expand: true
          cwd: './'
          src: ['{,*/}*.js', '!node_modules']
          dest: './'
          ext: '.js'
        ]

  grunt.registerTask 'default', [
    'coffeelint'
    'coffee'
    'fixmyjs'
  ]

  return
