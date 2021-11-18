var	child = require("child_process"),
	split = require("split");

module.exports = function(input, cb){
	var 
		rv=[],
		chd,
		args=[];

	// Inform template
	args.push('--Output=Video;file://'+__dirname+'/media_out.txt'.replace(/\\/g, '/'));

	// Files
	if(typeof(input)=='string'){
		args.push(input);
	}
	if(typeof(input)=='object'){
		args = args.concat(input);
	}

	console.log("args = ", args);

	// Run mediainfo
	var cli = child.spawn(
		'mediainfo', args,[]
	);

	// Stream stdout
	cli.stdout.pipe(split(/((?:\r?\n){3})/)).on('data', function (data) {
		chd='';
		try {
			const tmp = data.replace(/:\s?,/g,":0,").replace(/\\/g, '/');
			chd=JSON.parse(tmp);
		} catch (e) {
			//cb(e,null);
			console.log("Erorr parsing json data", e);
		}
		if(typeof(chd)=='object'){
			rv.push(chd);
		}
	});

	// When mediainfo finish
	cli.on('close', function (code) {
		process.removeListener('exit', cliexit);
		if(code == -2){
			cb('Cannot run mediainfo.', null);
		}else if(code == 255){
			cb('At last one input file is needed.', null);
		}else if (code !== 0) {
			cb('Error trying to get the file details.', null);
		}else{
			if(rv.length<2){
				cb(null, rv[0]);
			}else{
				cb(null, rv);
			}
		}
	});

	function cliexit() {
		cli.kill();
	}

	// Terminate mediainfo on exit
	process.on('exit', cliexit);

};

