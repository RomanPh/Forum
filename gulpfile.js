const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const jshint = require('gulp-jshint');
const sass = require('gulp-sass');
const livereload = require('gulp-livereload');
const minifyhtml = require('gulp-minify-html');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');
const source = require('vinyl-source-stream');
const imagemin = require('gulp-imagemin');
const pump = require('pump');
const mongodbData = require('gulp-mongodb-data');
const src = 'client';
const dist = 'public';
const server = 'server/**/*.js';
const paths = {
    js: src + '/js/**/*.js',
    scss: src + '/css/scss/*.scss',
    html: src + '/**/*.html',
    img: src + '/img/*',
    distJs: dist + '/js/',
    distImg: dist + '/img/',
    distCss: dist + '/css/',
    mondoDbSourcePath: './server/mongoDBSource/*.json'
}

gulp.task('images', function () {
    gulp.src(paths.img)
        .pipe(imagemin())
        .pipe(gulp.dest(paths.distImg))
});

// Compile sass to css
gulp.task('compile-sass', function () {
    return gulp.src(paths.scss)
        .pipe(sass())
        .pipe(gulp.dest(paths.distCss));
});

// configure the jshint task for server
gulp.task('jshintServer', function () {
    return gulp.src(server)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Combine & Compress JS into one script.js
gulp.task('combine-js', function () {
    return gulp.src(paths.js)
        .pipe(concat('main.js'))
       // .pipe(uglify())
        .pipe(gulp.dest(paths.distJs))
});

// configure the jshint task for client
gulp.task('jshint', function () {
    return gulp.src(paths.distJs)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compress HTML
gulp.task('compress-html', function () {
    return gulp.src(paths.html)
        .pipe(minifyhtml())
        .pipe(gulp.dest(dist + '/'));
});

// Load JSON files into the specified MongoDB server
gulp.task('metadata', function () {
    gulp.src(paths.mondoDbSourcePath)
        .pipe(mongodbData({
            mongoUrl: 'mongodb://localhost:27017/forum',
            dropCollection: true
        }))
})

//Run the server
gulp.task('server', function () {
    nodemon({
        'script': 'app.js'
    })

});

// Watch files and reload browser
gulp.task('watch', function () {
    gulp.watch(paths.js, ['jshint']);
    gulp.watch(paths.scss, ['compile-sass']);
    gulp.watch(paths.html, ['compress-html']);
    gulp.watch(paths.js, ['combine-js']);
});

gulp.task('default', ['jshintServer', 'jshint', 'images',
    'combine-js', 'compile-sass',
    'compress-html', 'metadata', 'server', 'watch'
]);