/**
 * Variable Decalration
 */
var gulp = require('gulp');
var plugins = {
        autoprefixer: require('gulp-autoprefixer'),
        browserify: require('gulp-browserify'),
        browserSync: require('browser-sync'),
        cssmin: require('gulp-cssmin'),
        fileinclude: require('gulp-file-include'),
        rename: require('gulp-rename'),
        sass: require('gulp-sass'),
        svgSprite: require('gulp-svg-sprite'),
        uglify: require('gulp-uglify')
    };

/**
 * Helpers
 */
function errorLog (error) {
    console.log(error.message);

    this.emit("end");
}

/**
 * Declare Gulp Tasks
 */
gulp.task('browsersync', function() {
    plugins.browserSync({
        server: {
            baseDir: "./www/"
        }
    });
});

gulp.task('sass', function () {
    gulp.src('./main.scss')
        .pipe(plugins.sass({errLogToConsole: true}))
        .on('error', errorLog)
        .pipe(gulp.dest('./www/assets/css/'))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .on('error', errorLog)
        .pipe(plugins.browserSync.stream());
});

gulp.task('sass:deploy', function () {
    gulp.src('./main.scss')
        .pipe(plugins.sass({errLogToConsole: true}))
        .pipe(gulp.dest('./www/assets/css/'))
        .pipe(plugins.autoprefixer({
            browsers: ['last 2 versions', 'ios 11'],
            cascade: false
        }))
        .pipe(gulp.dest('./www/assets/css/'))
        .pipe(plugins.cssmin())
});

gulp.task('browserify', function() {
    gulp.src('./main.js')
        .pipe(plugins.browserify())
        .on('error', errorLog)
        .pipe(gulp.dest('./www/assets/js/'))
        .pipe(plugins.browserSync.stream());
});

gulp.task('browserify:deploy', function() {
    gulp.src('./main.js')
        .pipe(plugins.browserify())
        .pipe(gulp.dest('./www/assets/js/'))
        .pipe(plugins.uglify())
        .pipe(gulp.dest('./www/assets/js/'));
});

gulp.task('templates', function() {
    gulp.src(['./_templates/**/*.html'])
        .pipe(plugins.fileinclude({
            prefix: '@@',
            basepath: './'
        }))
        .on('error', errorLog)
        .pipe(gulp.dest('./www/'))
        .pipe(plugins.browserSync.stream());
});

gulp.task('templates:deploy', function() {
    gulp.src(['./_templates/**/*.html'])
        .pipe(plugins.fileinclude({
            prefix: '@@',
            basepath: './'
        }))
        .pipe(gulp.dest('./www/'));
});

gulp.task('images', function () {
    gulp.src('_assets/images/**/*')
        .pipe(gulp.dest('www/assets/images'))
        .on('error', errorLog)
        .pipe(plugins.browserSync.stream());
});

gulp.task('images:deploy', function () {
    gulp.src('_assets/images/**/*')
        .pipe(gulp.dest('www/assets/images'))
});

gulp.task('icons', function () {
    gulp.src('_modules/_icons/svg/*.svg')
        .pipe(plugins.svgSprite({
            mode: {
                symbol: {
                    dest: '../'
                }
            }
        }))
        .on('error', errorLog)
        .pipe(gulp.dest('./www/assets/icons/'))
        .pipe(plugins.browserSync.stream());
});

gulp.task('icons:deploy', function () {
    gulp.src('_modules/_icons/svg/*.svg')
        .pipe(plugins.svgSprite({
            mode: {
                symbol: {
                    dest: '../'
                }
            }
        }))
        .pipe(gulp.dest('./www/assets/icons/'));
});

gulp.task('copy', function () {
    gulp.src('_files/**/*')
        .pipe(gulp.dest('./www/files/'))
        .on('error', errorLog)
        .pipe(plugins.browserSync.stream());
});

gulp.task('copy:deploy', function () {
    gulp.src('_files/**/*')
        .pipe(gulp.dest('./www/files/'));
});

gulp.task('watch', function () {
    gulp.watch(['./main.js', './**/_*/*.js'], ['browserify']);
    gulp.watch(['./*.scss', './**/_*/*.scss'], ['sass']);
    gulp.watch(['./**/_*/*.html', './_templates/**/*.html'], ['templates']);
    gulp.watch(['./_assets/images/**/*'], ['images']);
    gulp.watch(['./_files/**/*'], ['copy']);
    gulp.watch(['./_modules/_icons/svg/*.svg'], ['icons']);
});

gulp.task('dev', [
    'sass',
    'browserify',
    'browsersync',
    'templates',
    'images',
    'copy',
    'icons',
    'watch'
]);

gulp.task('deploy', [
    'sass:deploy',
    'browserify:deploy',
    'templates:deploy',
    'images:deploy',
    'copy:deploy',
    'icons:deploy'
]);

gulp.task('default', [
    'dev'
]);
