goog.provide('tube.api.popcorn.Video');
goog.require('tube.api.IVideo');
goog.require('tube.api.popcorn.Transport');
goog.require('tube.models.Category');
goog.require('tube.models.Video');


/**
 * @implements {tube.api.IVideo}
 */
tube.api.popcorn.Video = class {
	/**
	 */
	constructor() {
		/**
		 * @type {tube.api.popcorn.Transport}
		 * @private
		 */
		this._transport = new tube.api.popcorn.Transport();

		/**
		 * @type {Array<tube.models.Category>}
		 * @private
		 */
		this._categoryList = [];
	}

	/**
	 * @override
	 */
	getCategoryList() {
		if (this._categoryList.length) {
			return /** @type {IThenable<Array<tube.models.Category>>} */ (Promise.resolve(this._categoryList));
		}

		const categoryArray = [
			'action',
			'adventure',
			'animation',
			'comedy',
			'crime',
			'disaster',
			'documentary',
			'drama',
			'eastern',
			'family',
			'fan-film',
			'fantasy',
			'film-noir',
			'history',
			'holiday',
			'horror',
			'indie',
			'music',
			'mystery',
			'none',
			'road',
			'romance',
			'science-fiction',
			'short',
			'sports',
			'sporting-event',
			'suspense',
			'thriller',
			'tv-movie',
			'war',
			'western'
		];

		this._categoryList = categoryArray.map((categoryId) => {
			let categoryTitle = categoryId.charAt(0).toUpperCase() + categoryId.slice(1);
			categoryTitle = categoryTitle.replace(/-/g, ' ');

			return tube.models.Category.fromData({
				id: categoryId,
				title: categoryTitle
			});
		});

		return /** @type {IThenable<Array<tube.models.Category>>} */ (Promise.resolve(this._categoryList));
	}

	/**
	 * @override
	 */
	getVideoList(category, offset, limit) {
		const PAGE_SIZE = 50;
		const pageOffset = Math.floor(offset / PAGE_SIZE);
		const pageLimit = Math.ceil((offset + limit) / PAGE_SIZE) - pageOffset;

		let queue = Promise.resolve([]);
		const categoryId = category.id;

		for (let page = pageOffset + 1; page <= pageLimit; page++) {
			queue = queue.then((videoList) => {
				return this
					._getVideoListPage(page + pageOffset, categoryId)
					.then((part) => videoList.concat(part));
			});
		}

		return queue.then((videoList) => {
			return videoList
				.splice(offset - pageOffset * PAGE_SIZE, limit)
				.map((video) => {
					const videoMagnet = this._getVideoMagnet(video['torrents']);
					const extendFunction = () => {
						return this
							._getVideoUrl(videoMagnet)
							.then((videoUrl) => ({
								videoUrl: videoUrl
							}));
					};

					return tube.models.Video.fromData({
						id: video['_id'],
						title: video['title'],
						coverUrl: (video['images'] && video['images']['poster']) || undefined
					}, extendFunction);
				});
		});
	}

	/**
	 * @param {number} page
	 * @param {string} categoryId
	 * @return {IThenable<Array<Object>>}
	 * @private
	 */
	_getVideoListPage(page, categoryId) {
		return this._transport
			.request(`popcorn/movies/${page}`, {
				'sort': 'last added',
				'order': -1,
				'genre': categoryId
			})
			.then(null, () => []);
	}

	/**
	 * @param {Object} torrents
	 * @return {string}
	 * @private
	 */
	_getVideoMagnet(torrents) {
		// TODO: select required quality
		return torrents['en']['720p']['url'].split('&')[0];
	}

	/**
	 * @param {string} magnet
	 * @return {IThenable<string>}
	 * @private
	 */
	_getVideoUrl(magnet) {
		return this._transport
			.request(`load/${encodeURIComponent(magnet)}`, {})
			.then((response) => response['url']);
	}
};
