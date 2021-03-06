var gulp        = require('gulp');
var runSequence = require('run-sequence');


// Build Production Files, the Default Task
gulp.task('build', function(cb) {
  runSequence('clean', [
    'browserify',
    'copyCss', 'copyHtml', 'copyOther',
    'sass', 'images', 'jade', 'copyRootFiles'
  ], ['optimize'], cb);
});
