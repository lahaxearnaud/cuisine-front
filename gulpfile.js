// cuisine-front - created with Gulp Fiction
var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssshrink = require("gulp-cssshrink"),
    notify = require("gulp-notify"),
    connect = require('gulp-connect'),
    connect = require('gulp-angular-filesort'),
    inject = require("gulp-inject"),
    angularFilesort = require('gulp-angular-filesort');

/**
 * [
        "app/js/app.js",
        "app/js/services.js",
        "app/js/controllers.js",
        "app/js/filters.js",
        "app/js/directives.js",
        "app/js/restangular.js",
        "app/js/controllers/*.js"
    ]
 */

gulp.task("js", ["inject"], function () {
    gulp.src("app/js/**/*.js")
        .pipe(angularFilesort())
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./build/"))
        .pipe(notify("Js done !"));
});

gulp.task("css", ["inject"], function () {
    gulp.src(["app/css/**.css"])
        .pipe(cssshrink())
        .pipe(concat("app.css"))
        .pipe(gulp.dest("./build/"))
        .pipe(notify("CSS done !"));
});

gulp.task("html", [], function () {
    gulp.src(["app/**/*.html"])
        .pipe(connect.reload());
});

gulp.task('inject', function () {
  var target = gulp.src('app/index.html');
  var sources = gulp.src([
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/lodash/dist/lodash.js',
    './bower_components/restangular/dist/restangular.js',
    './build/app.js',
    './bower_components/bootstrap/dist/css/bootstrap.css',
    './build/app.css'
    ], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('app/index.html'))
    .pipe(connect.reload());
});

gulp.task("watch", [], function () {
    gulp.watch("app/js/**/*.js", ["js"]);
    gulp.watch("app/css/**/*.css", ["css"]);
    gulp.watch("app/**/*.html", ["html"]);
});

gulp.task('webserver', function () {
    connect.server({
        livereload: true,
        port: 3333
    });
});

gulp.task("default", ["watch", "webserver"]);