goog.provide('tube.scenes.Player');
goog.require('tube.popups.Simple');
goog.require('tube.scenes.PlayerOsd');
goog.require('tube.scenes.templates.player.PlayerOut');
goog.require('tube.scenes.templates.player.player');
goog.require('tube.services.Player');
goog.require('tube.widgets.helpBarItemFactory');
goog.require('zb.device.IVideo');
goog.require('zb.device.input.Keys');
goog.require('zb.html');
goog.require('zb.layers.CuteScene');
goog.require('zb.ui.widgets.HelpBarItem');
goog.require('zb.ui.limit');


tube.scenes.Player = class extends zb.layers.CuteScene {
	/**
	 * @override
	 */
	constructor() {
		super();

		/**
		 * @const {number}
		 */
		this.MOVE_OR_CLICK_DELAY = 1 * 1000;

		/**
		 * @type {tube.scenes.templates.player.PlayerOut}
		 * @private
		 */
		this._exported;

		/**
		 * @type {?tube.services.Player}
		 * @private
		 */
		this._player;

		/**
		 * @type {tube.scenes.PlayerOsd}
		 * @private
		 */
		this._osd;

		/**
		 * @type {function()|null}
		 * @private
		 */
		this._bufferingPromiseResolve;

		/**
		 * @type {function(Event)}
		 * @private
		 */
		this._onMoveOrClickTrottled;

		/**
		 * @type {zb.ui.widgets.HelpBarItem}
		 * @private
		 */
		this._helpBarItemPlay;

		/**
		 * @type {zb.ui.widgets.HelpBarItem}
		 * @private
		 */
		this._helpBarItemPause;

		/**
		 * @type {zb.ui.widgets.HelpBarItem}
		 * @private
		 */
		this._helpBarItemAspectRatio;

		this._addContainerClass('s-player');

		this._initHelpBar();
		this._initOsd();

		this._onStateChange = this._onStateChange.bind(this);
		this._onBuffering = this._onBuffering.bind(this);
		this._bufferingPromiseResolve = null;

		this._onError = this._onError.bind(this);

		this._onMoveOrClick = this._onMoveOrClick.bind(this);
		this._onMoveOrClickTrottled = zb.ui.limit.throttle(this._onMoveOrClick, this.MOVE_OR_CLICK_DELAY);
	}

	/**
	 * @override
	 */
	beforeDOMShow() {
		super.beforeDOMShow();

		this.activateWidget(this._exported.progress);

		this._setPlayer(app.services.player);

		this._osd.beforeDOMShow();

		document.addEventListener('click', this._onMoveOrClick, false);
		document.addEventListener('mousemove', this._onMoveOrClickTrottled, false);
	}

	/**
	 * @override
	 */
	afterDOMHide() {
		super.afterDOMHide();

		this._osd.afterDOMHide();

		this._setPlayer(null);

		document.removeEventListener('click', this._onMoveOrClick, false);
		document.removeEventListener('mousemove', this._onMoveOrClickTrottled, false);
	}

	/**
	 * @override
	 */
	processKey(zbKey, e) {
		if (app.services.player.processKey(zbKey)) {
			return true;
		}

		const isHelpBarKey = this._exported.helpBar.hasKey(zbKey);
		if (!isHelpBarKey && this._osd.processKey(zbKey, e)) {
			return true;
		}

		if (this._exported.helpBar.processHelpBarKey(zbKey, e)) {
			return true;
		}

		return super.processKey(zbKey, e);
	}

	/**
	 * @param {string} title
	 * @param {string} url
	 */
	setData(title, url) {
		zb.html.text(this._exported.title, title);
		this._player.play(url);
	}

	/**
	 * @override
	 */
	_renderTemplate() {
		return tube.scenes.templates.player.player(this._getTemplateData(), this._getTemplateOptions());
	}

	/**
	 * @override
	 */
	_processKey(zbKey, opt_e) {
		let isHandled = false;
		const keys = zb.device.input.Keys;

		switch (zbKey) {
			case keys.REW:
				isHandled = this._exported.progress.seekBackward();
				break;
			case keys.FWD:
				isHandled = this._exported.progress.seekForward();
				break;
		}

		return isHandled || super._processKey(zbKey, opt_e);
	}

	/**
	 * @private
	 */
	_initHelpBar() {
		this._exported.helpBar.setOrder([
			zb.device.input.Keys.PLAY,
			zb.device.input.Keys.PAUSE,
			zb.device.input.Keys.RED,
			zb.device.input.Keys.GREEN,
			zb.device.input.Keys.YELLOW,
			zb.device.input.Keys.BLUE,
			zb.device.input.Keys.BACK
		]);

		this._helpBarItemPlay = tube.widgets.helpBarItemFactory.play('Play', () => {
			this._player.resume();
		});

		this._helpBarItemPause = tube.widgets.helpBarItemFactory.pause('Pause', () => {
			this._player.pause();
		});

		this._helpBarItemAspectRatio = tube.widgets.helpBarItemFactory.red('Aspect ratio', () => {
			this._player.toggleAspectRatio();
		});

		const helpBarItemBack = tube.widgets.helpBarItemFactory.back('Back');

		this._exported.helpBar.setItems([
			this._helpBarItemPlay,
			this._helpBarItemPause,
			this._helpBarItemAspectRatio,
			helpBarItemBack
		]);
	}

	/**
	 * @private
	 */
	_initOsd() {
		this._osd = new tube.scenes.PlayerOsd({
			title: this._exported.title,
			shadow: this._exported.shadow,
			progress: this._exported.progress,
			helpBar: this._exported.helpBar.getContainer()
		});
		this._osd.on(this._osd.EVENT_STATE_CHANGED, this._onOsdStateChanged.bind(this));
	}

	/**
	 * @param {?tube.services.Player} player
	 * @private
	 */
	_setPlayer(player) {
		app.services.player.setVisible(!!player);

		this._osd.setPlayer(player);
		this._exported.progress.setPlayer(player);

		if (this._player) {
			this._player.off(this._player.EVENT_BUFFERING, this._onBuffering);
			this._player.off(this._player.EVENT_ERROR, this._onError);
			this._player.off(this._player.EVENT_STATE_CHANGE, this._onStateChange);
		}

		this._player = player;

		if (this._player) {
			this._player.on(this._player.EVENT_BUFFERING, this._onBuffering);
			this._player.on(this._player.EVENT_ERROR, this._onError);
			this._player.on(this._player.EVENT_STATE_CHANGE, this._onStateChange);

			const state = this._player.getState();
			this._updateHelpBar(state);
		}
	}

	/**
	 * @param {zb.device.IVideo.State} state
	 * @private
	 */
	_updateHelpBar(state) {
		switch (state) {
			case zb.device.IVideo.State.PLAYING:
			case zb.device.IVideo.State.BUFFERING:
				this._helpBarItemPlay.hide();
				this._helpBarItemPause.show();
				this._helpBarItemAspectRatio.show();
				break;
			case zb.device.IVideo.State.PAUSED:
			case zb.device.IVideo.State.SEEKING:
				this._helpBarItemPlay.show();
				this._helpBarItemPause.hide();
				this._helpBarItemAspectRatio.show();
				break;
			default:
				this._helpBarItemPlay.hide();
				this._helpBarItemPause.hide();
				this._helpBarItemAspectRatio.hide();
		}
	}

	/**
	 * @param {string} eventName
	 * @param {tube.scenes.PlayerOsd.State|null} newState
	 * @param {tube.scenes.PlayerOsd.State|null} oldState
	 * @private
	 */
	_onOsdStateChanged(eventName, newState, oldState) {
		switch (newState) {
			case tube.scenes.PlayerOsd.State.CONTROLS:
				this.activateWidget(this._exported.progress);
				break;
		}
	}

	/**
	 * @param {string} eventName
	 * @param {zb.device.IVideo.State} newState
	 * @private
	 */
	_onStateChange(eventName, newState) {
		this._updateHelpBar(newState);
	}

	/**
	 * @private
	 */
	_onBuffering() {
		const promise = (new Promise((resolve) => {
				this._bufferingPromiseResolve = () => {
					resolve();
				};

				const callback = /** @type {function(string)} */ (this._bufferingPromiseResolve);
				this._player.on(this._player.EVENT_STATE_CHANGE, callback);
			}))
			.then(() => {
				const callback = /** @type {function(string)} */ (this._bufferingPromiseResolve);
				this._player.off(this._player.EVENT_STATE_CHANGE, callback);

				this._bufferingPromiseResolve = null;
			});

		app.services.throbber.wait(promise);
	}

	/**
	 * @param {string} eventName
	 * @param {string} description
	 * @private
	 */
	_onError(eventName, description) {
		if (this._bufferingPromiseResolve) {
			this._bufferingPromiseResolve();
		}

		let message = description;
		message = message.replace(/-/ig, ' ');
		message = message.charAt(0).toUpperCase() + message.slice(1);

		tube.popups.Simple.alert(['Error'], undefined, [message]);
	}

	/**
	 * @param {Event} event
	 * @private
	 */
	_onMoveOrClick(event) {
		if (this._container.contains(/** @type {Node} */(event.target))) {
			this._osd.showControls();
		}
	}
};
