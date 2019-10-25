goog.provide('tube.services.Navigation');
goog.require('tube.models.Category');
goog.require('tube.models.Video');
goog.require('tube.scenes.CategoryList');
goog.require('tube.scenes.Player');
goog.require('tube.scenes.VideoList');
goog.require('zb.LayerManager');
goog.require('zb.SceneOpener');
goog.require('zb.ui.data.DynamicList');
goog.require('zb.ui.widgets.Throbber');


tube.services.Navigation = class {
	/**
	 * @param {tube.services.Navigation.Scenes} scenes
	 * @param {zb.SceneOpener} opener
	 * @param {zb.LayerManager} layerManager
	 * @param {zb.ui.widgets.Throbber} throbber
	 */
	constructor(scenes, opener, layerManager, throbber) {
		/**
		 * @type {tube.services.Navigation.Scenes}
		 * @private
		 */
		this._scenes = scenes;

		/**
		 * @type {zb.SceneOpener}
		 * @private
		 */
		this._opener = opener;

		/**
		 * @type {zb.LayerManager}
		 * @private
		 */
		this._layerManager = layerManager;

		/**
		 * @type {zb.ui.widgets.Throbber}
		 * @private
		 */
		this._throbber = throbber;
	}

	/**
	 * @return {IThenable}
	 */
	openHome() {
		const currentLayer = this._layerManager.getCurrentLayer();
		if (currentLayer === this._scenes.categoryList) {
			return Promise.reject();
		} else {
			return this.openCategoryList();
		}
	}

	/**
	 * @param {tube.models.Category} category
	 * @return {IThenable}
	 */
	openVideoList(category) {
		const dataList = new zb.ui.data.DynamicList(
			(from, to) => {
				const offset = from;
				const limit = to - from + 1;
				return app.api.video.getVideoList(category, offset, limit);
			}, {
				startFrom: 0,
				startLoadingOnItemsLeft: 10,
				bufferSize: 200,
				initialBufferSize: 50,
				frameSize: 50
			}
		);

		const promise = dataList
			.preload()
			.then(() => this._opener.open(this._scenes.videoList))
			.then(() => {
				this._scenes.videoList.setTitle(category.title);
				this._scenes.videoList.setDataList(dataList);
			});

		this._wait(promise);

		return promise;
	}

	/**
	 * @return {IThenable}
	 */
	openCategoryList() {
		const dataList = new zb.ui.data.DynamicList(
			(from, to) => {
				const offset = from;
				const limit = to - from;
				return app.api.video.getCategoryList(offset, limit);
			}, {
				startFrom: 0,
				startLoadingOnItemsLeft: 10,
				bufferSize: 200,
				initialBufferSize: 50,
				frameSize: 50
			}
		);

		const promise = dataList
			.preload()
			.then(() => this._opener.open(this._scenes.categoryList))
			.then(() => {
				this._scenes.categoryList.setDataList(dataList);
			});

		this._wait(promise);

		return promise;
	}

	/**
	 * @param {tube.models.Video} video
	 * @return {IThenable}
	 */
	openPlayer(video) {
		const promise = video
			.extend()
			.then(() => {
				return this
					._opener.open(this._scenes.player)
					.then(() => {
						const videoUrl = /** @type {string} */ (video.videoUrl);
						this._scenes.player.setData(video.title, videoUrl);
					});
			});

		this._wait(promise);

		return promise;
	}

	/**
	 * @param {IThenable} promise
	 * @return {IThenable}
	 * @private
	 */
	_wait(promise) {
		const currentLayer = this._layerManager.getCurrentLayer();
		if (currentLayer) {
			currentLayer.wait(promise);
		}
		this._throbber.wait(promise);
		return promise;
	}
};


/**
 * @typedef {{
 *     categoryList: tube.scenes.CategoryList,
 *     videoList: tube.scenes.VideoList,
 *     player: tube.scenes.Player
 * }}
 */
tube.services.Navigation.Scenes;
