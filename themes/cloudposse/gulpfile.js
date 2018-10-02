"use strict";

var gulp        = require("gulp"),
  sass          = require("gulp-sass"),
  concat        = require('gulp-concat'),
  cssnano       = require('gulp-cssnano'),
  autoprefixer   = require('gulp-autoprefixer'),
  importer      = require('node-sass-globbing'),
  webpack       = require('webpack'),
  webpackStream = require('webpack-stream'),
  env           = process.env.NODE_ENV || 'production';


var sass_config = {
  importer: importer,
  includePaths: [
    'node_modules/breakpoint-sass/stylesheets/',
    'node_modules/@fortawesome/',
    '../hugo-theme-docdock/static/scss/',
    'node_modules/instantsearch.js/',
    'node_modules/featherlight/src/'
  ]
};

var cssSources = [
  'src/scss/styles.scss',
]

// Compile SASS files
gulp.task("sass", function(cb) {
  gulp.src(cssSources)
      .pipe(sass(sass_config).on('error', sass.logError))
      .pipe(concat('styles.css'))
      .pipe(autoprefixer({
          browsers: ['last 2 versions'],
          cascade: false
      }))
      .pipe(cssnano())
      .pipe(gulp.dest("static/css/"));
  cb();
});

gulp.task("scripts", function () {
  return webpackStream(require('./webpack.config.js'))
    .pipe(gulp.dest('./static/js/'));    
});

gulp.task('fonts', function () {
  return gulp.src([
      './node_modules/@fortawesome/fontawesome-free/webfonts/*'
    ])
    .pipe(gulp.dest('../../static/webfonts'));
});

// Copy css to static dir.
gulp.task("copy", function(cb) {
  return gulp.src("static/css/**/*.css")
    .pipe(gulp.dest("../../static/css"));
});

// Copy css to static dir.
gulp.task("copy-js", function(cb) {
  gulp.src(["static/js/**/*.js"])
      .pipe(gulp.dest("../../static/js"));
  cb()
});

// Watch task for dedelopment.
gulp.task("watch", function() {
  gulp.watch(["src/scss/**/*.scss", "static/js/**/*.js"], gulp.series("sass", "copy", "copy-js"));
});


gulp.task("default", gulp.series("sass", "scripts", "copy", "copy-js", "fonts"));
