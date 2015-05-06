var gulp = require('gulp'),
    sass = require('gulp-sass'),
    jade = require('gulp-jade'),
    autoprefixer = require('gulp-autoprefixer'),
    connect = require('gulp-connect'),
    plumber = require('gulp-plumber'),
    rimraf = require('gulp-rimraf'),
    deploy = require('gulp-gh-pages'),
    rmdir = require('rimraf'),
    tmpDirectory = require('os').tmpDir(),
    runSequence = require('run-sequence');

var DEPLOY_OPTIONS = {
    remoteUrl: 'git@github.com:twsgawayday/twsgawayday.github.io.git',
    branch: 'master'
};

gulp.task('build:css', function () {
    return gulp.src('*.scss')
        .pipe(plumber(''))
        .pipe(autoprefixer())
        .pipe(sass())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('build:html', function () {
    return gulp.src('*.jade')
        .pipe(plumber(''))
        .pipe(jade())
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('build:newsletter', function () {
  return gulp.src('newsletters/*.html')
        .pipe(plumber(''))
        .pipe(gulp.dest('./build/newsletters'))
        .pipe(connect.reload());
});

gulp.task('build:js', function () {
    return gulp.src(['*.js', '!gulpfile.js'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
});

gulp.task('build:copyAssets', function() {
    return gulp.src(['assets/**/*'])
        .pipe(plumber(''))
        .pipe(gulp.dest('./build/assets'))
        .pipe(connect.reload());
});

gulp.task('build:appcache', function () {
    return gulp.src('*.appcache')
        .pipe(gulp.dest('./build'))
        .pipe(connect.reload());
})

gulp.task('watch', function() {
    gulp.watch('*.scss', ['build:css']);
    gulp.watch('*.js', ['build:js']);
    gulp.watch('*.assets', ['build:copyAssets']);
    gulp.watch('*.jade', ['build:html']);
    gulp.watch('newsletters/*.html', ['build:newsletter']);
});

gulp.task('serve', ['build'], function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

gulp.task('deploy:gh-pages', function () {
    return gulp.src('./build/**/*')
        .pipe(deploy(DEPLOY_OPTIONS));
});

gulp.task('deploy', function(cb) {
    runSequence(['clean:tempFolder', 'clean:build'], 'build', 'deploy:gh-pages', cb);
});

gulp.task('clean:tempFolder', function () {
    var tmpRepoDirectory = tmpDirectory + 'tmpRepo';
    rmdir(tmpRepoDirectory, function(error){});
});

gulp.task('clean:build', function () {
    return gulp.src('./build/*', { read: false })
        .pipe(rimraf());
});

gulp.task('build', ['build:newsletter', 'build:html', 'build:css', 'build:js', 'build:copyAssets', 'build:appcache']);

gulp.task('default', ['serve', 'watch']);
