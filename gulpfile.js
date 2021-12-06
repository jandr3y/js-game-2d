const { dest, src, watch, series } = require('gulp');
const minify = require('gulp-minify');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const uglify = require('gulp-uglify');
const template = require('gulp-template');

const BUILD_PATH = './src/server/client';
const SRC_PATH = 'src/server/client-dev';

const buildVersion = 'g-' + (new Date()).getTime();

function cleaner(cb) {
  src([
    'src/server/client'
  ], { read: false, allowEmpty: true })
  .pipe(clean());

  cb()
}

function buildJS(cb) {

  src([
    SRC_PATH + '/common.js',
    SRC_PATH + '/engine/Game.js',
    SRC_PATH + '/engine/Camera.js',
    SRC_PATH + '/engine/Map.js',
    SRC_PATH + '/engine/Keyboard.js',
    SRC_PATH + '/engine/Player.js',
    SRC_PATH + '/script.js',
  ])
  .pipe(concat(buildVersion + '.js'))
  .pipe(uglify())
  .pipe(minify())
  .pipe(dest(BUILD_PATH));

  cb();
}

function buildAssets(cb) {
  src([
    SRC_PATH + '/assets/map_one.json',
    SRC_PATH + '/assets/map_two.json',
    SRC_PATH + '/assets/tileset.png',
    SRC_PATH + '/assets/base_out_atlas.png',
    SRC_PATH + '/assets/person.png',
  ])
  .pipe(dest(BUILD_PATH + '/assets'));

  cb();
}

function buildHTML(cb) {
  src([
    SRC_PATH + '/index.html'
  ])
  .pipe(template({ filename: buildVersion }))
  .pipe(dest(BUILD_PATH))

  cb();
}

function buildCSS(cb) {
  src([
    SRC_PATH + '/style.css'
  ]).pipe(dest(BUILD_PATH));

  cb();
}

function development(cb) {
  watch([
    SRC_PATH
  ], series(cleaner, buildJS, buildCSS, buildAssets, buildHTML));

  cb();
}

exports.clean = cleaner;

exports.build = series(cleaner, buildJS, buildCSS, buildAssets, buildHTML);

exports.watch = development;