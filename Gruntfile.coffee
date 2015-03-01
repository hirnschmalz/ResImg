module.exports = (grunt) ->
  path = require('path')

  # Project configuration.
  grunt.initConfig
    coffee:
      resimg:
        files:
          'dist/ResImg.js': 'src/ResImg.coffee'

    jshint:
      resimg:
        files:
          src: ['dist/ResImg.js']
  #      options:
  #        'curly': true
  #        'immed': true
  #        'latedef': true
  #        'newcap': true
  #        'noarg': true
  #        'undef': true
  #        'boss': true
  #        'eqnull': true
  #        'node': true
  #        'es5': true
  #        'trailing': true
  #        'smarttabs': true

    uglify:
#      options:
#        compress: false
#        beautify: true
      resimg:
        files:
          'dist/ResImg.min.js': 'dist/ResImg.js'

    copy:
      resimg:
        expand: true
        cwd: 'dist/'
        src: 'ResImg.min.js'
        dest: 'demo/js/'
        flatten: true

  # Define all the task for 'watch'
    watch:
      coffee:
        files: 'src/*.coffee'
        tasks: ['compile']

  # These plugins provide necessary tasks.
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-copy'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Default task.
  #grunt.registerTask 'compile', ['coffee', 'jshint', 'uglify', 'copy']
  grunt.registerTask 'compile', ['coffee', 'uglify', 'copy']
