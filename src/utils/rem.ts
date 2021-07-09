const setHtmlFontSize = (): void => {
	const deviceWidth = document.documentElement.clientWidth
	let fontSize = 10
	if (deviceWidth > 1400) {
		fontSize = deviceWidth / (1920 / 10)
	}

	document.getElementsByTagName('html')[0].style.cssText = 'font-size:' + fontSize + 'px !important'
}
if (window.addEventListener) {
	window.addEventListener(
		'resize',
		() => {
			setHtmlFontSize()
		},
		false
	)
}
setHtmlFontSize()
