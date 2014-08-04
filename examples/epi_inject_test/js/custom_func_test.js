function do_custom(txt) {
	var val = $axure('@entry').$()[0].firstElementChild.value;
	$axure('@target').$()[0].firstElementChild.value = val;
}