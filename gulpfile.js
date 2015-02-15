var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
    deploy = require('gulp-gh-pages');

var DEPLOY_OPTIONS = {
    remoteUrl: 'git@github.com:twsgawayday/twsgawayday.github.io.git',
    branch: 'master'
};

gulp.task('clean', function (cb) {
    return gulp.src('./build/**/*', { read: false })
        .pipe(rimraf());
});

gulp.task('css', function () {
    gulp.src('*.scss')
        .pipe(plumber(''))
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('html', function () {
    gulp.src('*.jade')
        .pipe(plumber(''))
        .pipe(jade())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('js', function () {
    gulp.src(['*.js', '!gulpfile.js'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('assets', function() {
    gulp.src(['assets/**/*'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build/assets'))
        .pipe(connect.reload());
});

gulp.task('config', function() {
    gulp.src(['config/**/*'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch('*.scss', ['css']);
  gulp.watch('*.js', ['js']);
  gulp.watch('*.assets', ['assets']);
  gulp.watch('*.jade', ['html']);
});

gulp.task('serve', ['build'], function() {
  connect.server({
    livereload: true
  });
});

gulp.task('deploy', ['build'], function () {
    return gulp.src('./build/**/*')
        .pipe(deploy(DEPLOY_OPTIONS));
});

gulp.task('build', ['html', 'css', 'js', 'assets', 'config']);

gulp.task('default', ['serve', 'watch']);
