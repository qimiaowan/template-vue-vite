const $Message: any = console
const showMessage = Symbol('showMessage')
let messageInstance: any = null
class DoneMessage {
	[showMessage](type: any, options: any, single: any) {
		if (messageInstance && single) {
			messageInstance.close()
		}
		messageInstance = $Message[type](options)
	}
	info(options: any, single = true) {
		this[showMessage]('info', options, single)
	}
	warning(options: any, single = true) {
		this[showMessage]('warning', options, single)
	}
	error(options: any, single = true) {
		this[showMessage]('error', options, single)
	}
	success(options: any, single = true) {
		this[showMessage]('success', options, single)
	}
}
export default new DoneMessage()
