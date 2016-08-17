const async = require('async');
const model = require('model');

module.exports = function models() {
	var i = arguments.length;
	if( typeof(arguments[arguments.length-1]) === 'function' ) {
		var cb = arguments[arguments.length-1];
		i--;
	}
	var tab = new Array(i);
	while(i--) tab[i] = arguments[i];
	
	var p = async.eachOf(tab, function(arg, i, terminate) {
		model.model(arg, terminate);
	});
	
	if( cb ) p.then(cb);
	return p;
}
