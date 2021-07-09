let baseUrl = ''

if (import.meta.env.MODE === 'development') {
	baseUrl = ''
} else {
	let origin: string
	if (!window.location.origin) {
		origin =
			window.location.protocol +
			'//' +
			window.location.hostname +
			(window.location.port ? ':' + window.location.port : '')
	} else {
		origin = window.location.origin
	}
	baseUrl = origin
}

export const apiBaseUrl = baseUrl
