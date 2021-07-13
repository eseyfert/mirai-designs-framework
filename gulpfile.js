const gulp = require('gulp');
const scss = require('gulp-dart-scss');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const browserify = require('browserify');
const tsify = require('tsify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify-es').default;

gulp.task('scss-dirty', function () {
	return gulp
		.src('./modules/app.scss')
		.pipe(scss({ includePaths: ['node_modules'] }))
		.pipe(autoprefixer('last 5 version'))
		.pipe(gulp.dest('/'));
});

gulp.task('scss-clean', function () {
	return gulp
		.src('./modules/app.scss')
		.pipe(scss({ includePaths: ['node_modules'] }))
		.pipe(autoprefixer('last 5 version'))
		.pipe(
			cleanCSS({
				rebase: false,
				level: {
					1: {
						specialComments: 0,
					},
					2: {
						restructureRules: true,
						mergeSemantically: true,
					},
				},
			})
		)
		.pipe(gulp.dest('/'));
});

gulp.task('ts', function () {
	return browserify({
		entries: './modules/app.ts',
		extensions: ['.ts'],
		debug: true,
	})
		.plugin(tsify)
		.transform('babelify', {
			presets: ['@babel/env', '@babel/preset-typescript'],
			plugins: [
				[
					'@babel/plugin-transform-runtime',
					{
						corejs: '3',
					},
				],
			],
			extensions: ['.ts'],
			sourceMaps: true,
			global: true,
		})
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(sourcemaps.init({ loadMaps: true }))
		.pipe(uglify())
		.pipe(sourcemaps.write('/'))
		.pipe(gulp.dest('/'));
});

gulp.task('watch', function () {
	gulp.watch('./modules/**/*.scss', gulp.series('scss-dirty'));
	gulp.watch('./modules/**/*.ts', gulp.series('ts'));
});
