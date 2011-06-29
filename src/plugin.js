var defaults = {
    api: null
};
$.fn.druploader = function(options){
    return this.each(function() {        
        if (options) { 
            $.extend(defaults, options);
        }
        this.druploader = new druploader(this, options);
    });
};


