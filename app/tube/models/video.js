goog.provide('tube.models.Video');


tube.models.Video = class {
	/**
	 * @param {tube.models.Video.Data} data
	 * @param {tube.models.Video.ExtendFunction} extendFunction
	 */
	constructor(data, extendFunction) {
		/**
		 * @type {number}
		 */
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.title = data.title;

		/**
		 * @type {string}
		 */
		this.coverUrl = data.coverUrl;

		/**
		 * @type {number|undefined}
		 */
		this.duration = data.duration;

		/**
		 * @type {number|undefined}
		 */
		this.views = data.views;

		/**
		 * @type {string|undefined}
		 */
		this.videoUrl;

		/**
		 * @type {tube.models.Video.ExtendFunction}
		 * @private
		 */
		this._extendFunction = extendFunction;

		/**
		 * @type {?IThenable<{
		 *     videoUrl: string
		 * }>}
		 * @private
		 */
		this._extendPromise = null;
	}

	/**
	 * @return {IThenable<tube.models.Video>}
	 */
	extend() {
		if (!this._extendPromise) {
			this._extendPromise = this
				._extendFunction()
				.then((data) => {
					this.videoUrl = data.videoUrl;
					return this;
				});
		}

		return this._extendPromise;
	}
};


/**
 * @param {tube.models.Video.Data} data
 * @param {tube.models.Video.ExtendFunction} extendFunction
 * @return {tube.models.Video}
 */
tube.models.Video.fromData = function(data, extendFunction) {
	return new tube.models.Video(data, extendFunction);
};


/**
 * @param {Array<tube.models.Video.Data>} dataArray
 * @param {tube.models.Video.ExtendFunction} extendFunction
 * @return {Array<tube.models.Video>}
 */
tube.models.Video.fromDataArray = function(dataArray, extendFunction) {
	return dataArray.map((data) => tube.models.Video.fromData(data, extendFunction));
};


/**
 * @typedef {{
 *     id: number,
 *     title: string,
 *     coverUrl: string,
 *     duration: (number|undefined),
 *     views: (number|undefined)
 * }}
 */
tube.models.Video.Data;


/**
 * @typedef {function(): IThenable<{
 *     videoUrl: string
 * }>}
 */
tube.models.Video.ExtendFunction;
