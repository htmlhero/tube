goog.provide('tube.api.IVideo');
goog.require('tube.models.Category');
goog.require('tube.models.Video');


/**
 * @interface
 */
tube.api.IVideo = class {
	/**
	 * @param {number} offset
	 * @param {number} limit
	 * @return {IThenable<Array<tube.models.Category>>}
	 */
	getCategoryList(offset, limit) {}

	/**
	 * @param {tube.models.Category} category
	 * @param {number} offset
	 * @param {number} limit
	 * @return {IThenable<Array<tube.models.Video>>}
	 */
	getVideoList(category, offset, limit) {}
};
