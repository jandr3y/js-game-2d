const { dest, src, watch, series } = require('gulp');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const template = require('gulp-template');

const buildVersion = 'g-' + (new Date()).getTime();

function cleaner(cb) {
  src([
    'dist'
  ], { read: false, allowEmpty: true })
  .pipe(clean());

  cb()
}

function buildJS(cb) {

  src([
    'src/client/common.js',
    'src/client/engine/Game.js',
    'src/client/engine/Camera.js',
    'src/client/engine/Map.js',
    'src/client/engine/Keyboard.js',
    'src/client/engine/Player.js',
    'src/client/script.js',
  ])
  .pipe(concat(buildVersion + '.js'))
  .pipe(uglify())
  .pipe(minify())
  .pipe(dest('./dist/client'));

  cb();
}

function buildAssets(cb) {
  src([
    'src/client/assets/map_one.json',
    'src/client/assets/tileset.png',
    'src/client/assets/person.png',
  ])
  .pipe(dest('./dist/client/assets'));

  cb();
}

function buildHTML(cb) {
  src([
    'src/client/index.html'
  ])
  .pipe(template({ filename: buildVersion }))
  .pipe(dest('./dist/client'))

  cb();
}

function buildCSS(cb) {
  src([
    'src/client/style.css'
  ]).pipe(dest('./dist/client'));

  cb();
}

exports.clean = cleaner;

exports.build = series(cleaner, buildJS, buildCSS, buildAssets, buildHTML);