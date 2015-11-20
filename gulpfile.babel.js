import gulp from 'gulp'
import standard from 'gulp-standard'
import mocha from 'gulp-mocha'
import babel from 'gulp-babel'
import del from 'del'

import thisModule from './src/index.js'

gulp.task('default', ['lint', 'test'])

gulp.task('clear', () => {
  return del(['bin/**', 'bin_*/**', 'tmp/**'])
})

gulp.task('build', ['buildSrc', 'buildTestNode', 'buildTestBrowser'])

gulp.task('buildSrc', ['clear'], () => {
  return gulp.src('src/**/*.js')
    .pipe(babel({presets: ['escompile-node']}))
    .pipe(gulp.dest('bin'))
})

gulp.task('buildTestNode', ['clear'], () => {
  return gulp.src('test/**/*.js')
    .pipe(babel({presets: ['escompile-node'], plugins: [thisModule]}))
    .pipe(gulp.dest('bin_test/node'))
})

gulp.task('buildTestBrowser', ['clear'], () => {
  return gulp.src('test/**/*.js')
    .pipe(babel({presets: ['escompile'], plugins: [thisModule]}))
    .pipe(gulp.dest('bin_test/browser'))
})

gulp.task('lint', () => {
  return gulp.src(['src/**/*.js', 'test/**/*.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {
      breakOnError: true,
      breakOnWarning: true
    }))
})

gulp.task('test', ['buildTestNode', 'buildTestBrowser'], () => {
  return gulp.src('bin_test/**/*.js', {read: false})
    .pipe(mocha())
})
