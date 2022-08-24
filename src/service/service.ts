import {Result} from "./service.d";
import {doRequestAction,NoTokenJsonHeader,doUploadAction} from "./request";

// 注册 验证码
const captureUrl = '/auth/capture'
export const captureAction = (device_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: captureUrl,
    method: 'GET',
    header: NoTokenJsonHeader,
	data: {device_id}
  })
}

// 短信验证码
const capturePhoneUrl = '/auth/capture_phone'
export const capturePhoneAction = (device_id: string, phone: string, capture: string, ifReSend?: boolean): Promise<Record<string,any>> => {
  return doRequestAction({
    url: capturePhoneUrl,
    method: 'GET',
    header: NoTokenJsonHeader,
	data: {device_id, phone, capture, ifReSend}
  })
}

// 注册
const registerUrl = '/user'
export const registerAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: registerUrl,
    method: 'POST',
    header: NoTokenJsonHeader,
	data: user
  })
}

// 登录
const loginUrl = '/user/login'
export const loginAction = (device_id: string, phone: string, capture_phone: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: loginUrl,
    method: 'POST',
    header: NoTokenJsonHeader,
	data: {
		device_id,
		phone,
		capture_phone
	}
  })
}

// 根据 jwt 自动获取用户信息
const getUserInfoByJWTUrl = '/user'
export const getUserInfoByJWTAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getUserInfoByJWTUrl,
    method: 'GET'
  })
}

// 根据 username 获取用户信息
const getUserInfoByUsernameUrl = (username:string)=>`/user/${username}`
export const getUserInfoByUsernameAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getUserInfoByUsernameUrl(user.username),
    method: 'GET'
  })
}

// 头像上传
const avatarUploadUrl = '/user/upload_avatar'
export const avatarUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: avatarUploadUrl
	},path)
}

// 背景上传
const backgroundUploadUrl = '/user/upload_background'
export const backgroundUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: backgroundUploadUrl
	},path)
}

// 修改手机号短信验证码
const captureNewPhoneUrl = '/auth/new/capture_phone'
export const captureNewPhoneAction = (device_id: string, phone: string, username: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: captureNewPhoneUrl,
    method: 'GET',
	data: {device_id, phone, username}
  })
}

// 根据 jwt 信息自动获取个人信息
const getInfoByJwtUrl = '/user_info/user'
export const getInfoByJwtAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getInfoByJwtUrl,
    method: 'GET'
  })
}

// 根据 user_id 获取个人信息
const getInfoByUserIdUrl = (user_id:number)=>`/user_info/user/${user_id}`
export const getInfoByUserIdAction = (user_id:number): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getInfoByUserIdUrl(user_id),
    method: 'GET'
  })
}

// 根据 user_id 更新个人信息
const updateInfoByUserIdUrl = (user_id:number)=>`/user_info/user/${user_id}`
export const updateInfoByUserIdAction = (user_id: number, info: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateInfoByUserIdUrl(user_id),
    method: 'PUT',
	data: info
  })
}

// 个人信息影像资料上传
const infoUploadUrl = '/user_info/upload/data'
export const infoUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: infoUploadUrl
	},path)
}

// 更新用户信息
const updateUserUrl = (id:number)=>`/user/${id}`
export const updateUserAction = (user: Record<string,any>, device_id?: string, phone_capture?: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateUserUrl(user.id),
    method: 'PUT',
	data: {user, device_id, phone_capture}
  })
}

// 退出登录
const logoutUrl = '/user/logout'
export const logoutAction = (user: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: logoutUrl,
    method: 'POST',
	data: user
  })
}