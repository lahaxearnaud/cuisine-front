// cuisine-front - created with Gulp Fiction
var gulp = require("gulp"),
    concat = require("gulp-concat"),
    cssshrink = require("gulp-cssshrink"),
    notify = require("gulp-notify"),
    connect = require('gulp-connect'),
    inject = require("gulp-inject"),
    imagemin = require('gulp-imagemin'),
    rewriteCSS = require('gulp-rewrite-css'),
    bower = require('gulp-bower'),
    prettify = require('gulp-jsbeautifier'),
    gulpBowerFiles = require('gulp-bower-files');



/**
 * =============================================
 *  Configs
 * =============================================
 */

var bowerCssToIntegrate = [
    'bower_components/bootstrap/dist/css/bootstrap.css',
    'bower_components/angular-loading-bar/build/loading-bar.css',
    'bower_components/fontawesome/css/font-awesome.css'
];

var buildPath = "./build/";

var mainHtmlFile = "app/index.html";

var appFiles =  [
        "app/js/app.js",
        "app/js/modules/*.js",
        "app/js/routes/*.js",
        "app/js/config/*.js",
        "env/*.js",
        "app/js/services/*.js",
        "app/js/controllers/*.js",
        "app/js/filters/*.js",
        "app/js/directives/*.js",
        "app/js/jquery/*.js"
    ];

var logWatch = function(event) {
  console.log('File '+event.path+' was '+event.type);
};


/**
 * =============================================
 *  HTML
 * =============================================
 */
gulp.task("html", [], function () {
    gulp.src(["app/**/*.html"])
        .pipe(connect.reload());
});

/**
 * =============================================
 *  Beautifier
 * =============================================
 */
gulp.task('format:js', function() {
  gulp.src(appFiles)
    .pipe(prettify({config: '.jsbeautifyrc'}))
    .pipe(gulp.dest('./app'));
});

gulp.task('format:html', function() {
  gulp.src(['app/index.html', 'app/partials/**.html'])
    .pipe(prettify({config: '.jsbeautifyrc'}))
    .pipe(gulp.dest('./app'));
});

gulp.task('format:css', function() {
  gulp.src(["app/css/**.css"])
    .pipe(prettify({config: '.jsbeautifyrc'}))
    .pipe(gulp.dest('./app'));
});

/**
 * =============================================
 *  Assets
 * =============================================
 */
gulp.task("assets:js", [], function () {
    gulp.src(appFiles)
        .pipe(concat("app.js"))
        .pipe(gulp.dest(buildPath))
        .pipe(notify("Js done !"))
        .pipe(connect.reload());
});

gulp.task("assets:css", [], function () {
    gulp.src(["app/css/**.css"])
        .pipe(rewriteCSS({
            destination:buildPath
        }))
        .pipe(cssshrink())
        .pipe(concat("app.css"))
        .pipe(gulp.dest(buildPath))
        .pipe(notify("CSS done !"))
        .pipe(connect.reload());
});

gulp.task("assets:img", [], function () {
    gulp.src(["app/**/*.(png|jpg)"])
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'))
        .pipe(notify("Image done !"));
});

/**
 * =============================================
 *  Injector
 * =============================================
 */

gulp.task('inject', function () {
  var target = gulp.src(mainHtmlFile);
  var sources = gulp.src([
    './build/libs.**',
    './build/app.js',
    './build/libs.css',
    './build/app.css'
    ], {read: false});

  return target.pipe(inject(sources))
    .pipe(gulp.dest('./app/'))
    .pipe(connect.reload());
});

/**
 * =============================================
 *  BOWER
 * =============================================
 */

gulp.task('bower:install', function() {
  return bower("./bower_components");
});

gulp.task("bower:build", [], function () {
    gulpBowerFiles({
        'debugging' : true,
        'checkExistence': true
    })
        .pipe(concat("libs.js"))
        .pipe(gulp.dest(buildPath));

    gulp.src(bowerCssToIntegrate)
        .pipe(rewriteCSS({
            destination:buildPath
        }))
        .pipe(cssshrink())
        .pipe(concat("libs.css"))
        .pipe(gulp.dest(buildPath));
});

/**
 * =============================================
 *  Server
 * =============================================
 */
gulp.task('webserver', ["bower:install", "bower:build", "assets:js", "assets:css", "assets:img", "inject"], function () {
    connect.server({
        livereload: true,
        port: 3333
    });
});


/**
 * =============================================
 *  Watchers
 * =============================================
 */
gulp.task("watch", [], function () {
    gulp.watch("app/js/**/*.js", ["assets:js"], logWatch);
    gulp.watch("app/css/**/*.css", ["assets:css"], logWatch);
    gulp.watch("app/**/*.html", ["html"], logWatch);
    gulp.watch("app/img/**/*.(png|jpg)", ["assets:img"], logWatch);
    gulp.watch(["bower_components/**/*.js", "bower_components/**/*.css"], ["bower:build"], logWatch);
    gulp.watch(["bower.json"], ["bower:install"], logWatch);
});

/**
 * =============================================
 *  tasks
 * =============================================
 */
gulp.task("default", ["watch", "webserver"]);