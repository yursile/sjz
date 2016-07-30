'use strict'

var lessBinDebugOpts = {
        sourceMap: true,
        sourceMapRootpath: '../../'
    },
    debug = {env: 'debug'}

module.exports = function(grunt){
    grunt.initConfig({
        clean: {
            options:{
                force: true
            },
            src: ['src'],
            dist: ['dist']
        },

        uglify:{
            options: {
                mangle: true, //不混淆变量名
                preserveComments: false, //不删除注释，还可以为 false（删除全部注释），some（保留@preserve @license @cc_on等注释）
                footer:'\n/*!  最后修改于： <%= grunt.template.today("yyyy-mm-dd") %> */'//添加footer
            },
            dist:{
                files:[
                    {
                        expand:true,
                        cwd:"src/js/",
                        src:['*.js'],
                        dest:"dist/js/",
                        ext:'.min.js'
                    }
                ] 
            }, 
        },
       
        less: {
            options:{
                // paths: 'src/less',
                relativeUrls: true
            },
            dist:{  
                files:[
                    {
                        expand:true,
                        cwd:"src/less/",
                        src:['*.less'],
                        dest:"build/css/",
                        ext:'.css'
                    }
                ] 

            }
        },

        autoprefixer : {
            options:{
                // paths: 'src/less',
                  browsers: ['last 2 versions', 'ie 8', 'ie 9'],

                relativeUrls: true
            },
            dist : {
                files : [
                    {   
                        expand:true,
                        cwd:"build/css/",
                        src:['*.css'],
                        dest:"dist/css/",
                        ext:'.css'
                    }
                ] 
            } 
        },

        htmlmin:{
            options: {
                cssmin: true,
                jsmin: true,
                removeComments: true,
                removeCommentsFromCDATA: true,
                collapseWhitespace: true,
                collapseBooleanAttributes: true,
                removeAttributeQuotes: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeOptionalTags: true
            },
            html: {
                files: [
                  {expand: true, cwd: 'src/', src: ['*.html'], dest: 'dist',ext:".html"}
               ]
            }
        },
        cssmin: {
          prod: {
             options: {
               report: 'gzip'
             },
             files: [{
                 expand: true,
                 cwd: 'dist/',
                 src: ['css/*.css'],
                 dest: 'dist',
                 ext:".min.css"
                }
             ]
          }
        },

        concat: {
            options: {
              separator: ';',
            },
            dist: {
              src: ['src/js/*.js'],
              dest: 'src/js/built.js',
            }
        },

        watch: {     
            less: {  
                files: ["src/less/*.less"],  
                tasks: ['less:dist'],  
                options: {  
                    debounceDelay: 250  
                }  
            },
            htmlmin:{
                files:"src/*.html",
                tasks:['htmlmin:html'],
                options: {  
                    debounceDelay: 250  
                } 
            },
            uglify:{
                files:["src/js/*.js"],
                tasks:["uglify"]
            },

            autoprefixer:{
                files:['build/css/*.css'],
                tasks:["autoprefixer:dist"],
                options: {  
                    debounceDelay: 250  
                } 
            },
            cssmin:{
                files:['dist/css/*.css'],
                tasks:["cssmin"],
                options: {  
                    debounceDelay: 250  
                }  
            }  
        } 

    });

    grunt.loadNpmTasks('grunt-contrib-less')
    grunt.loadNpmTasks('grunt-contrib-copy')
    grunt.loadNpmTasks('grunt-contrib-clean')
    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.loadNpmTasks('grunt-contrib-htmlmin')
    grunt.loadNpmTasks('grunt-contrib-concat')
    grunt.loadNpmTasks('grunt-contrib-cssmin')
    grunt.loadNpmTasks('grunt-contrib-uglify')
    grunt.loadNpmTasks('grunt-autoprefixer')
    var task = function(){
        var name = this.name
            , tasks = ['clean', 'copy', 'less','uglify','concat','autoprefixer']
            , targets = tasks.map(function(v, i, m){
                var target = name === 'debug' && v !== 'less' ? 'bin' : name
                return v + ':' + target
            })
        grunt.task.run(targets)
    }
    grunt.registerTask('bin', task)
    grunt.registerTask('debug', task)
    grunt.registerTask('dist', task)
    // grunt.registerTask('concat', task)
    grunt.registerTask('min', ['uglify:dist']);
    grunt.registerTask('default',['less','autoprefixer','cssmin','htmlmin','uglify','watch']);
}