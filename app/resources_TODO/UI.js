var md5 = require('md5');

module.exports = function DogTitleUI (document, componentHandler) {
    this.elements = {
        'header':      document.getElementById('section-header'),
        'description': document.getElementById('section-description'),
        'queue':       document.getElementById('section-queue'),
        'list':        document.getElementById('list')
    };

    this.appBody = document.getElementsByTagName('body')[0];
    this.onFileDrag = function () {
        this.appBody.className = 'dragging';
    };
    this.onFileDrop = function () {
        this.appBody.classname = '';
    };
    this.showQueue = function () {
        // TODO
        this.elements.description.style.display = 'none'; // .hide()
        this.elements.queue.style.display = 'block'; // .show()
        this.elements.queue.style.display = 'inline-block'; // .show()
        this.elements.header.className = 'mdl-card__title  mdl-card--expand  small'; // addClass('small')
    };
    this.getListItem = function (fileName) {
        return document.getElementsByClassName('list-item-' + fileName)[0];
    };
    this.createListItem = function CreateItemThenReturnsHTMLQuery(MovieFile) {
        var name = MovieFile.fileName;
        var hash = 'dt' + md5('movie' + name);
        var className = 'list-item-' + hash;
        var length = this.elements.list.getElementsByClassName(className).length;
        var id = hash + '-' + length;

        //var spin  = '<i id="tooltip-' + id + '" class="material-icons  movie-status  rotating">loop</i>';
        var spin    = '<i id="tooltip-' + id + '" class="movie-status  mdl-spinner  mdl-js-spinner  is-active"></i>';
        var tooltip = '<span class="movie-tooltip  mdl-tooltip" for="tooltip-' + id + '" style="display:none;">Hello world!</span>';
        var title   = '<span class="movie-title">' + name + '</span>';

        var item = document.createElement('li');
        item.className = className;
        item.id = id;
        item.innerHTML = title + spin + tooltip;
        this.elements.list.appendChild(item);

        this.initMaterialDesign();

        return '#' + item.id;
    };
    // Material Design Lite (re)init
    this.initMaterialDesign = componentHandler.upgradeAllRegistered;

    return this;
};