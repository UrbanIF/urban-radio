var gulp    = require('gulp');
var gulpIf  = require('gulp-if');
var changed = require('gulp-changed');

gulp.task('copyRootFiles', function() {
  var dest = '.tmp';

  return gulp.src('src/root_files/**')
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(gulpIf(global.isWatching, gulp.dest(dest)))  // for development
    .pipe(gulpIf(!global.isWatching, gulp.dest('dist')));   // for dist
});
