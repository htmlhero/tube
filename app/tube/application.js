goog.provide('tube.Application');
goog.require('tube.BaseApplication');
goog.require('tube.api');
goog.require('tube.api.IVideo');
goog.require('tube.services.Navigation');
goog.require('tube.services.Player');
goog.require('zb.console');
goog.require('zb.console.Level');
goog.require('zb.device.platforms.samsung.Device');
goog.require('zb.html');
goog.require('zb.ui.widgets.Throbber');


tube.Application = class extends tube.BaseApplication {
	/**
	 */
	constructor() {
		zb.console.setLevel(zb.console.Level.LOG);

		super();

		/**
		 * @type {{
		 *     video: tube.api.IVideo
		 * }}
		 */
		this.api = {
			video: tube.api.video
		};

		/**
		 * @type {{
		 *     navigation: tube.services.Navigation,
		 *     player: tube.services.Player,
		 *     throbber: zb.ui.widgets.Throbber
		 * }}
		 */
		this.services;
	}

	/**
	 * @override
	 */
	onReady() {
		super.onReady();

		if (this.isDeviceSamsung()) {
			const samsungDevice = /** @type {zb.device.platforms.samsung.Device} */ (this.device);
			samsungDevice.enableVolumeOSD(true);
		}

		const throbber = this._createThrobber();
		const sceneOpener = this.getSceneOpener();
		const navigation = new tube.services.Navigation({
			categoryList: this.sc.scenesCategoryList,
			videoList: this.sc.scenesVideoList,
			player: this.sc.scenesPlayer
		}, sceneOpener, this._layerManager, throbber);

		this.services = {
			navigation: navigation,
			player: new tube.services.Player(this, this.device),
			throbber: throbber
		};
	}

	/**
	 * @override
	 */
	onStart(launchParams) {
		super.onStart(launchParams);

		this.home();
	}

	/**
	 * @override
	 */
	home() {
		return this.services.navigation.openHome();
	}

	/**
	 * @return {zb.ui.widgets.Throbber}
	 * @private
	 */
	_createThrobber() {
		const throbberContainer = zb.html.div('a-throbber zb-fullscreen');
		const throbber = new zb.ui.widgets.Throbber({
			step: 58,
			width: 1392
		});

		throbberContainer.appendChild(throbber.getContainer());
		this._body.appendChild(throbberContainer);

		throbber.on(throbber.EVENT_START, () => {
			zb.html.show(throbberContainer);
		});

		throbber.on(throbber.EVENT_STOP, () => {
			zb.html.hide(throbberContainer);
		});

		return throbber;
	}
};
