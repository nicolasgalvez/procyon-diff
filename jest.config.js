const path = require('path');
/** @type {import('jest').Config} */
const config = {
	globals: {
		CALLING_DIR: process.env.CALLING_DIR || process.cwd(),
	  },
	verbose: true,
	"reporters": [
		"default",
		[
			"jest-stare",
			{
				"resultDir": path.join(process.env.CALLING_DIR || process.cwd(), 'tests/results/jest-stare'),
				"reportTitle": "jest-stare!",
				"additionalResultsProcessors": [
					"jest-junit"
				]
			}
		]
	]
};

module.exports = config;
