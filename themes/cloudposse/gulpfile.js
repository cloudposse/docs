"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
var importer = require('node-sass-globbing');


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

// Copy css to static dir.
gulp.task("copy", function(cb) {
  gulp.src("static/css/**/*.css")
      .pipe(gulp.dest("../../static/css"));
  cb()
});

// Watch task for dedelopment.
gulp.task("watch", gulp.series("sass", "copy"), function() {
  gulp.watch("src/scss/**/*.scss", gulp.series("sass", "copy"));
});


gulp.task("default", gulp.series("sass", "copy"));
