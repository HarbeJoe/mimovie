#!/usr/bin/env node

var 
	mimovie = require("./lib/mimovie"),
	util = require("util");

	console.log('mimovie', mimovie);

mimovie("./test/movie.mp4", function(err, res) {
	if (err) {
		console.log(err);
	}else{
		console.log("response", res);
		console.log(util.inspect(res, null, null, true));
	}
});
