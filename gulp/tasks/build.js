import gulp from 'gulp';
import gulpSequence from 'gulp-sequence';

const isWatching = process.argv.find(arg => {return arg === '--watch'}) || false

gulp.task('build', gulpSequence(isWatching ? 'server' : null, 'html', 'styles', 'images', 'eslint', 'scripts', isWatching ? 'watch' : null));
