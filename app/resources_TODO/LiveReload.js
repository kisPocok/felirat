// Livereload (dev only)
var path = './';
var fs = require('fs');

fs.watch(path, { recursive: true }, function() {
    if (location) location.reload();
});
