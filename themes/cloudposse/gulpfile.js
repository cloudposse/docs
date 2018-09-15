"use strict";

var gulp = require("gulp"),
  sass = require("gulp-sass"),
  concat = require('gulp-concat'),
  autoprefixer = require('gulp-autoprefixer'),
  importer = require('node-sass-globbing'),
  webpack = require('webpack-stream');


var sass_config = {
  importer: importer,
  includePaths: [
    'node_modules/breakpoint-sass/stylesheets/'
  ]
};

// Compile SASS files
gulp.task("sass", function(cb) {
  gulp.src("src/scss/styles.scss")
      .pipe(sass(sass_config).on('error', sass.logError))
      .pipe(concat('styles.css'))
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(gulp.dest("static/css/"));
  cb();
});

gulp.task('scripts', function () {
  return gulp.src('./src/js/app.js')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('./static/js/'));
});


// Copy css to static dir.
gulp.task("copy", function(cb) {
  gulp.src("static/css/**/*.css")
      .pipe(gulp.dest("../../static/css"));
  cb()
});

// Copy css to static dir.
gulp.task("copy-js", function(cb) {
  gulp.src("static/js/**/*.js")
      .pipe(gulp.dest("../../static/js"));
  cb()
});

// Watch task for dedelopment.
gulp.task("watch", function() {
  gulp.watch(["src/scss/**/*.scss", "static/js/**/*.js"], gulp.series("sass", "copy", "copy-js"));
});


gulp.task("default", gulp.series("sass", "copy"));
