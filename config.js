/**
 * @return {Object}
 */
module.exports = () => {
	return {
		appNamespace: 'tube',
		servicesAutodetect: [
			'scenes'
		],
		samsung: {
			widgetConfig: {
				widget: {
					mouse: 'n'
				}
			}
		},
		scripts: [
			// 'script.js'
		],
		styles: [
			//'myStyle.css'
		],
		modules: [
			//'some-nodejs-zb-module'
		]
	};
};