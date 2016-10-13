
var gulp            = require('gulp');
var gutil           = require('gulp-util');
var jsonminify      = require('gulp-json-minify');
var gulpFilter      = require('gulp-filter');
var concat          = require('gulp-concat');
var uglify          = require('gulp-uglify');
var sass            = require('gulp-sass');
var jade            = require('gulp-jade');
var ts              = require('gulp-typescript');
var mainBowerFiles  = require('gulp-main-bower-files');
var imagemin        = require('gulp-imagemin');
var cache           = require('gulp-cache');

var sourcemaps      = require('gulp-sourcemaps');
var rename          = require('gulp-rename');
var debug           = require('gulp-debug');
var plumber         = require('gulp-plumber');
var bourbon         = require('node-bourbon');

var connect         = require('gulp-connect');
var del             = require('del');
var runSequence     = require('run-sequence');
var open            = require('gulp-open');

var path = {
    scripts : {
        src  : 'app/typescripts/**/*.ts',
        out  : 'main.js',
        dest : 'public/js/',
        vendor: 'vendor.js',
        filter: ['*', '_*.*']
    },

    styles  : {
        src  : 'app/styles/**/*.scss',
        dest : 'public/css/',
    },
    views   : {
        src  : 'app/views/**/*.jade',
        dest : 'public/',
        filter: ['*', '**/*', '!_*.*', '!*/_*.*']
    },
    images  : {
        src  :'app/assets/images/**/*.+(png|jpg|gif|svg)',
        dest : 'public/images'
    },
    fonts   : {
        src  : 'app/assets/fonts/**/*',
        dest : 'public/fonts'
    },
    jsons   : {
        src  : 'app/assets/jsons/**/*.json',
        dest : 'public/jsons'
    },
    bower   : {
        src : './bower.json'
    }
};

gulp.task('webserver', function() {
    connect.server({
        root: 'public',
        livereload: true,
        directoryListing: true
    });
});

gulp.task('uri', function() {
    gulp.src(__filename)
    .pipe(open({uri: 'http://localhost:8080'}));
});

gulp.task('clean:public', function() {
    return del.sync('public');
});

gulp.task('fonts', function() {
    return gulp.src(path.fonts.src)
        .pipe(gulp.dest(path.fonts.dest))
        .pipe(connect.reload());
});

gulp.task('jsons', function() {
    return gulp.src(path.jsons.src)
        .pipe( plumber() )
        .pipe(jsonminify())
        .pipe(gulp.dest(path.jsons.dest))
        .on('error', gutil.log)
        .pipe(connect.reload());
});

gulp.task('imagemin', function() {
    return gulp.src(path.images.src)
        .pipe(imagemin())
        .pipe(gulp.dest(path.images.dest))
        .pipe(connect.reload());
} );

gulp.task('images', function() {
  return gulp.src(path.images.src)
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest(path.images.dest))
});

gulp.task('main-bower-files', function() {
    return gulp.src(path.bower.src)
        .pipe(mainBowerFiles( ))
        .pipe(uglify())
        .pipe(concat(path.scripts.vendor))
        .pipe(gulp.dest(path.scripts.dest));
});

//TO-DO:
//watch all typescript files and reload on save
gulp.task('scripts', function () {
    return gulp.src(path.scripts.src)
        .pipe(gulpFilter(path.scripts.filter))
        .pipe( plumber() )
        .pipe(sourcemaps.init())
        .pipe(ts({
                target: "ES5",
        	noImplicitAny: true,
        	out: path.scripts.out
    	    }
        ))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.scripts.dest))
        .pipe(connect.reload());
});

gulp.task('styles', function () {
    return gulp.src(path.styles.src)
        .pipe(gulpFilter(['*', '_*.*']))
        .pipe( plumber() )
        .pipe(sourcemaps.init())
        .pipe(sass({ 
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(sass().on('error', sass.logError))
        .pipe(sass({outputStyle: 'compressed'}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.styles.dest))
        .pipe(connect.reload());
});

gulp.task( 'views', function() {
    return gulp.src( path.views.src )
        .pipe( plumber() )
        .pipe( jade( {pretty: true } ))
        .pipe( gulpFilter( path.views.filter ))
        .pipe( gulp.dest( path.views.dest ))
        .pipe( connect.reload() );
});

gulp.task('watch', function () {

    gulp.watch(path.views.src, ['views']);
    gulp.watch(path.styles.src, ['styles']);
    gulp.watch(path.scripts.src, ['scripts']);
    gulp.watch(path.images.src, ['imagemin']);
    gulp.watch(path.images.src, ['images']);
    gulp.watch(path.images.src, ['jsons']);
    gulp.watch(path.images.src, ['fonts']);
});

//TODO:
//https://github.com/addyosmani/critical-path-css-demo
gulp.task('default', function(callback) {
  runSequence(
    'clean:public', [
        'main-bower-files', 
        'scripts', 
        'styles', 
        'imagemin', 
        'images',
        'jsons',
        'fonts',
        'views'], 
    'webserver',
    'uri', 
    'watch',
    callback);
});