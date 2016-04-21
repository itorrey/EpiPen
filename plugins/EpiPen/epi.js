epi = {
    currentEpiValue: "",

    // Get the data inside the EpiInjector object and create tags from it.
    inject: function() {
        $axure('@EpiPen').each(function(index, element){
            $(index.data).each(function(index, element) {
                if(!element.type) {
                    return;
                }
                var type = element.type.text;
                var src = element.src.text;
                var target = element.target.text;
                epi.createTag(type, src, target);
                epi.addAttribute(type, src, target);
            });
        });
    },

    createTag: function(type, src, target) {
        var tag;
        if(!target) { target = "head"; }
        switch(type) {
            case "css":
                if(target == "inline") {
                    tag = document.createElement("style");
                    if(src.substring(0,2) == "[[") {
                        //This doesn't currently work. Always getting undefined.
                        tag.innerHTML = $axure.getGlobalVariable(src.slice(2, -2));
                    } else {
                        tag.innerHTML = src;
                    }
                } else {
                    tag = document.createElement("link");
                    tag.href = src;
                }
                tag.type = "text/css";
                tag.rel = "stylesheet";
                break;

            case "js":
                tag = document.createElement("script");
                if(target == "inline") {
                    tag.innerHTML = src;
                } else {
                    tag.src = src;
                }
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

    addAttribute: function(type, src, target) {
        switch(type) {
            case "class":
                if(target.substring(0,1) == "@") {
                    var selector=target.substring(1);
                    $("[data-label=selector").addClass(src);
                };
        }    
    }

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
    $axure.internal(function($ax){
        //Fix for axure's bug where this function doesn't return anything.
        $ax.public.getGlobalVariable = $ax.getGlobalVariable = function(name) {
            return $ax.globalVariableProvider.getVariableValue(name);
        };

        //Currently setting the text on an input widget throws an error that SetWidgetFormText doesn't exist.
        // This shim fixes that error
        SetWidgetFormText = function(elementIds, value) {
            //Need to check if elementIds is a string or array. If it's a string this will never work.
            if(typeof elementIds == "string") {
                elementIds = Array(elementIds);
            }
            //This is the original function from Axure's expr.js
            for(var i = 0; i < elementIds.length; i++) {
                var elementId = elementIds[i];
                var inputId = $ax.repeater.applySuffixToElementId(elementId, '_input');
                var obj = $jobj(inputId);
                if(obj.val() == value || (value == '' && $ax.placeholderManager.isActive(elementId))) return;
                obj.val(value);
                $ax.placeholderManager.updatePlaceholder(elementId, !value);
                if($ax.event.HasTextChanged($ax.getObjectFromElementId(elementId))) $ax.event.TryFireTextChanged(elementId);
            }
        };
    });
    epi.init();
})();

