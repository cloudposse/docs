"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var concat = require('gulp-concat');
var autoprefixer = require('gulp-autoprefixer');
  
// Compile SASS files
gulp.task("sass", function() {
  gulp.src("src/scss/styles.scss")
      .pipe(sass().on('error', sass.logError))
      .pipe(concat('styles.css'))
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(gulp.dest("static/css/"))
});

// Copy css to static dir.
gulp.task("copy", function() {
  gulp.src("static/css/**/*.css")
      .pipe(gulp.dest("../../static/css"))
});

// Watch task for dedelopment.
gulp.task("watch", ["sass", "copy"], function() {
  gulp.watch("src/scss/**/*.scss", ["sass", "copy"]);
});


gulp.task("default", ["sass", "copy"]);
