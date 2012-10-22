


;(function($, window, undefined){
    var uploadId = 0;
	var druploader = function(){
		var loader = this;
		this.api = null;
		this.reloadTarget = null;
		this.reloadUri = null;
		this.redirectUri = null;
		this.api = null;
		this.loading = 0;
		this.element = null;
		this.success = function(){
		};
		this.error = function(){
		};
		this.init = function(element, options){
			this.element = element;
			this.element.ondragenter = this.dragEnterHandler;
			this.element.ondragover = this.dragOverHandler;
			$(element).bind('drop', this.dropHandler);
			var url = $(element).attr('drop-api');
			if (undefined != url){
				this.api = url;
			}
			var reloadUri = $(element).attr('drop-reload-uri');
			if (undefined != reloadUri){
				this.reloadUri = reloadUri;
			}
			var reloadTarget = $(element).attr('drop-reload');
			if (undefined != reloadTarget){
				this.reloadTarget = reloadTarget;
			}
		};
		this.upload = function(file, uploadId){
			// TODO check file drop support
			var self = loader;
			if (window.XMLHttpRequest){ // check if not ie lte 6
				var xhr = new XMLHttpRequest();
				var uri = this.api;
				if (uploadId){
					if (uri.indexOf('?') != -1){
						uri = uri + '&uploadId=' + uploadId;
					}else{
						uri = uri + '?uploadId=' + uploadId;
					}
				}
				xhr.open("POST", uri);
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
				xhr.setRequestHeader("X-File-Name", file.fileName?file.fileName:(file.name?file.name:'file'));
				xhr.setRequestHeader("X-File-Size", file.fileSize?file.fileSize:(file.size?file.size:0));
				//xhr.setRequestHeader("X-Target-Id", targetId);
				xhr.setRequestHeader("Content-Type", "multipart/form-data");
				xhr.onload = function() { 
					loader.loading--;
					/* If we got an error display it. */
					if (xhr.responseText){
						var data = $.parseJSON(xhr.responseText);
						if (data.status != 0) {
							console.error(xhr.responseText);
						}else{
							loader.success();
							if (data.redirectUri){
								if (loader.loading == 0){
									window.location = data.redirectUri;
								}
							}
							console.dir(file);
							if (loader.reloadTarget != null && loader.reloadUri != null){
								$(loader.reloadTarget).load(loader.reloadUri, function(){
									setTimeout(function(){
										$(window.document).trigger('dom-updated');
									}, 500);
								});
							}
						}
					}else{
						console.error(xhr.responseText);
					}
				
				};
				// event.dataTransfer.mozGetDataAt("application/x-moz-file", 0)
				// Starting with Firefox 3.5 Gecko 1.9.2, you may also specify an DOM File
				xhr.send(file); 
				loader.loading++;
			}
		};
		this.dragEnterHandler = function(e){
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			return false;
		};
		this.dragOverHandler = function(e){
			e.preventDefault();
			e.dataTransfer.dropEffect = 'copy';
			return false;
		};
		this.dropHandler = function(je){
			je.preventDefault();
			je.stopPropagation();
			var e = je.originalEvent;
			if (e.dataTransfer){
				var dt = e.dataTransfer;
				if (dt.files && dt.files.length){
					var files = dt.files;
					uploadId = uploadId + 1;
					for (var i = 0; i < files.length; i++) {
						var file = files[i];
						console.log('dropped ' + file.name);
						loader.upload(file, uploadId);
					}
				}
			}
			return false;
		}
	};
	var defaults = {
		api: null
	};
	$.fn.druploader = function(options){
		return this.each(function() {        
			if (options) { 
				$.extend(defaults, options);
			}
			var loader = new druploader();
			$.extend(loader, options);
			loader.init(this, options);
		});
	};



}(jQuery, window));
