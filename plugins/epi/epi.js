(function () {
    $(window.document).ready(function () {
        $axure('@EpiInjector').each(function(index, value){
        	$(index.data).each(function(index, value) {
                var type = value.type.text;
                var src = value.src.text;
                var target = value.target.text;

                createTag(type, src, target);
        	});
        });
    });

    function createTag(type, src, target) {
        var tag;
        if(!target) { target = "head"; }

        switch(type) {
            case "css":
                tag = '<link href="'+src+'" rel="stylesheet" type="text/css">';
                break;

            case "js":
                tag = '<script src="'+src+'"></script>';
                break;

            case "html":
                tag = src;
                break;
        }

        if(target.substring(0,1) == "@") {
            $(tag).appendTo($axure(target).$());
        } else {
            $(tag).appendTo(target);
        }
    }

})();
