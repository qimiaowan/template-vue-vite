/**
 * 防抖
 * @param fn 函数
 * @param delay 间隔时间，毫秒
 */
export function debounce<C, T extends unknown[]>(
	fn: (this: C, ...args: T) => void,
	delay = 200
): (this: C, ...args: T) => void {
	let lastFn = 0
	return function (...args: T) {
		if (lastFn) {
			window.clearTimeout(lastFn)
		}
		lastFn = window.setTimeout(() => {
			lastFn = 0
			fn.call(this, ...args)
		}, delay)
	}
}

/**
 * 引用与非引用值 深拷贝方法
 * @param data
 */
export function deepClone<T>(data: T): T {
	if (typeof data !== 'object' || typeof data == 'function' || data === null) {
		return data
	}

	let item: any
	if (Array.isArray(data)) {
		item = []
	}

	if (!Array.isArray(data)) {
		item = {}
	}

	for (const i in data) {
		if (Object.prototype.hasOwnProperty.call(data, i)) {
			item[i] = deepClone(data[i])
		}
	}

	return item
}
