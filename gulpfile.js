'use strict';

var cache = require('gulp-cached');
var clean = require('gulp-clean');
var gulp = require('gulp');
var gutil = require('gulp-util');
var htmlhint = require("gulp-htmlhint");
var sass = require('gulp-sass');
var sasslint = require('gulp-sass-lint');
var ts = require('gulp-typescript');
var typescript = require('typescript');
var tslint = require('gulp-tslint');

gulp.task('default', ['clean', 'build', 'watch']);

gulp.task('build', ['res:copy', 'html:copy', 'js:build', 'css:build']);

gulp.task('clean', ['clean:dist']);

gulp.task('css:build', ['scss:lint'], function () {
    return gulp.src('./app/**/*.scss')
        .pipe(sass({ outputStyle: 'compressed' })
            .on('error', sass.logError))
        .pipe(gulp.dest('./dist/app')
            .on('error', gutil.log));
});

gulp.task('js:build', ['ts:lint'], function () {
    var tsProject = ts.createProject('./tsconfig.json', {
        typescript: typescript
    });

    return gulp.src('./app/**/*.ts')
        .pipe(tsProject().on('error', gutil.log))
        .pipe(gulp.dest('./dist/app'));
});

gulp.task('html:copy', function () {
    return gulp.src('./app/**/*.html')
        .pipe(gulp.dest('./dist/app')
            .on('error', gutil.log));

});

gulp.task('res:copy', function () {
    return gulp.src([
        './index.html',
        './systemjs.config.js',
        './systemjs.config.extras.js'
    ]).pipe(gulp.dest('./dist')
        .on('error', gutil.log));

});

gulp.task('watch', ['build'], function() {
    gulp.watch('./app/**/*.html', ['html:copy']);
    gulp.watch('./app/**/*.scss', ['css:build']);
    gulp.watch('./app/**/*.ts', ['js:build']);
});

gulp.task('clean:dist', function () {
    return gulp.src('./dist/**/*.*', { read: false })
        .pipe(clean({ force: true }));
});

gulp.task('ts:lint', function() {
    return gulp.src('./app/**/*.ts')
        .pipe(cache('tslint'))
        .pipe(tslint())
        .pipe(tslint.report('prose'));
});

gulp.task('scss:lint', function() {
    return gulp.src('./app/**/*.scss')
        .pipe(cache('sasslint'))
        .pipe(sasslint())
        .pipe(sasslint.format())
        .pipe(sasslint.failOnError())
});

gulp.task('html:hint', function () {
    return gulp.src("./app/**/*.html")
        .pipe(htmlhint())
        .pipe(htmlhint.reporter());
});
