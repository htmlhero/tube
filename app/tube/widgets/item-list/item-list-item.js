goog.provide('tube.widgets.ItemListItem');
goog.require('tube.models.Category');
goog.require('tube.models.Video');
goog.require('tube.widgets.templates.itemListItem.itemListItem');
goog.require('zb.html');
goog.require('zb.ui.widgets.BaseListItem');


tube.widgets.ItemListItem = class extends zb.ui.widgets.BaseListItem {
	/**
	 * @override
	 */
	_createContainer() {
		const data = /** @type {tube.models.Category|tube.models.Video} */ (this._data);
		const type = data instanceof tube.models.Category ? 'category' : 'video';
		const exported = tube.widgets.templates.itemListItem.itemListItem({
			type: type,
			title: data.title,
			coverUrl: data.coverUrl,
			duration: data.duration ? this._formatDuration(data.duration) : undefined,
			views: data.views ? this._formatViews(data.views) : undefined
		});

		this._container = zb.html.findFirstElementNode(exported.root);
	}

	/**
	 * @param {number} time in seconds
	 * @return {string}
	 * @private
	 */
	_formatDuration(time) {
		const pad = (num) => (num < 10 ? '0' : '') + num;

		const seconds = time % 60;
		const minutes = Math.floor(time / 60);
		const hours = Math.floor(minutes / 60);

		const paddedSeconds = pad(seconds);
		const paddedMinutes = pad(minutes % 60);

		const parts = minutes < 60 ? [minutes, paddedSeconds] : [hours, paddedMinutes, paddedSeconds];

		return parts.join(':');
	}

	/**
	 * @param {number} views
	 * @return {string}
	 * @private
	 */
	_formatViews(views) {
		return String(views).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
	}
};
