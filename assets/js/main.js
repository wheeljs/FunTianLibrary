require.config({
	paths: {
		backbone: 'backbone-min',
		jquery: 'jquery-1.9.1.min',
		underscore: 'underscore-min'
	}
});

require(
	[
		'jquery',
		'app/ui/loader-button'
	],
	function ($, LoaderButton) {
		var proxy = new LoaderButton($('#js-all-button'), {
			type: LoaderButton.Types.ALL,
			configure: {
				1: {
					iconClass: 'icon-save',
					text: 'Click to load'
				},
				2: {
					iconClass: 'icon-spin',
					text: 'Loading'
				},
				4: {
					iconClass: 'icon-ok',
					text: 'Finish'
				}
			},
			onInitialize: function (data) {
				console.group('options.onInitialize');
				console.dir(data);
				console.groupEnd('options.onInitialize');
			}
		});

	}
);