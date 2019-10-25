goog.provide('tube.scenes.AbstractList');
goog.require('tube.scenes.templates.abstractList.AbstractListOut');
goog.require('tube.scenes.templates.abstractList.abstractList');
goog.require('tube.widgets.helpBarItemFactory');
goog.require('zb.html');
goog.require('zb.layers.CuteScene');
goog.require('zb.ui.data.DynamicList');


/**
 * @abstract
 */
tube.scenes.AbstractList = class extends zb.layers.CuteScene {
	/**
	 */
	constructor() {
		super();

		this._addContainerClass('s-abstract-list');

		/**
		 * @type {tube.scenes.templates.abstractList.AbstractListOut}
		 * @protected
		 */
		this._exported;

		/**
		 * @type {string}
		 * @protected
		 */
		this._title = '';

		/**
		 * @type {?zb.ui.data.DynamicList}
		 * @protected
		 */
		this._dataList = null;

		this._createHelpBar();

		this.setDefaultWidget(this._exported.list);
	}

	/**
	 * @override
	 */
	processKey(zbKey, opt_event) {
		if (super.processKey(zbKey, opt_event)) {
			return true;
		}
		return this._exported.helpBar.processHelpBarKey(zbKey, opt_event);
	}

	/**
	 * @param {string} title
	 */
	setTitle(title) {
		this._title = title;
		zb.html.text(this._exported.title, title);
	}

	/**
	 * @param {zb.ui.data.DynamicList} dataList
	 */
	setDataList(dataList) {
		this._dataList = dataList;
		this._exported.list.setSource(null);
		this._exported.list.setSource(dataList);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return tube.scenes.templates.abstractList.abstractList(this._getTemplateData(), this._getTemplateOptions());
	}

	/**
	 * @protected
	 */
	_createHelpBar() {
		this._exported.helpBar.setItems([
			tube.widgets.helpBarItemFactory.red('Home', () => {
				app.services.navigation.openHome();
			}),
			tube.widgets.helpBarItemFactory.back('Back')
		]);
	}
};
