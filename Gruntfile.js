'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			gruntfile: {
				src: 'Gruntfile.js'
			},
			lib: {
				src: ['lib/**/*.js']
			},
			test: {
				src: ['test/**/*.js']
			},
		},
		watch: {
			gruntfile: {
				files: '<%= jshint.gruntfile.src %>',
				tasks: ['jshint:gruntfile']
			},
			lib: {
				files: '<%= jshint.lib.src %>',
				tasks: ['jshint:lib']
			},
			test: {
				files: '<%= jshint.test.src %>',
				tasks: ['jshint:test']
			}
		},
		/*exec: {
			zuul: {
				cmd: './node_modules/zuul/bin/zuul --local 8080 --ui mocha-bdd -- test/client.js'
			}
		}*/
		karma: {
			unit: {
				configFile: 'karma.conf.js'
			}
		}
	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-karma');
	//grunt.loadNpmTasks('grunt-exec');
	
	grunt.registerTask('default', ['jshint']);
	//grunt.registerTask('test', ['jshint', 'exec:zuul']);
	grunt.registerTask('test', ['jshint', 'karma:unit']);
};
