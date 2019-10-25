goog.provide('tube.models.Category');


tube.models.Category = class {
	/**
	 * @param {tube.models.Category.Data} data
	 */
	constructor(data) {
		/**
		 * @type {string}
		 */
		this.id = data.id;

		/**
		 * @type {string}
		 */
		this.title = data.title;

		/**
		 * @type {string|undefined}
		 */
		this.coverUrl = data.coverUrl;
	}
};


/**
 * @param {tube.models.Category.Data} data
 * @return {tube.models.Category}
 */
tube.models.Category.fromData = function(data) {
	return new tube.models.Category(data);
};


/**
 * @param {Array<tube.models.Category.Data>} dataArray
 * @return {Array<tube.models.Category>}
 */
tube.models.Category.fromDataArray = function(dataArray) {
	return dataArray.map(tube.models.Category.fromData);
};


/**
 * @typedef {{
 *     id: string,
 *     title: string,
 *     coverUrl: (string|undefined)
 * }}
 */
tube.models.Category.Data;
