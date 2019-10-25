goog.provide('tube.widgets.ItemList');
goog.require('tube.widgets.ItemListItem');
goog.require('zb.ui.widgets.BaseList');


tube.widgets.ItemList = class extends zb.ui.widgets.BaseList {
	/**
	 */
	constructor() {
		super({
			itemClass: tube.widgets.ItemListItem,
			isVertical: true,
			options: {
				padding: 3,
				loadOnLeft: 1,
				lineSize: 4
			}
		});

		this._container.classList.add('w-item-list');
	}
};
