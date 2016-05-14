epi = {
    currentEpiValue: "",

    // Get the data inside the EpiInjector object and create tags from it.
    inject: function() {
        $axure('@EpiPen').each(function(index, element){
            $(index.data).each(function(index, element) {
                if(!element.type) {
                    return;
                }
                
                // If the value of attr_name is null, TypeError will occur.
                if(!element.attr_name) {
                    element.attr_name = "blank";
                }
                
                var type = element.type.text;
                var src = element.src.text;
                var target = element.target.text;
                var attr_name = element.attr_name.text;
                epi.injectCode(type, src, target, attr_name);
            });
        });
    },

    inputAlert: function(input) {
        output = "Please check the input value of " + input + "!";
        alert(output);
    },

    injectCode: function(type, src, target, attr_name) {
        var tag;

        if(!src) {
            epi.inputAlert("src");
        } else if(src.substring(0,2) === "[[") {
            src = $axure.getGlobalVariable(src.slice(2, -2));
        }

        if(target.substring(0,1) === "@") { 
            
            var data_label = target.substring(1);
            var selector = "[data-label=" + "'" + data_label +"']";
            tag = document.querySelector(selector);
            if(!tag) {
                epi.inputAlert("target");
            }
        }

        switch(type) {
            case "css":
                if(target === "internal") {
                    tag = document.createElement("style");
                    tag.innerHTML = src;
                } else if(target === "external") {
                    tag = document.createElement("link");
                    tag.href = src;
                    tag.type = "text/css";
                    tag.rel = "stylesheet";
                } else {
                    epi.inputAlert("target");
                }
                break;

            case "js":
                tag = document.createElement("script");
                if(target === "internal") {
                    tag.innerHTML = src;
                } else if(target === "external") {
                    tag.src = src;
                } else {
                    epi.inputAlert("target");
                }
                break;

            case "html":
                tag.innerHTML = src;
                break;

            case "class":
                var tag_class = tag.className;
                blank = (tag_class != '') ? ' ' : '';
                tag.className = tag_class + blank + src;
                break;

            case "attr":
                tag.setAttribute(attr_name, src);
        }

        if(target === "internal" || target === "external") {
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

