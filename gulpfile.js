import gulp from "gulp"
import uglifycss from "gulp-uglifycss"
import concat from "gulp-concat"
import uglifyjs from "gulp-uglify"
import imagemin from "gulp-imagemin"
import connect from "gulp-connect"
import tempSass from "sass"
import gulpSass from "gulp-sass"
import include from "gulp-file-include"
import htmlmin from "gulp-htmlmin"
import sourcemaps from "gulp-sourcemaps"

const sass = gulpSass(tempSass)

function html() {
    return gulp.src("src/html/*.html")
        .pipe(sourcemaps.init())
        .pipe(include())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("dist"))
        .pipe(connect.reload())
}

function buildHtml() {
    return gulp.src("src/html/*.html")
        .pipe(include())
        .pipe(gulp.dest("build"))      
}

function css() {
    return gulp.src("src/styles/*.scss")
        .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/styles"))
        .pipe(connect.reload())
}

function buildCss() {
    return gulp.src("src/styles/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("build/styles"))      
}

function js() {
    return gulp.src("src/js/*.js")
        .pipe(sourcemaps.init())
        .pipe(concat("app.js"))
        .pipe(uglifyjs())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("build/js"))
        .pipe(connect.reload())
}

function buildJs() {
    return gulp.src("src/js/*.js")  
        .pipe(concat("app.js"))
        .pipe(uglifyjs())
        .pipe(gulp.dest("build/js"))
}

function images() {
    return gulp.src("src/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("build/images"))
        .pipe(connect.reload())
}

function buildImages() {
    return gulp.src("src/images/*")
        .pipe(imagemin())
        .pipe(gulp.dest("build/images"))
}

function watchImages() {
    gulp.watch("src/images/*", {events:"all",ignoreInitial:false}, async function() {
        images()
    })
}

function watchCss() {
    gulp.watch("src/styles/*.scss", {events:"all",ignoreInitial:false}, async function() {
        css()
    })
}

function watchJs() {
    gulp.watch("src/js/*.js", {events:"all",ignoreInitial:false}, async function() {
        js()
    })
}

function watchHtml() {
    gulp.watch("src/html/*.html", {events:"all",ignoreInitial:false}, function(cb) {
        html()
        cb()
    })
}

function server() {
    connect.server({
        root: "build",
        livereload: true
    })
}

export const watcher = gulp.parallel(watchHtml, watchCss, watchImages,  watchJs)
export { css, js, images, html }
export default gulp.parallel(watcher, server)
export const build = gulp.parallel(buildHtml, buildCss, buildJs, buildImages)