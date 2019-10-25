goog.provide('tube.api.popcorn.Transport');
goog.require('zb.http');
goog.require('zb.xhr.simple');


tube.api.popcorn.Transport = class {
	/**
	 */
	constructor() {
		/**
		 * @type {string}
		 * @private
		 */
		this._baseUrl = 'http://192.168.1.99:8811/';
	}

	/**
	 * @param {string} action
	 * @param {Object} query GET params
	 * @return {IThenable<Object>}
	 */
	request(action, query) {
		const url = this._baseUrl + action;

		return zb.xhr.simple
			.send(zb.http.Method.GET, url, query, {})
			.then((xhr) => JSON.parse(xhr.responseText));
	}
};
