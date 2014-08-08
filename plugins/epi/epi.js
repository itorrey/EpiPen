(function () {
    $axure.internal(function($ax){
        $ax.public.getGlobalVariable = $ax.getGlobalVariable = function(name) {
            return $ax.globalVariableProvider.getVariableValue(name);
        };

        $ax.public.globalVariableProvider = function () {
            return $ax.globalVariableProvider;
        };

        $ax.public.document = function() {
            return $ax.document;
        };
    });

    $('#axureEventReceiverDiv').bind("DOMSubtreeModified",function(){
        var request = JSON.parse($(this).text());
        if(request.data.epi) {
            eval($axure.getGlobalVariable('epi'));
        }
    });

    $axure('@EpiInjector').each(function(index, value){
    	$(index.data).each(function(index, value) {
            var type = value.type.text;
            var src = value.src.text;
            var target = value.target.text;
            createTag(type, src, target);
    	});
    });


    function createTag(type, src, target) {
        var tag;
        if(!target) { target = "head"; }
        switch(type) {
            case "css":
                tag = document.createElement("link");
                tag.href = src;
                tag.type = "text/css";
                tag.rel = "stylesheet";
                break;

            case "js":
                tag = document.createElement("script");
                tag.src = src;
                break;

            case "html":
                tag = document.createDocumentFragment(src);
                break;
        }
        if(target.substring(0,1) == "@") {
            $axure(target).$()[0].innerHTML = src;

        } else {
            var head = document.getElementsByTagName("head")[0];
            head.appendChild(tag);
        }
    }

})();
