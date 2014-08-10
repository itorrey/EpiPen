epi = {
    currentEpiValue: "",

    // Get the data inside the EpiInjector object and create tags from it.
    inject: function() {
        $axure('@EpiInjector').each(function(index, value){
            $(index.data).each(function(index, value) {
                var type = value.type.text;
                var src = value.src.text;
                var target = value.target.text;
                epi.createTag(type, src, target);
            });
        });
    },

    createTag: function(type, src, target) {
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
    },

    //Listen for changes to epi variable from Axure.
    listen: function() {
        $('#axureEventReceiverDiv').bind("DOMSubtreeModified",function(){

            var request = JSON.parse($(this).text());

            if(request.data.epi && request.data.epi != epi.currentEpiValue) {
                epi.currentEpiValue = request.data.epi;
                eval(epi.currentEpiValue);
            }
        });
    },

    init: function() {
        this.inject();
        this.listen();
    }
};

(function () {
    epi.init();

    //Fix for axure's bug where this function doesn't return anything.
    $axure.internal(function($ax){
        $ax.public.getGlobalVariable = $ax.getGlobalVariable = function(name) {
            return $ax.globalVariableProvider.getVariableValue(name);
        };
    });
})();

