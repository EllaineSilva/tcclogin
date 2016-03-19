var gulp = require('gulp'),
    browser = require('browser-sync'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    concatFiles = require('gulp-concat'),
    ngAnnotate = require('gulp-ng-annotate'),
    minifyCss = require('gulp-cssnano');

gulp.task('scripts', function () {
    gulp.src('js/app/*.js')
        .pipe(concatFiles('bundle.js'))
        .pipe(uglify())
        .pipe(ngAnnotate())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('js/'));
});

gulp.task('styles', function () {
    gulp.src('css/app/*.css')
        .pipe(concatFiles('bundle.css'))
        .pipe(minifyCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('css/'));
});

gulp.task('stylesPrint', function () {
    gulp.src('css/app/print/*.css')
        .pipe(concatFiles('bundlePrint.css'))
        .pipe(minifyCss())
        .pipe(rename({extname: '.min.css'}))
        .pipe(gulp.dest('css/'));
});

gulp.task('browser', function () {
    browser.init({
        proxy: 'localhost/login' //TROCAR PARA A PASTA DO PROJETO ATUAL
    });
    gulp.watch('partials/*.html').on('change', browser.reload);
    gulp.watch('js/*.min.js').on('change', browser.reload);
    gulp.watch('css/*.min.css').on('change', browser.reload);
});

gulp.task('library', function () {
    gulp.src(['js/libs/angular/angular.js', 'js/libs/angular-ui-router/angular-ui-router.js', 'js/libs/angular-resource/angular-resource.js', 'js/libs/angular-cookies/angular-cookies.js', 'bower_components/angular-i18n/angular-locale_pt-br.js'])
        .pipe(concatFiles('library.js'))
        .pipe(uglify())
        .pipe(ngAnnotate())
        .pipe(rename({extname: '.min.js'}))
        .pipe(gulp.dest('js/'));
});

gulp.task('default', ['library', 'scripts', 'styles', 'browser'], function () {
    gulp.watch('js/app/*.js', ['scripts']);
    gulp.watch('css/app/*.css', ['styles']);
//    gulp.watch('css/app/print/*.css', ['stylesPrint']); //DESCOMENTAR CASO TENHA STYLES PARA IMPRESSÃO
});