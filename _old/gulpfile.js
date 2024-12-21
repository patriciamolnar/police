const gulp = require('gulp');
const sass = require('gulp-sass');
const minify = require('gulp-minify');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

//copy html 
function copyHTML() {
  return gulp.src('src/*.html')
  .pipe(gulp.dest('./'));
}

//copy images
function copyImg() {
  return gulp.src('src/*.png')
  .pipe(gulp.dest('./'));
}

//compile scss into css
function changeCSS() {
  var plugins = [
      autoprefixer({overrideBrowserslist: ['>1%', 'last 4 versions', 'Firefox ESR', 'not ie < 9']}),
      cssnano()
  ];

  return gulp.src('src/scss/*.scss')
      .pipe(sass())
      .pipe(postcss(plugins))
      .pipe(gulp.dest('./'));
}

//minimise JS file
function compressJS() {
  return gulp.src('src/js/*.js')
  .pipe(minify())
  .pipe(gulp.dest('./'));
}

function watchTask() {
  gulp.watch(['src/scss/*.scss']).on('change', changeCSS);
  gulp.watch(['*.html']).on('change', copyHTML);
  gulp.watch(['src/js/*.js']).on('change', compressJS);
}

exports.copyHTML = copyHTML;
exports.copyImg = copyImg; 
exports.changeCSS = changeCSS;
exports.compressJS = compressJS;
exports.default = watchTask;

