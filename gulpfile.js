// cuisine-front - created with Gulp Fiction
var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssshrink = require("gulp-cssshrink"),
    notify = require("gulp-notify"),
    connect = require('gulp-connect'),
    connect = require('gulp-angular-filesort'),
    inject = require("gulp-inject"),
    angularFilesort = require('gulp-angular-filesort')
    imagemin = require('gulp-imagemin')
    rewriteCSS = require('gulp-rewrite-css');


var bowerJsToIntegrate = [
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/lodash/dist/lodash.js',
    './bower_components/restangular/dist/restangular.js',
];

var bowerCssToIntegrate = [
    './bower_components/bootstrap/dist/css/bootstrap.css',
];

var buildPath = "./build/";

var mainHtmlFile = "app/index.html";
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

gulp.task("bower", ["inject"], function () {
    gulp.src(bowerJsToIntegrate)
        .pipe(concat("libs.js"))
        .pipe(gulp.dest(buildPath));

    gulp.src(bowerCssToIntegrate)
        .pipe(rewriteCSS({
            destination:buildPath
        }))
        .pipe(cssshrink())
        .pipe(concat("libs.css"))
        .pipe(gulp.dest(buildPath))
        .pipe(notify("CSS done !"));
});

gulp.task("js", ["inject"], function () {
    gulp.src("app/js/**/*.js")
        .pipe(angularFilesort())
        .pipe(concat("app.js"))
        .pipe(gulp.dest(buildPath))
        .pipe(notify("Js done !"));
});

gulp.task("css", ["inject"], function () {
    gulp.src(["app/css/**.css"])
        .pipe(rewriteCSS({
            destination:buildPath
        }))
        .pipe(cssshrink())
        .pipe(concat("app.css"))
        .pipe(gulp.dest(buildPath))
        .pipe(notify("CSS done !"));
});

gulp.task("html", [], function () {
    gulp.src(["app/**/*.html"])
        .pipe(connect.reload());
});

gulp.task("img", [], function () {
    gulp.src(["app/**/*"])
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
        .pipe(notify("Image done !"));
});


gulp.task('inject', function () {
  var target = gulp.src(mainHtmlFile);
  var sources = gulp.src([
    './build/libs.js',
    './build/app.js',
    './build/libs.css',
    './build/app.css'
    ], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest(mainHtmlFile))
    .pipe(connect.reload());
});

gulp.task("watch", [], function () {
    gulp.watch("app/js/**/*.js", ["js"]);
    gulp.watch("app/css/**/*.css", ["css"]);
    gulp.watch("app/**/*.html", ["html"]);
    gulp.watch("app/img/**/*", ["img"]);
    gulp.watch(["bower_components/**/*.js", "bower_components/**/*.css"], ["bower"]);
});

gulp.task('webserver', function () {
    connect.server({
        livereload: true,
        port: 3333
    });
});

gulp.task("default", ["watch", "webserver"]);