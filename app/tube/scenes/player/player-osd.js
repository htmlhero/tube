goog.provide('tube.scenes.PlayerOsd');
goog.require('tube.services.Player');
goog.require('tube.services.StateManager');
goog.require('tube.widgets.PlayerProgress');
goog.require('zb.Timeout');
goog.require('zb.device.IVideo');
goog.require('zb.device.input.Keys');
goog.require('zb.events.EventPublisher');


tube.scenes.PlayerOsd = class extends zb.events.EventPublisher {
	/**
	 * @override
	 * @param {tube.scenes.PlayerOsd.ItemMap} itemMap
	 */
	constructor(itemMap) {
		super();

		/**
		 * @const {number}
		 */
		this.CONTROLS_SHOW_TIME = 5 * 1000;

		/**
		 * Fired with: {?tube.scenes.PlayerOsd.State} newState, {?tube.scenes.PlayerOsd.State} oldState
		 * @const {string}
		 */
		this.EVENT_STATE_CHANGED = 'state-changed';

		/**
		 * @type {tube.services.StateManager}
		 * @private
		 */
		this._stateManager = this._createStateManager(itemMap);
		this._setState(null);

		/**
		 * @type {zb.Timeout}
		 * @private
		 */
		this._controlsTimer = new zb.Timeout(this.hideControls.bind(this), this.CONTROLS_SHOW_TIME);

		/**
		 * @type {?tube.services.Player}
		 * @private
		 */
		this._player = null;

		this._onPlayerStateChange = this._onPlayerStateChange.bind(this);
		this.on(this.EVENT_STATE_CHANGED, this._onOsdStateChanged.bind(this));
	}

	/**
	 */
	beforeDOMShow() {
		this.showControls();
	}

	/**
	 */
	afterDOMHide() {
		this.hideControls();
	}

	/**
	 * @param {zb.device.input.Keys} zbKey
	 * @param {KeyboardEvent|WheelEvent=} opt_e
	 * @return {boolean} True if Key handled, false if not
	 */
	processKey(zbKey, opt_e) {
		const keys = zb.device.input.Keys;

		if (this._isControlsVisible() || this._isEmpty()) {
			const isEnter = zbKey === keys.ENTER;
			const isUp = zbKey === keys.UP;
			const isDown = zbKey === keys.DOWN;
			const isLeft = zbKey === keys.LEFT;
			const isRight = zbKey === keys.RIGHT;
			const isNavigation = isUp || isDown || isLeft || isRight;
			const isOnlyControlsShow = this._isEmpty() && (isEnter || isNavigation);

			this.showControls();

			return isOnlyControlsShow;
		}

		return false;
	}

	/**
	 * @param {?tube.services.Player} player
	 */
	setPlayer(player) {
		if (this._player) {
			this._player.off(this._player.EVENT_PLAY, this._onPlayerStateChange);
			this._player.off(this._player.EVENT_PAUSE, this._onPlayerStateChange);
			this._player.off(this._player.EVENT_STOP, this._onPlayerStateChange);
			this._player.off(this._player.EVENT_ENDED, this._onPlayerStateChange);
		}

		this._player = player;

		if (this._player) {
			this._player.on(this._player.EVENT_PLAY, this._onPlayerStateChange);
			this._player.on(this._player.EVENT_PAUSE, this._onPlayerStateChange);
			this._player.on(this._player.EVENT_STOP, this._onPlayerStateChange);
			this._player.on(this._player.EVENT_ENDED, this._onPlayerStateChange);
		}
	}

	/**
	 */
	showControls() {
		switch (this._getPlayerState()) {
			case zb.device.IVideo.State.INITED:
			case zb.device.IVideo.State.UNINITED:
			case zb.device.IVideo.State.DEINITED:
			case zb.device.IVideo.State.PAUSED:
			case zb.device.IVideo.State.STOPPED:
			case zb.device.IVideo.State.ERROR:
			case null:
				this._controlsTimer.stop();
				break;
			default:
				this._controlsTimer.restart();
				break;
		}

		this._setState(tube.scenes.PlayerOsd.State.CONTROLS);
	}

	/**
	 */
	hideControls() {
		this._setState(null);
	}

	/**
	 * @param {tube.scenes.PlayerOsd.ItemMap} itemMap
	 * @return {tube.services.StateManager}
	 * @private
	 */
	_createStateManager(itemMap) {
		const itemList = Object.keys(itemMap).map((key) => itemMap[key]);

		const stateManager = new tube.services.StateManager(itemList);

		stateManager.registerState(tube.scenes.PlayerOsd.State.CONTROLS, [
			itemMap.title,
			itemMap.shadow,
			itemMap.progress,
			itemMap.helpBar
		]);

		return stateManager;
	}

	/**
	 * @param {?tube.scenes.PlayerOsd.State} newState
	 * @private
	 */
	_setState(newState) {
		const oldState = this._stateManager.getState();

		if (newState === oldState) {
			return;
		}

		this._stateManager.setState(newState);
		this._fireEvent(this.EVENT_STATE_CHANGED, newState, oldState);
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isControlsVisible() {
		return this._stateManager.getState() === tube.scenes.PlayerOsd.State.CONTROLS;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_isEmpty() {
		return this._stateManager.getState() === null;
	}

	/**
	 * @return {zb.device.IVideo.State|null}
	 * @private
	 */
	_getPlayerState() {
		return this._player ? this._player.getState() : null;
	}

	/**
	 * @private
	 */
	_onPlayerStateChange() {
		switch (this._getPlayerState()) {
			case zb.device.IVideo.State.INITED:
			case zb.device.IVideo.State.UNINITED:
			case zb.device.IVideo.State.DEINITED:
			case zb.device.IVideo.State.PLAYING:
			case zb.device.IVideo.State.PAUSED:
			case zb.device.IVideo.State.STOPPED:
			case zb.device.IVideo.State.ERROR:
				if (this._isControlsVisible() || this._isEmpty()) {
					this.showControls();
				}
				break;
		}
	}

	/**
	 * @param {string} eventName
	 * @param {tube.scenes.PlayerOsd.State|null} newState
	 * @param {tube.scenes.PlayerOsd.State|null} oldState
	 * @private
	 */
	_onOsdStateChanged(eventName, newState, oldState) {
		if (oldState === tube.scenes.PlayerOsd.State.CONTROLS) {
			this._controlsTimer.stop();
		}
	}
};


/**
 * @enum {string}
 */
tube.scenes.PlayerOsd.State = {
	CONTROLS: 'controls'
};


/**
 * @typedef {{
 *     title: HTMLElement,
 *     shadow: HTMLElement,
 *     progress: tube.widgets.PlayerProgress,
 *     helpBar: HTMLElement
 * }}
 */
tube.scenes.PlayerOsd.ItemMap;
