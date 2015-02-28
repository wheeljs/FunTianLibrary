require.config({
	paths: {
		jquery: 'jquery-1.9.1.min',
		underscore: 'underscore-min'
	},
	shim: {
		underscore: {
			exports: '_'
		}
	}
});

require(
	[
		'app/cache', 
		'app/templates',
		'app/template-helper'
	],
	function (Cache, Templates, TemplateHelper) {
		var cache = new Cache();
		cache.set('test', 'Testing cache 1.');
		Templates.init();
		TemplateHelper.register('Person', 'phoneReg', /(\d{3})(\d{4})(\d{4})/);
		console.dir(TemplateHelper);
	}
);