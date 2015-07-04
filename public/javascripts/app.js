console.log('Hello world!');


$(function onReady() {
    //window.onDragover = function(e) { e.preventDefault(); return false; };
    //window.onDrop = function(e) { e.preventDefault(); return false; };

    var holder = document.getElementById('holder');
    holder.ondragover = function () { this.className = 'hover'; return false; };
    holder.ondragleave = function () { this.className = ''; return false; };

    holder.ondrop = function (e) {
        e.preventDefault();
        console.log(e.dataTransfer);

        for (var i = 0; i < e.dataTransfer.files.length; ++i) {
            console.log(e.dataTransfer.files[i].path);
        }
        return false;
    };
/*
    $('#movie').on('change', function MovieSelected() {
        var x = $(this).val();
        console.log("Selected movie:", x.split(/(\\|\/)/g).pop());
    });
*/
});
