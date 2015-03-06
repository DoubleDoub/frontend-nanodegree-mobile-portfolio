module.exports = function (grunt) {
"use strict";
grunt.initConfig({
    clean : {
        dist : ['dist'],
        tmp : ['tmp']
    },
    // resize images
    responsive_images : {
        options: {
            // use Image Magick as engine
            engine: 'im',
            overwrite: true
        },
        // jpg: {
        //     // not selecting any files right now pizzeria.jpg is excluded
        //     files : [{
        //         expand : true,
        //         cwd : 'src/views/images',
        //         src : ['*.jpg', '!pizzeria.jpg'],
        //         dest : 'tmp/views/images'
        //     }]
        // },
        // png: {
        //     // not selecting any files right now pizza.png is excluded
        //     files : [{
        //         expand : true,
        //         cwd : 'src/views/images',
        //         src : ['*.png', '!pizza.png'],
        //         dest : 'tmp/views/images'
        //     }]
        // },
        // target individual images
        other : {
            options: {
                sizes: [
                    {'name': 'large','width':'720px', 'height' : '540px'},
                    {'name': 'thumbnail','width':'100px'}
                    ]
            },
            files :{
                'tmp/views/images/pizzeria.jpg' : 'src/views/images/pizzeria.jpg',
            }
        }
    },
    // optimize images
    imagemin : {
        jpg : {
            options : {
                optimizationLevel: 3
            },
            files : [{
                //Pizza view images
                expand : true,
                cwd : 'tmp/views/images',
                src : ['*.jpg'],
                dest : 'dist/views/images'
            },
            {   // root images
                expand : true,
                cwd : 'src/img',
                src : ['*.{jpg,png}'],
                dest : 'dist/img'
            }]
        },
        png: {
            options: {
                optimizationLevel: 3
            },
            files: [{
                //root images
                expand: true,
                cwd: 'tmp/img',
                src: ['**/*.png'],
                dest: 'dist/img'
            },
            {   //Pizza view images
                expand : true,
                cwd : 'tmp/views/images',
                src : ['*.png'],
                dest : 'dist/views/images'
            }]
        }
    },
    cssmin : {
        files : {
            expand : true,
            cwd : 'src/css',
            src : '*.css',
            dest : 'tmp/css'
        }
    },
    inline : {
        //inline css in index.html
        index : {
            src: 'tmp/index.html',
            dest : 'dist/index.html'
        }
    },
    copy : {
        // copy files to tmp folder
        indexToTmp : {
            files : { 'tmp/index.html' : 'src/index.html'}
        },
        // copy remaining root files to dist
        rootToDist : {
            files : [{
                expand : true,
                cwd : 'src',
                src : ['*.html', '!index.html'],
                dest : "dist"
            }]
        },
        // copy remaining tmp files to dist
        tpmToDist : {
            files : [{
                expand : true,
                cwd : 'tmp/css',
                src : ['print.css', '!style.css'],
                dest : 'dist/css'

            }]
        },
        pizza : {
            // copy remaining views files to dist
            files :[{
                expand : true,
                cwd : 'src/views/',
                src : ['**/*', '!images/pizzeria.jpg'],
                dest: 'dist/views'

            }]
        }
    },
    uglify : {
        scripts : {
            files : { 'dist/js/perfmatters.js' : 'src/js/perfmatters.js'}
        }
    }
});

grunt.registerTask('inlineCss', function(){
    //make sure cssmin and copy tasks did run or not minified css file will be
    // inlined 
    this.requires('cssmin');
    this.requires('copy:indexToTmp');
    grunt.task.run('inline:index');
});
//https://github.com/gruntjs/grunt-contrib-imagemin
grunt.loadNpmTasks('grunt-contrib-imagemin');
//https://github.com/gruntjs/grunt-contrib-clean
grunt.loadNpmTasks('grunt-contrib-clean');
// https://www.npmjs.com/package/grunt-responsive-images
grunt.loadNpmTasks('grunt-responsive-images');
//https://github.com/gruntjs/grunt-contrib-cssmin
grunt.loadNpmTasks('grunt-contrib-cssmin');
// https://github.com/chyingp/grunt-inline
grunt.loadNpmTasks('grunt-inline');
//https://github.com/gruntjs/grunt-contrib-copy
grunt.loadNpmTasks('grunt-contrib-copy');
// https://github.com/gruntjs/grunt-contrib-uglify
grunt.loadNpmTasks('grunt-contrib-uglify');


grunt.registerTask('default', ['clean','responsive_images','imagemin', 'cssmin', 'copy', 'inlineCss','uglify', 'clean:tmp']);
};