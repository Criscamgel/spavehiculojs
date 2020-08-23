const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
let autoprefixBrowsers = ['> 1%', 'last 2 versions', 'firefox >= 4', 'safari 7', 'safari 8', 'IE 8', 'IE 9', 'IE 10', 'IE 11'];

function css(){
    return gulp
    .src('./scss/style.scss')
    .pipe(autoprefixer({
        overrideBrowserlist: autoprefixBrowsers,
        cascade: false,
        grid: true
    }))
    .pipe(sass({
        outputStyle: 'nested', //nested, compact, compressed
    }))
    .pipe(gulp.dest('css'))
}

// Cada vez que hagas un cambio vas a ejecutar el paso de css a scss

function watchFiles(){
    gulp.watch('./scss/*.scss', css)
}

//Registrar funciones como tareas
gulp.task('css', css)
gulp.task('watch', watchFiles)