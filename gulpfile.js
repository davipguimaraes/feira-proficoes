var gulp = require('gulp'),
	autoprefixer = require('gulp-autoprefixer'),
	clean = require('gulp-clean'),
	connect = require('gulp-connect'),
	sass = require('gulp-sass'),
	minify = require('gulp-minify');

var paths = {
	style: './src/assets/*.{scss,css,sass}',
	js: 'src/assets/*.js',
	image: './src/assets/image/*',
	html: './src/**/*.{html,htm}',
	prod: './dist'
};


gulp.task('clean', function () {
	return gulp.src(paths.prod).pipe(clean());
});

gulp.task('css', function () {
	return gulp.src(paths.style)
		.pipe(sass({
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['last 30 versions'],
			cascade: false
		}))
		.pipe(gulp.dest(paths.prod));
});
gulp.task('js', function () {
	gulp.src(paths.js)
	
    // .pipe(minify())
		.pipe(gulp.dest(paths.prod))
});

gulp.task('image', function () {
	gulp.src(paths.image)
		.pipe(gulp.dest(paths.prod))
});

gulp.task('html', function () {
	return gulp.src(paths.html)
		.pipe(gulp.dest(paths.prod));
});


gulp.task('connect', ['build'], function () {
	connect.server({
		root: paths.prod,
		livereload: true,
		port: 3500
	});
});

gulp.task('watch', ['connect'], function () {
	gulp.watch(paths.image, ['image']);
	gulp.watch(paths.html, ['html']);
	gulp.watch(paths.js, ['js']);
	gulp.watch(paths.style, ['css']);
});


gulp.task('build', ['clean'], function () {
	gulp.start(['html', 'css', 'js', 'image']);
});



gulp.task('default', function () {
	gulp.start(['build']);
});