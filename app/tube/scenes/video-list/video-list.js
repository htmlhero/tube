goog.provide('tube.scenes.VideoList');
goog.require('tube.scenes.AbstractList');


tube.scenes.VideoList = class extends tube.scenes.AbstractList {
	/**
	 */
	constructor() {
		super();

		this._addContainerClass('s-video-list');

		this._exported.list.on(this._exported.list.EVENT_CLICK, (eventName, video) => {
			app.services.navigation.openPlayer(video);
		});
	}

	/**
	 * @override
	 */
	takeSnapshot() {
		const title = this._title;
		const dataList = this._dataList;

		return () => {
			this.setTitle(title);
			this.setDataList(dataList);
		};
	}
};
