/**
 * 封装axios请求
 * GET | POST | PUT | DELETE
 * 错误校验code定义：
 * 401         token不合法，跳转到登录页面
 * 403         无权限
 * 500         服务器内部错误
 */
import message from '../lib/resetMessage'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios'

// import router from '@/router'
// import cacheStorage from '@/utils/cacheStorage'

import { apiBaseUrl } from '@/config'
import { debounce } from '@/utils/common'

// loading对象
let loading: any
// 当前正在请求的数量
let needLoadingRequestCount = 0
// 当前loading对象
let currentLoadingTarget: any = ''
// 显示loading
function showLoading(target = 'body') {
	if (needLoadingRequestCount === 0 && !loading) {
		loading = '加载中'
		currentLoadingTarget = document.querySelector(target) as HTMLImageElement
		currentLoadingTarget && currentLoadingTarget.classList.add('disabled')
	}
	needLoadingRequestCount++
}
// 防抖：将 300ms 间隔内的关闭 loading 便合并为一次。防止连续请求时， loading闪烁的问题。
const toHideLoading = debounce(() => {
	// loading && loading.close()
	loading = null
	currentLoadingTarget && currentLoadingTarget.classList.remove('disabled')
}, 300)
// 隐藏loading
function hideLoading() {
	needLoadingRequestCount--
	needLoadingRequestCount = Math.max(needLoadingRequestCount, 0) // 做个保护
	if (needLoadingRequestCount === 0) {
		// 关闭loading
		toHideLoading()
	}
}

const axiosInstance: AxiosInstance | any = axios.create({
	baseURL: apiBaseUrl,
	timeout: 6000,
	responseType: 'json',
	withCredentials: false,
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
		'Cache-Control': 'no-cache'
	}
})
const pending: any = [] // 声明一个数组用于存储每个请求的取消函数和axios标识
const cancelToken: any = axios.CancelToken

const deletePendingByConfig = (config: any, isCancel: boolean) => {
	const u: string = config.url + config.method
	const index = pending.findIndex((o: any) => o.u === u)
	if (index > -1) {
		if (isCancel) {
			pending[index].f() // 执行取消操作
			console.warn(`节流检测${config.url}`)
		}
		pending.splice(index, 1)
	}
}

axiosInstance.interceptors.request.use(async (config: any) => {
	deletePendingByConfig(config, true)
	// get请求接口时url加时间戳
	if (config.method === 'get') {
		config.url += (config.url.indexOf('?') === -1 ? '?_=' : '&_=') + new Date().getTime()
	}
	config.cancelToken = new cancelToken((c: any) => {
		// 本次axios请求的配置添加cancelToken
		pending.push({
			u: config.url + config.method,
			f: c
		})
	})

	// 判断当前请求是否设置了不显示Loading
	if (config.headers.showLoading) {
		showLoading(config.headers.loadingTarget)
	}
	return config
})
interface Result {
	ready: boolean
	data: any
}
const dealBulkData = (responseBody: any) => {
	const { data } = responseBody
	const result: Result = {
		ready: true,
		data
	}
	return result
}
/* 处理退出响应拦截器 */
// 响应 拦截器 的第二个参数, err 可以捕获状态, 来进行响应的处理
axiosInstance.interceptors.response.use(
	async (response: any) => {
		// 判断当前请求是否设置了不显示Loading（不显示自然无需隐藏）
		if (response.config.headers.showLoading !== false) {
			hideLoading()
		}
		if (response.status === 200) {
			deletePendingByConfig(response.config, false)
			if (response.data && response.data.code) {
				switch (response.data.code) {
					case '200':
						return dealBulkData(response.data)
						break
					case '401':
						message.warning('登录已过期或不合法，请重新登录')
						return Promise.reject('登录已过期或不合法，请重新登录')
						break
					case '403':
						message.error('无权限！')
						break
					// 系统异常
					case '500':
						message.error('系统异常，请联系系统管理员')
						break
					default:
						message.warning(response.data.message)
						break
				}
			}
			return response.data
		} else {
			return response
		}
	},
	(err: any) => {
		hideLoading()
		if (err) {
			console.error(`拦截器异常捕获：${err}`)
			if (err.code === 'ECONNABORTED') {
				message.error('请求超时！')
			}
		}
		if (err && err.response) {
			switch (err.response.status) {
				case 400:
					message.error('请求错误')
					break
				case 401:
					message.error('未授权，请登录')
					break
				case 403:
					message.error('拒绝访问')
					break
				case 404:
					message.error(`请求地址出错`)
					break
				case 408:
					message.error('请求超时')
					break
				case 500:
					message.error('服务不可用')
					break
				case 501:
					message.error('服务未实现')
					break
				case 502:
					message.error('网关错误')
					break
				case 503:
					message.error('服务不可用')
					break
				case 504:
					message.error('网关超时')
					break
				case 505:
					message.error('HTTP版本不受支持')
					break
				default:
					break
			}
		}
		return Promise.reject(err)
	}
)

const errorHandler = (error: any) => {
	return Promise.reject('please try again!' + error)
}

/**
 * @param url$
 * @param params
 * @param config
 */
export const get = (url: string, config: AxiosRequestConfig = {}): AxiosPromise<any> => {
	return axiosInstance.get(url, config.headers ? config : { params: config }).then(
		(res: any) => res,
		(err: any) => errorHandler(err)
	)
}
export const post = (
	url: string,
	data?: any,
	config?: AxiosRequestConfig | undefined
): AxiosPromise<any> => {
	return axiosInstance.post(url, data, config).then(
		(res: any) => res,
		(err: any) => errorHandler(err)
	)
}
export const del = (url: string, config?: AxiosRequestConfig | undefined): AxiosPromise<any> => {
	return axiosInstance.delete(url, config).then(
		(res: any) => res,
		(err: any) => errorHandler(err)
	)
}
export const put = (
	url: string,
	data?: any,
	config?: AxiosRequestConfig | undefined
): AxiosPromise<any> => {
	return axiosInstance.put(url, data, config).then(
		(res: any) => res,
		(err: any) => errorHandler(err)
	)
}
