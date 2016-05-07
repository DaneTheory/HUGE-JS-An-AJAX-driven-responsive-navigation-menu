var gulp = require('gulp'),
    gulpIf = require('gulp-if'),
    rename = require('gulp-rename'),
    cache = require('gulp-cache'),
    del = require('del'),
    runSequence = require('run-sequence'),
    sass = require('gulp-sass'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin');

var bs = require('browser-sync').create();
var exec = require('child_process').exec;


gulp.task('server', function (cb) {
  exec('node ./bin/www', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    cb(err);
  });
});

gulp.task('browser-sync', ['styles'], function() {
    bs.init({
        proxy: {
            target: "http://localhost:8080/",
        },
        port: 8088

    });
});

gulp.task('styles', function () {
    return gulp.src('./client/public/styles/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({errLogToConsole: true}))
    .pipe(autoprefixer('last 4 version'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./client/public/styles'))
    .pipe(bs.reload({stream: true}))
    .pipe(cssnano())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('../build/public/styles'))
    .pipe(bs.reload({stream: true}));
});

gulp.task('scripts', function(){
  gulp.src('./client/public/scripts/**/*.js')
    .pipe(gulp.dest('./client/public/scripts'))
    .pipe(bs.reload({stream: true, once: true}))
    .pipe(uglify())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('../build/public/scripts'))
    .pipe(bs.reload({stream: true, once: true}));
});

gulp.task('images', function(){
  return gulp.src('./client/public/images/**/*.+(png|jpg|gif|svg)')
  .pipe(cache(imagemin({
    interlaced: true
  })))
  .pipe(gulp.dest('../build/public/images'))
});

gulp.task('fonts', function() {
  return gulp.src('./client/public/fonts/**/*')
  .pipe(gulp.dest('../build/public/fonts'))
});

gulp.task('clean:dist', function() {
  return del.sync('../build', {force: true});
});

gulp.task('build', function () {
  runSequence('clean:dist',
    ['styles', 'scripts', 'images', 'fonts']
  )
});

gulp.task('watch', ['browser-sync'], function () {
    gulp.watch("./client/public/styles/**/*.scss", ['styles']);
    gulp.watch("./client/public/scripts/**/*.js", ['scripts']);
    gulp.watch("./client/public/**/*.html").on('change', bs.reload);
});

gulp.task('default', function () {
  runSequence(['server', 'styles', 'browser-sync', 'watch'])
})
