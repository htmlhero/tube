goog.provide('tube.scenes.CategoryList');
goog.require('tube.scenes.AbstractList');


tube.scenes.CategoryList = class extends tube.scenes.AbstractList {
	/**
	 */
	constructor() {
		super();

		this._addContainerClass('s-category-list');

		this.setTitle('Categories');

		this._exported.list.on(this._exported.list.EVENT_CLICK, (eventName, category) => {
			app.services.navigation.openVideoList(category);
		});
	}

	/**
	 * @override
	 */
	takeSnapshot() {
		const dataList = this._dataList;

		return () => {
			this.setDataList(dataList);
		};
	}
};
