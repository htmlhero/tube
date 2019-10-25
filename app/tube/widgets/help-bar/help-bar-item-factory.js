goog.provide('tube.widgets.helpBarItemFactory');
goog.require('zb.device.input.Keys');
goog.require('zb.ui.widgets.HelpBarItem');


/**
 * @param {zb.ui.widgets.HelpBarItem.Options} options
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.item = (options, opt_callback) => {
	const item = new zb.ui.widgets.HelpBarItem(options);

	if (typeof opt_callback === 'function') {
		item.on(item.EVENT_CLICK, opt_callback);
	}

	return item;
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.red = (label, opt_callback) => {
	const options = {
		cssClass: '_red',
		label: label,
		keys: [zb.device.input.Keys.RED]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback);
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.green = (label, opt_callback) => {
	const options = {
		cssClass: '_green',
		label: label,
		keys: [zb.device.input.Keys.GREEN]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback);
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.yellow = (label, opt_callback) => {
	const options = {
		cssClass: '_yellow',
		label: label,
		keys: [zb.device.input.Keys.YELLOW]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback);
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.blue = (label, opt_callback) => {
	const options = {
		cssClass: '_blue',
		label: label,
		keys: [zb.device.input.Keys.BLUE]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback);
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.play = (label, opt_callback) => {
	const options = {
		cssClass: '_play',
		label: label,
		keys: [zb.device.input.Keys.PLAY]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback);
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.pause = (label, opt_callback) => {
	const options = {
		cssClass: '_pause',
		label: label,
		keys: [zb.device.input.Keys.PAUSE]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback);
};


/**
 * @param {string} label
 * @param {function()=} opt_callback
 * @return {zb.ui.widgets.HelpBarItem}
 */
tube.widgets.helpBarItemFactory.back = (label, opt_callback) => {
	const options = {
		cssClass: '_back',
		label: label,
		keys: [zb.device.input.Keys.BACK, zb.device.input.Keys.EXIT]
	};

	return tube.widgets.helpBarItemFactory.item(options, opt_callback || app.back.bind(app));
};
