// cuisine-front - created with Gulp Fiction
var gulp = require("gulp");
var concat = require("gulp-concat");
var cssshrink = require("gulp-cssshrink");
var notify = require("gulp-notify");
var connect = require('gulp-connect');

gulp.task("js", [], function () {
    gulp.src([
        "app/js/app.js",
        "app/js/services.js",
        "app/js/controllers.js",
        "app/js/filters.js",
        "app/js/directives.js",
        "app/js/restangular.js",
        "app/js/controllers/*.js"
    ])
        .pipe(concat("app.js"))
        .pipe(gulp.dest("./build/"))
        .pipe(notify("Js done !"))
        .pipe(connect.reload());
    ;
});

gulp.task("css", [], function () {
    gulp.src(["app/css/**.css"])
        .pipe(cssshrink())
        .pipe(concat("app.css"))
        .pipe(gulp.dest("./build/"))
        .pipe(notify("CSS done !"))
        .pipe(connect.reload());
});

gulp.task("html", [], function () {
    gulp.src(["app/**/*.html"])
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