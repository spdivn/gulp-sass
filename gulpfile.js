'use strict';

const { src, dest, parallel, series, watch } = require('gulp');

const autoPrefixer          = require('gulp-autoprefixer');
const cleanCSS              = require('gulp-clean-css');
const rename                = require('gulp-rename');
const sass                  = require('gulp-sass');
const requiredNodeVersion   = 12;
const paths                 = {
    sass: './src/scss/styles.scss',
    compiled: '../web/css'
};

function checkNodeVersion() {
    let node = process.versions.node,
        nodeVersionString = node.split('.')[0],
        nodeVersion = Number(nodeVersionString);

    if (nodeVersion < requiredNodeVersion) {
        throw 'Update nodejs to 12.x';
    };
};

function sassStyle() {
    src(paths.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoPrefixer({
        cascade: false
    }))
    .pipe(rename({
        basename: "styles.min",
    }))
    .pipe(cleanCSS({compatibility: "last 10 version"}))
    .pipe(dest(paths.compiled));
    console.log("Generated: styles.min.css", "Generated: styles.css");

    return src(paths.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoPrefixer({
            cascade: false
        }))
        .pipe(rename({
            basename: "styles",
        }))
        .pipe(dest(paths.compiled));
};

function sassPrint() {
    return src('./src/scss/print.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(dest('../web/css/vendor'));
};

function watchFiles() {
    watch(['./src/scss/**/*.scss'], parallel(sassStyle, sassPrint));
    console.log("Watch:active for src/scss")
};

checkNodeVersion();
exports.sass = sassStyle;
exports.print = sassPrint;
exports.default = series(sassStyle, sassPrint, watchFiles);
exports.watch = watchFiles;