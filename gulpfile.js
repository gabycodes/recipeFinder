'use strict'

const gulp = require('gulp');
const sass = require('gulp-sass');
const concat = require('gulp-concat');
const babel = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const browserSync = require('browser-sync').create();
const reload = browserSync.reload;

gulp.task('styles', function () {
    return gulp.src('./dev/styles/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1'))
        .pipe(concat('style.css'))
        .pipe(gulp.dest('./public/styles'))
        .pipe(reload({ stream: true }));
});

gulp.task('scripts', () => {
    gulp.src('./dev/scripts/main.js')
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(gulp.dest('./public/scripts'))
        .pipe(reload({ stream: true }));
});
gulp.task('watch', function () {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);
    gulp.watch('./dev/scripts/main.js', ['scripts']);
    gulp.watch('*.html', reload);
});

gulp.task('browser-sync', () => {
    browserSync.init({
        server: '.'
    })
});

gulp.task('default', ['browser-sync', 'styles', 'scripts', 'watch']);

//In the block above, we've created a task called 'styles', this is our reference name. We can use this name in other tasks, or to call it individually. This task wrapper is used throughout Gulp to create different tasks.

//Inside the task wrapper, we write what is essentially, our script for our tasks. We use the return keyword to utilize the output of our tasks, and use a built in Gulp method called .src to pass in our files. By placing an asterisks in the place of a filename, we are essentially saying, "Go find any file that has an extension of .scss".

//Using './' means to start looking within the folder the file is in. So if the gulpfile is in the root of the project, it will start looking from there.

//Now, the beautiful part of Gulp. The pipes. If you're familiar with JavaScript, a pipe is a method that allows you to pass code from one process to another. We use pipes to utilize our plugins. When one plugin has completed, it gets passed to the next.

//In our task, we're using gulp.src() to take files from a folder, than using .pipe() to call the sass() plugin on them, next we pipe them to the concat() plugin, and finally into a built in dest method that states where to put the files when the task is completed.

//The sass() and concat() calls, come from the variables we set above. Instead of referring to the plugins themselves, we are running the functions inside the plugins, we appending params to the variable names.

//With all plugins, we can provide them options and data that helps them complete their task.


//Gulp has a built in watch method, that allows us to provide what files to watch for changes, then run an existing task.

//Inside the wrapper, we provide the scripts to run. We use the .watch() method, and provide what files to watch for changes and can then pass in an array of tasks to run.

//Now, instead of running gulp styles whenever we want to compile our Sass, we can run gulp watch, and the gulpfile will watch our sass files for changes, and run the styles task when they are saved. Once complete, the watch task will get ready for the next save.

//Gulp has a massive development community and has over 1400 plugins at the time of writing.Let's look at setting up a new task, and also updating an existing task with a new plugin.


//To leverage the power of ES6 in our projects, we can use a tool called https://babeljs.io/ to 'transpile' our code from ES6 to browser-friendly ES5 JavaScript. Much like Sass, we need to run it through a tool that will convert it for us.


//Next, we'll add it our 'scripts' task, which will tell us of any errors, convert our ES6 code to browser friendly code, concatenate any files together into one, and then put it in a destination folder.

//When we run the task, our ES6 will be converted to ES5 code and any errors will be displayed in the command line. Note If there is an error, Gulp will stop and exit. You will have to fix the error and rerun Gulp.



//We can now create a task for browsersync to run, and provide an object defining the settings needed. For now, we will define the base directory of our application from which to serve the files from. When using other tools such as MAMP for Wordpress, it's possible to mask an existing address using the proxy property.


//At this point, we have four tasks that all serve a purpose. One for CSS, one for JavaScript and one that watches our files, one for browser-sync and one that runs the specific tasks.

//However, we can make one master task that accomplishes all of these in one go.Right now, if we were to enter the project, we could run gulp watch and it would start the watch task, which would in turn wait for us to make a change to our files.As well, we wouldn't be able to run browser-sync because it's not running just yet.
  
//However, what if we wanted the files to be compiled and checked immediately, and then watched for a change, all by simply typing gulp.

//Within gulpfile.js, add a new task called 'default', but instead of adding a function, add an array.