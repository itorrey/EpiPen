var masterRepeaterLabel = 'repeater';

var masterRepeater = {
	label: masterRepeaterLabel,
	obj: getRepeater(masterRepeaterLabel),
	id: $axure('@'+masterRepeaterLabel).getElementIds()[0]
};

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

function setRepeaterDataSet(targetRepeater, sourceRepeater) {
	var target = getRepeater(targetRepeater);
	var source = getRepeater(sourceRepeater);
	var targetId = $axure('@'+targetRepeater).getElementIds()[0];
	var sourceId = $axure('@'+sourceRepeater).getElementIds()[0];
	epi.repeater.setDataSet(targetId, sourceId);
	epi.repeater.refreshRepeater(targetId);
	target.data = source.data;
	console.log(target);
}

setRepeaterDataSet('repeater2', masterRepeater.label);


watch(epi.action, "repeatersToRefresh", function(event, item, targetId) {
	if(targetId[0] == masterRepeater.id) {
		setRepeaterDataSet('repeater2', 'repeater');
	}
});