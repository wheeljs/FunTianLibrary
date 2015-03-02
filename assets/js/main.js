require.config({
	paths: {
		backbone: 'backbone-min',
		jquery: 'jquery-1.9.1.min',
		underscore: 'underscore-min'
	}
});

require(
	[
		'app/views/notification-list'
	],
	function (NotificationList) {
		var notificationList = new NotificationList({
			id: 'app-notification-list',
			el: '#list-container'
		});
		notificationList.render();
	}
);