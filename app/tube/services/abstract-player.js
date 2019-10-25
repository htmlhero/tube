goog.provide('tube.services.AbstractPlayer');
goog.require('zb.device.IVideo');
goog.require('zb.events.EventPublisher');


/**
 * @implements {zb.device.IVideo}
 */
tube.services.AbstractPlayer = class extends zb.events.EventPublisher {
	/**
	 * @param {zb.device.IVideo} player
	 */
	constructor(player) {
		super();

		/**
		 * @override
		 */
		this.EVENT_LOAD_START = 'load-start';

		/**
		 * @override
		 */
		this.EVENT_TIME_UPDATE = 'time-update';

		/**
		 * @override
		 */
		this.EVENT_BUFFERING = 'buffering';

		/**
		 * @override
		 */
		this.EVENT_ERROR = 'error';

		/**
		 * @override
		 */
		this.EVENT_LOADED_META_DATA = 'loaded-meta-data';

		/**
		 * @override
		 */
		this.EVENT_ENDED = 'ended';

		/**
		 * @override
		 */
		this.EVENT_DURATION_CHANGE = 'duration-change';

		/**
		 * @override
		 */
		this.EVENT_PLAY = 'play';

		/**
		 * @override
		 */
		this.EVENT_PAUSE = 'pause';

		/**
		 * @override
		 */
		this.EVENT_STOP = 'stop';

		/**
		 * @override
		 */
		this.EVENT_RATE_CHANGE = 'rate-change';

		/**
		 * @override
		 */
		this.EVENT_VOLUME_CHANGE = 'volume-change';

		/**
		 * @override
		 */
		this.EVENT_STATE_CHANGE = 'state-change';

		/**
		 * @type {zb.device.IVideo}
		 * @private
		 */
		this._player = player;

		this._player.on(this._player.EVENT_LOAD_START, this._onLoadStart.bind(this));
		this._player.on(this._player.EVENT_TIME_UPDATE, this._onTimeUpdate.bind(this));
		this._player.on(this._player.EVENT_BUFFERING, this._onBuffering.bind(this));
		this._player.on(this._player.EVENT_ERROR, this._onError.bind(this));
		this._player.on(this._player.EVENT_LOADED_META_DATA, this._onLoadedMetaData.bind(this));
		this._player.on(this._player.EVENT_ENDED, this._onEnded.bind(this));
		this._player.on(this._player.EVENT_DURATION_CHANGE, this._onDurationChange.bind(this));
		this._player.on(this._player.EVENT_PLAY, this._onPlay.bind(this));
		this._player.on(this._player.EVENT_PAUSE, this._onPause.bind(this));
		this._player.on(this._player.EVENT_RATE_CHANGE, this._onRateChange.bind(this));
		this._player.on(this._player.EVENT_VOLUME_CHANGE, this._onVolumeChange.bind(this));
		this._player.on(this._player.EVENT_STATE_CHANGE, this._onStateChange.bind(this));
	}

	/**
	 * @override
	 */
	play(url, opt_startFrom) {
		this._player.play(url, opt_startFrom);
	}

	/**
	 * @override
	 */
	resume() {
		this._player.resume();
	}

	/**
	 * @override
	 */
	pause() {
		this._player.pause();
	}

	/**
	 * @override
	 */
	togglePause() {
		this._player.togglePause();
	}

	/**
	 * @override
	 */
	stop() {
		this._player.stop();
	}

	/**
	 * @override
	 */
	forward() {
		this._player.forward();
	}

	/**
	 * @override
	 */
	rewind() {
		return this._player.rewind();
	}

	/**
	 * @override
	 */
	destroy() {
		this._player.destroy();
	}

	/**
	 * @override
	 */
	setPlaybackRate(rate) {
		this._player.setPlaybackRate(rate);
	}

	/**
	 * @override
	 */
	getPlaybackRate() {
		return this._player.getPlaybackRate();
	}

	/**
	 * @override
	 */
	setPosition(milliseconds) {
		this._player.setPosition(milliseconds);
	}

	/**
	 * @override
	 */
	getPosition() {
		return this._player.getPosition();
	}

	/**
	 * @override
	 */
	getDuration() {
		return this._player.getDuration();
	}

	/**
	 * @override
	 */
	setVolume(value) {
		this._player.setVolume(value);
	}

	/**
	 * @override
	 */
	getVolume() {
		return this._player.getVolume();
	}

	/**
	 * @override
	 */
	volumeUp(opt_step) {
		return this._player.volumeUp(opt_step);
	}

	/**
	 * @override
	 */
	volumeDown(opt_step) {
		return this._player.volumeDown(opt_step);
	}

	/**
	 * @override
	 */
	isMuted() {
		return this._player.isMuted();
	}

	/**
	 * @override
	 */
	setMuted(value) {
		this._player.setMuted(value);
	}

	/**
	 * @override
	 */
	getMuted() {
		return this._player.getMuted();
	}

	/**
	 * @override
	 */
	toggleMuted() {
		this._player.toggleMuted();
	}

	/**
	 * @override
	 */
	getState() {
		return this._player.getState();
	}

	/**
	 * @override
	 */
	getViewport() {
		return this._player.getViewport();
	}

	/**
	 * @override
	 */
	getUrl() {
		return this._player.getUrl();
	}

	/**
	 * @param {string} eventName
	 * @private
	 */
	_onLoadStart(eventName) {
		this._fireEvent(this.EVENT_LOAD_START);
	}

	/**
	 * @param {string} eventName
	 * @param {number} position
	 * @private
	 */
	_onTimeUpdate(eventName, position) {
		this._fireEvent(this.EVENT_TIME_UPDATE, position);
	}

	/**
	 * @param {string} eventName
	 * @private
	 */
	_onBuffering(eventName) {
		this._fireEvent(this.EVENT_BUFFERING);
	}

	/**
	 * @param {string} eventName
	 * @param {string} error
	 * @private
	 */
	_onError(eventName, error) {
		this._fireEvent(this.EVENT_ERROR, error);
	}

	/**
	 * @param {string} eventName
	 * @private
	 */
	_onLoadedMetaData(eventName) {
		this._fireEvent(this.EVENT_LOADED_META_DATA);
	}

	/**
	 * @param {string} eventName
	 * @private
	 */
	_onEnded(eventName) {
		this._fireEvent(this.EVENT_ENDED);
	}

	/**
	 * @param {string} eventName
	 * @param {number} duration in milliseconds
	 * @private
	 */
	_onDurationChange(eventName, duration) {
		this._fireEvent(this.EVENT_DURATION_CHANGE, duration);
	}

	/**
	 * @param {string} eventName
	 * @private
	 */
	_onPlay(eventName) {
		this._fireEvent(this.EVENT_PLAY);
	}

	/**
	 * @param {string} eventName
	 * @private
	 */
	_onPause(eventName) {
		this._fireEvent(this.EVENT_PAUSE);
	}

	/**
	 * @param {string} eventName
	 * @param {number} rate
	 * @private
	 */
	_onRateChange(eventName, rate) {
		this._fireEvent(this.EVENT_RATE_CHANGE, rate);
	}

	/**
	 * @param {string} eventName
	 * @param {number} volume
	 * @private
	 */
	_onVolumeChange(eventName, volume) {
		this._fireEvent(this.EVENT_VOLUME_CHANGE, volume);
	}

	/**
	 * @param {string} eventName
	 * @param {zb.device.IVideo.State} newState
	 * @param {zb.device.IVideo.State} oldState
	 * @private
	 */
	_onStateChange(eventName, newState, oldState) {
		this._fireEvent(this.EVENT_STATE_CHANGE, newState, oldState);
	}
};
