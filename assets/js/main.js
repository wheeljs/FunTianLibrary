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
			onInitialized: function (data) {
				console.group('options.onInitialize');
				console.dir(data);
				console.groupEnd('options.onInitialize');
			},
			onStateChange: function (data) {
				console.group('options.onStateChange');
				console.dir(data);
				console.groupEnd('options.onStateChange');
			},
			onStateChanged: function (data) {
				console.group('options.onStateChanged');
				console.dir(data);
				console.groupEnd('options.onStateChanged');
			}
		});

	}
);