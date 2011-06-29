var druploader = function(element, options){
    $.extend(this, options);
    this.element = element;
    this.init();
};
var druploaderPrototype = {
    api: null,
    element: null,
    success: function(){
    },
    error: function(){
    },
    init: function(){
        this.element.ondragenter = this.dragEnterHandler;
        this.element.ondragover = this.dragOverHandler;
        $(element).bind('drop', this.dropHandler);
    },
    upload: function(file){
        // TODO check file drop support
        var self = this;
        if (window.XMLHttpRequest){ // check if not ie lte 6
            var xhr = new XMLHttpRequest();
            xhr.open("POST", this.api);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.setRequestHeader("X-File-Name", file.fileName);
            xhr.setRequestHeader("X-File-Size", file.fileSize);
            xhr.setRequestHeader("X-Target-Id", targetId);
            xhr.setRequestHeader("Content-Type", "multipart/form-data");
            xhr.onload = function() { 
                /* If we got an error display it. */
                if (xhr.responseText && xhr.responseText !== '{"status":0}') {
                    console.error(xhr.responseText);
                }else{
                    self.success();
                }
            };
            // event.dataTransfer.mozGetDataAt("application/x-moz-file", 0)
            // Starting with Firefox 3.5 Gecko 1.9.2, you may also specify an DOM File
            xhr.send(file); 
        }
    },
    dragEnterHandler: function(e){
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
    },
    dragOverHandler: function(e){
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
        return false;
    },
    dropHandler: function(je){
        je.preventDefault();
        je.stopPropagation();
        var e = je.originalEvent;
        if (e.dataTransfer){
            var dt = e.dataTransfer;
            if (dt.files && dt.files.length){
                var files = dt.files;
                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    console.log('dropped ' + file.name);
                    this.upload(file);
                }
            }
        }
        return false;
    }
};
druploader.prototype = druploaderPrototype;
druploader.prototype.constructor = druploader;