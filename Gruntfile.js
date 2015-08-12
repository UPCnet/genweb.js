// Generated on 2015-01-23 using generator-angular 0.10.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Configurable paths for the application
  var appConfig = {
    app: require('./bower.json').appPath || 'app',
    dist: '../genweb.cdn/genweb/cdn/dist',
    egg: 'genweb/js'
  };

  var config_file = 'config.json';
  var resource_config = grunt.file.readJSON(config_file);
  var uglify_options = {
      sourceMap: true,
      banner: '/*! <%= uglify.pkg.name %> - v<%= uglify.pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %> */'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: appConfig,

    replace: {
      build: {
        src: ['<%= yeoman.egg %>/browser/viewlets_templates/gwjsdevelviewlet.pt'],
        dest: '<%= yeoman.egg %>/browser/viewlets_templates/gwjsproductionviewlet.pt',
        replacements: [{
          from: 'tal:attributes="src string:${portal_url}/++genweb++static',
          to: 'src="../genweb.core/genweb/core/static'
        },
        {
          from: 'tal:attributes="src string:${portal_url}/++components++root',
          to: 'src="genweb/js/components'
        },
        {
          from: 'tal:attributes="src string:${portal_url}/++genweb++js',
          to: 'src="genweb/js/legacy'
        },
        {
          from: 'condition="viewlet/is_devel_mode"',
          to: 'condition="not: viewlet/is_devel_mode"'
        },
        ]
      },
      postbuild: {
        src: ['<%= yeoman.egg %>/browser/viewlets_templates/gwjsproductionviewlet.pt'],
        overwrite: true,
        replacements: [{
          from: 'src="js',
          to: 'tal:attributes="src string:${portal_url}/++genweb++dist/js'
        },
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        options: {force: true},
        files: [{
          dot: true,
          src: [
            '.tmp',
            // '<%= yeoman.dist %>/{,*/}*',
            '<%= yeoman.dist %>/genweb.{,*}*.js',
            '!<%= yeoman.dist %>/.git{,*/}*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Renames files for browser caching purposes
    filerev: {
      dist: {
        src: [
          '<%= yeoman.dist %>/scripts/{,*/}*.js',
          '<%= yeoman.dist %>/styles/{,*/}*.css',
          '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          '<%= yeoman.dist %>/styles/fonts/*'
        ]
      },
      build: {
        src: [
          '<%= yeoman.dist %>/genweb.js',
        ]
      }
    },

    // ng-annotate tries to make the code safe for minification automatically
    // by using the Angular long form for dependency injection.
    uglify: {
      pkg: grunt.file.readJSON('package.json'),
      main: {
         options: uglify_options,
         files: {
          '<%= yeoman.dist %>/genweb.js': '.tmp/genweb.js'
        }
      }
    },

    concat: {
      options: {},
      dist: { files: {'.tmp/genweb.js': resource_config.resources.genweb.js.development }},
    },

    ngAnnotate: {
      options: {
          ngAnnotateOptions: {}
      },
      // dist: { files: {'.tmp/vendor.js': resource_config.resources.common.js.development }},
    },

    // Copies remaining files to places other tasks can use
    copy: {
      build: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        },
        ]
      },
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/{,*/}*.*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: 'bower_components/bootstrap/dist',
          src: 'fonts/*',
          dest: '<%= yeoman.dist %>'
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

  });

  grunt.registerTask('updateconfig', function () {
    if (!grunt.file.exists(config_file)) {
        grunt.log.error('file ' + config_file + ' not found');
        return true; //return false to abort the execution
    }

    resource_config.revision_info = grunt.filerev.summary; //edit the value of json object, you can also use projec.key if you know what you are updating

    grunt.file.write(config_file, JSON.stringify(resource_config, null, 2)); //serialize it back to file

  });

  grunt.registerTask('gwbuild', [
    'clean:dist',
    'concat',
    // 'ngAnnotate',
    'uglify',
    'filerev:build',
    'updateconfig'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
