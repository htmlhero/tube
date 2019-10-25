goog.provide('tube.services.Player');
goog.require('tube.services.AbstractPlayer');
goog.require('zb.device.IDevice');
goog.require('zb.device.IVideo');
goog.require('zb.device.IViewPort');
goog.require('zb.device.aspectRatio.AspectRatio');
goog.require('zb.device.aspectRatio.Proportion');
goog.require('zb.device.aspectRatio.Transferring');
goog.require('zb.device.input.Keys');


tube.services.Player = class extends tube.services.AbstractPlayer {
	/**
	 * @param {tube.Application} app
	 * @param {zb.device.IDevice} device
	 */
	constructor(app, device) {
		const player = device.createVideo();
		super(player);

		/**
		 * @type {tube.Application}
		 * @private
		 */
		this._app = app;

		/**
		 * @type {zb.device.IViewPort}
		 * @private
		 */
		this._viewport = player.getViewport();
		this._viewport.setFullScreen(true);

		/**
		 * @type {Array<zb.device.aspectRatio.AspectRatio>}
		 * @private
		 */
		this._aspectRatioList = this._createAspectRatioList();

		if (this._aspectRatioList.length) {
			this.on(this.EVENT_LOADED_META_DATA, () => {
				this._viewport.setAspectRatio(this._aspectRatioList[0]);
			});
		}
	}

	/**
	 * @param {boolean} isVisible
	 */
	setVisible(isVisible) {
		if (isVisible) {
			this._app.showVideo();
		} else {
			this._app.hideVideo();
		}
	}

	/**
	 */
	show() {
		this.setVisible(true);
	}

	/**
	 */
	hide() {
		this.setVisible(false);
	}

	/**
	 * @param {zb.device.input.Keys} zbKey
	 * @param {(KeyboardEvent|WheelEvent)=} opt_e
	 * @return {boolean}
	 */
	processKey(zbKey, opt_e) {
		const keys = zb.device.input.Keys;

		switch (zbKey) {
			case keys.PLAY:
			case keys.PAUSE:
			case keys.PLAY_PAUSE:
				this.togglePlayPause();
				return true;
			case keys.VOLUME_DOWN:
				return this._volumeDown();
			case keys.VOLUME_UP:
				return this._volumeUp();
			case keys.MUTE:
				return this._toggleMuted();
			default:
				return false;
		}
	}

	/**
	 */
	togglePlayPause() {
		switch (this.getState()) {
			case zb.device.IVideo.State.PAUSED:
			case zb.device.IVideo.State.STOPPED:
				this.resume();
				break;
			case zb.device.IVideo.State.PLAYING:
			case zb.device.IVideo.State.SEEKING:
				this.pause();
				break;
		}
	}

	/**
	 */
	toggleAspectRatio() {
		if (this._viewport.hasFeatureAspectRatio()) {
			this._viewport.toggleAspectRatio(this._aspectRatioList);
		}
	}

	/**
	 * @return {Array<zb.device.aspectRatio.AspectRatio>}
	 * @private
	 */
	_createAspectRatioList() {
		const Proportion = zb.device.aspectRatio.Proportion.Common;
		const Transferring = zb.device.aspectRatio.Transferring;

		return [
				new zb.device.aspectRatio.AspectRatio(Proportion.AUTO, Transferring.LETTERBOX),
				new zb.device.aspectRatio.AspectRatio(Proportion.AUTO, Transferring.STRETCH),
				new zb.device.aspectRatio.AspectRatio(Proportion.X16X9, Transferring.LETTERBOX),
				new zb.device.aspectRatio.AspectRatio(Proportion.X4X3, Transferring.LETTERBOX)
			]
			.filter((ratio) => this._viewport.isAspectRatioSupported(ratio));
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_volumeDown() {
		if (this._app.isDeviceSamsung()) {
			return false;
		}

		this.volumeDown();
		return true;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_volumeUp() {
		if (this._app.isDeviceSamsung()) {
			return false;
		}

		this.volumeUp();
		return true;
	}

	/**
	 * @return {boolean}
	 * @private
	 */
	_toggleMuted() {
		if (this._app.isDeviceSamsung()) {
			return false;
		}

		this.setMuted(!this.getMuted());
		return true;
	}
};
