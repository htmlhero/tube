goog.provide('tube.popups.Simple');
goog.require('tube.popups.Base');
goog.require('tube.popups.templates.simple.SimpleIn');
goog.require('tube.popups.templates.simple.SimpleOut');
goog.require('tube.popups.templates.simple.simple');
goog.require('zb.layers.Layer');


tube.popups.Simple = class extends tube.popups.Base {
	/**
	 * @override
	 */
	constructor(params) {
		super();

		/**
		 * @type {
		 *     function(tube.popups.templates.simple.SimpleIn, cuteJS.TemplateOptions):
		 *     tube.popups.templates.simple.SimpleOut
		 * }
		 * @protected
		 */
		this._template = tube.popups.templates.simple.simple;

		/**
		 * @type {tube.popups.templates.simple.SimpleIn}
		 * @protected
		 */
		this._templateIn = params;

		/**
		 * @type {tube.popups.templates.simple.SimpleOut}
		 * @protected
		 */
		this._templateOut;
	}

	/**
	 * @override
	 */
	_onRender() {
		super._onRender();

		this._addContainerClass('p-simple');

		this._templateOut.buttons.forEach((button) => {
			button.on(button.EVENT_CLICK, (eventName, data) => this.close(data.status));
		});
	}

	/**
	 * @param {tube.popups.Simple.Input} params
	 * @param {zb.layers.Layer=} opt_layer
	 * @return {tube.popups.Simple}
	 */
	static open(params, opt_layer) {
		const popup = new tube.popups.Simple(params);
		popup.render();

		(opt_layer || app).showChildLayerInstance(popup);

		return popup;
	}

	/**
	 * @param {tube.popups.Simple.Input} params
	 * @param {zb.layers.Layer=} opt_layer
	 * @param {tube.popups.Base.StatusHandler=} opt_statusHandler
	 * @return {IThenable<tube.popups.Base.Status>}
	 */
	static asPromise(params, opt_layer, opt_statusHandler) {
		const popup = tube.popups.Simple.open(params, opt_layer);

		return /** @type {IThenable<tube.popups.Base.Status>} */ (popup.toPromise(opt_statusHandler));
	}

	/**
	 * @param {Array<string>} title
	 * @param {string=} opt_okTitle
	 * @param {Array<string>=} opt_message
	 * @param {zb.layers.Layer=} opt_layer
	 * @return {IThenable<tube.popups.Base.Status>}
	 */
	static alert(title, opt_okTitle, opt_message, opt_layer) {
		/** @type {tube.popups.Simple.Input} */
		const params = {
			title: title,
			message: opt_message,
			buttons: [{
				title: opt_okTitle || 'OK',
				status: tube.popups.Base.Status.SUCCEEDED
			}]
		};

		return tube.popups.Simple.asPromise(params, opt_layer);
	}

	/**
	 * @param {Array<string>} title
	 * @param {string=} opt_yesTitle
	 * @param {string=} opt_noTitle
	 * @param {Array<string>=} opt_message
	 * @param {zb.layers.Layer=} opt_layer
	 * @return {IThenable<tube.popups.Base.Status>}
	 */
	static confirm(title, opt_yesTitle, opt_noTitle, opt_message, opt_layer) {
		/** @type {tube.popups.Simple.Input} */
		const params = {
			title: title,
			message: opt_message,
			buttons: [{
				title: opt_yesTitle || 'Yes',
				status: tube.popups.Base.Status.SUCCEEDED
			}, {
				title: opt_noTitle || 'No',
				status: tube.popups.Base.Status.CANCELLED
			}]
		};

		return tube.popups.Simple.asPromise(params, opt_layer);
	}
};


/**
 * @typedef {{
 *     title: string,
 *     status: tube.popups.Base.Status
 * }}
 */
tube.popups.Simple.Button;


/**
 * @typedef {{
 *     title: Array<string>,
 *     message: (Array<string>|undefined),
 *     buttons: Array<tube.popups.Simple.Button>
 * }}
 */
tube.popups.Simple.Input;
