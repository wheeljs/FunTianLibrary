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
		'app/views/notification-list',
		'app/loader-button'
	],
	function ($, NotificationList, LoaderButton) {
		var notificationList = new NotificationList({
			id: 'app-notification-list',
			el: '#list-container'
		});
		notificationList.render();

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
			}
		});
	}
);