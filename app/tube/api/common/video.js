goog.provide('tube.api.common.Video');
goog.require('tube.api.IVideo');
goog.require('tube.api.common.Transport');
goog.require('tube.models.Category');
goog.require('tube.models.Video');


/**
 * @implements {tube.api.IVideo}
 */
tube.api.common.Video = class {
	/**
	 */
	constructor() {
		/**
		 * @type {tube.api.common.Transport}
		 * @private
		 */
		this._transport = new tube.api.common.Transport();
	}

	/**
	 * @override
	 */
	getCategoryList(offset, limit) {
		return this._transport
			.request('getCategoryList', {
				'offset': offset,
				'limit': limit
			})
			.then((response) => {
				let items = [];
				if (response['response'] && response['response']['items']) {
					items = response['response']['items'];
				}

				return items.map((category) => tube.models.Category.fromData({
					id: category['id'],
					title: category['title'],
					coverUrl: category['coverUrl']
				}));
			});
	}

	/**
	 * @override
	 */
	getVideoList(category, offset, limit) {
		return this._transport
			.request('getVideoList', {
				'category_id': category.id,
				'offset': offset,
				'limit': limit
			})
			.then((response) => {
				let items = [];
				if (response['response'] && response['response']['items']) {
					items = response['response']['items'];
				}

				return items.map((video) => {
					const videoUrl = video['videoUrl'];
					return tube.models.Video.fromData({
						id: video['id'],
						title: video['title'],
						coverUrl: video['coverUrl'],
						duration: parseInt(video['duration'], 10),
						views: parseInt(video['views'], 10)
					}, () => {
						const promise = /** @type {IThenable<{videoUrl: string}>} */ (Promise.resolve({
							videoUrl: videoUrl
						}));
						return promise;
					});
				});
			});
	}
};
