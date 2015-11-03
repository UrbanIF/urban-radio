var gulp    = require('gulp');
var changed = require('gulp-changed');


gulp.task('copyCss', function () {
  var dest = '.tmp/assets';

  return gulp.src(['src/styles/**/*.css'])
    .pipe(changed(dest)) // Ignore unchanged files
    .pipe(gulp.dest(dest));
});
