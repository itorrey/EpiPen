function do_custom(txt) {
	//var val = $axure('@entry').$()[0].firstElementChild.value;
	//$axure('@target').$()[0].firstElementChild.value = val;
	//var theJson = document.getElementById("axureEventReceiverDiv").innerHTML;
	//eval(JSON.parse(theJson).data.epi);
	console.log($axure("@target").value());
}

function con(txt) {
	console.log(txt);
}