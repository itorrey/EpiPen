function dumpRepeater(target) {
	$axure(target).each(function(index, value){
	    $(index.data).each(function(index, value) {
	    	console.log(value);
	    });
	});
}

function getRepeater(repeaterLabel) {
	var theRepeater;
	$axure(function(obj) {
		return obj.type == 'repeater';
	}).each(function(obj, repeaterId) {
		if(obj.label == repeaterLabel) {
			theRepeater = obj;
		}
	});
	return theRepeater;
}

function getRepeaterDataSet(repeaterLabel) {
	var repeaterRef = getRepeater(repeaterLabel);
	return epi.deepCopy(repeaterRef.data);
}

function setRepeaterDataSet(targetRepeater, sourceRepeater) {

	var target = getRepeater(targetRepeater);
	var source = getRepeater(sourceRepeater);
	var targetId = $axure('@'+targetRepeater).getElementIds()[0];
	var sourceId = $axure('@'+sourceRepeater).getElementIds()[0];
	epi.repeater.setDataSet(targetId, sourceId);
	epi.repeater.refreshRepeater(targetId);
	myDataSet = getRepeaterDataSet('repeater');
}

var masterData = getRepeater('repeater');

var myDataSet = getRepeaterDataSet('repeater');
setRepeaterDataSet('repeater2', 'repeater');

watch(masterData, doWatched, 1, true);

function doWatched() {
	console.log('watched');
}



