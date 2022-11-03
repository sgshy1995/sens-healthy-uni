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
const getUserInfoByUsernameUrl = (username:string)=>`/user/username/${username}`
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

// 认证 身份证正面 上传
const authenticateIdentityCardFrontUploadUrl = '/authenticate/upload/identity_card_front'
export const authenticateIdentityCardFrontUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: authenticateIdentityCardFrontUploadUrl
	},path)
}

// 认证 身份证背面 上传
const authenticateIdentityCardBackUploadUrl = '/authenticate/upload/identity_card_back'
export const authenticateIdentityCardBackUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: authenticateIdentityCardBackUploadUrl
	},path)
}

// 认证 执业证照 上传
const authenticatePracticingCertificateUploadUrl = '/authenticate/upload/practicing_certificate'
export const authenticatePracticingCertificateUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: authenticatePracticingCertificateUploadUrl
	},path)
}

// 认证 工作证照 上传
const authenticateEmployeeCardUploadUrl = '/authenticate/upload/employee_card'
export const authenticateEmployeeCardUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: authenticateEmployeeCardUploadUrl
	},path)
}

// 认证 提交
const createAuthenticateUrl = '/authenticate'
export const createAuthenticateAction = (authenticate: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createAuthenticateUrl,
    method: 'POST',
	data: authenticate
  })
}

// 认证 重新提交 修改
const updateAuthenticateUrl = '/authenticate'
export const updateAuthenticateAction = (authenticate: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateAuthenticateUrl,
    method: 'PUT',
	data: authenticate
  })
}

// 认证 根据 用户id获取
const findOneAuthenticateByUserIdUrl = '/authenticate/jwt'
export const findOneAuthenticateByUserIdAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: findOneAuthenticateByUserIdUrl,
    method: 'GET'
  })
}

// 根据 jwt 信息充值
const addBalanceByUserIdUrl = '/user_info/balance/add'
export const addBalanceByUserIdAction = (balance: string, payment_type: number): Promise<Record<string,any>> => {
  return doRequestAction({
    url: addBalanceByUserIdUrl,
    method: 'PUT',
	data: {balance, payment_type}
  })
}

// 充值订单列表获取
const getTopUpOrdersByUserIdUrl = '/top_up_order'
export const getTopUpOrdersByUserIdAction = (order_type: string, order: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getTopUpOrdersByUserIdUrl,
    method: 'GET',
	data: {order_type, order}
  })
}

// 购物车课程下单
const addChartCourseOrderByUserIdUrl = '/user_info/chart_course_order'
export const addChartCourseOrderByUserIdAction = (info: {course_chart_ids: string, course_info: { course_ids: string, course_types: string, payment_num: string, order_prices: string }, order_time: string, payment_type: number}): Promise<Record<string,any>> => {
  return doRequestAction({
    url: addChartCourseOrderByUserIdUrl,
    method: 'POST',
	data: info
  })
}

// 普通课程下单
const addNormalCourseOrderByUserIdUrl = '/user_info/normal_course_order'
export const addNormalCourseOrderByUserIdAction = (info: {course_info: { course_ids: string, course_types: string, payment_num: string, order_prices: string }, order_time: string, payment_type: number}): Promise<Record<string,any>> => {
  console.log('addNormalCourseOrderByUserIdAction ---', info)
  return doRequestAction({
    url: addNormalCourseOrderByUserIdUrl,
    method: 'POST',
	data: info
  })
}

// 购物车器材下单
const addChartEquipmentOrderByUserIdUrl = '/user_info/chart_equipment_order'
export const addChartEquipmentOrderByUserIdAction = (info: {equipment_chart_ids: string, equipment_info: { equipment_ids: string, model_ids: string, order_nums: string, course_types: string, payment_num: string }, shipping_address: string, shipping_name: string, shipping_phone: string, order_time: string, payment_type: number}): Promise<Record<string,any>> => {
  return doRequestAction({
    url: addChartEquipmentOrderByUserIdUrl,
    method: 'POST',
	data: info
  })
}

// 普通器材下单
const addNormalEquipmentOrderByUserIdUrl = '/user_info/normal_equipment_order'
export const addNormalEquipmentOrderByUserIdAction = (info: {equipment_info: { equipment_ids: string, model_ids: string, order_nums: string, course_types: string, payment_num: string }, shipping_address: string, shipping_name: string, shipping_phone: string, order_time: string, payment_type: number}): Promise<Record<string,any>> => {
  console.log('addNormalEquipmentOrderByUserIdAction ---', info)
  return doRequestAction({
    url: addNormalEquipmentOrderByUserIdUrl,
    method: 'POST',
	data: info
  })
}

// 根据 jwt 信息获取课程订单
const findManyCourseOrdersByUserIdUrl = '/course_order/user'
export const findManyCourseOrdersByUserIdAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: findManyCourseOrdersByUserIdUrl,
    method: 'GET'
  })
}

// 根据 订单号 获取课程订单
const findCourseOrderByOrderNoUrl = (order_no: string) => `/course_order/order_no/${order_no}`
export const findCourseOrderByOrderNoAction = (order_no: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: findCourseOrderByOrderNoUrl(order_no),
    method: 'GET'
  })
}

// 根据 jwt 信息获取器材订单
const findManyEquipmentOrdersByUserIdUrl = '/equipment_order/user'
export const findManyEquipmentOrdersByUserIdAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: findManyEquipmentOrdersByUserIdUrl,
    method: 'GET'
  })
}

// 根据 订单号 获取器材订单
const findEquipmentOrderByOrderNoUrl = (order_no: string) => `/equipment_order/order_no/${order_no}`
export const findEquipmentOrderByOrderNoAction = (order_no: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: findEquipmentOrderByOrderNoUrl(order_no),
    method: 'GET'
  })
}

// 根据 订单号 确认收货
const receiveOrderShipmentUrl = (order_no: string) => `/equipment_order/receive/${order_no}`
export const receiveOrderShipmentAction = (order_no: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: receiveOrderShipmentUrl(order_no),
    method: 'POST'
  })
}

// 更新用户信息
const updateUserUrl = (id:number)=>`/user/id/${id}`
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

// 根据 jwt 自动获取地址列表
const getAddressListByJWTUrl = '/address'
export const getAddressListByJWTAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getAddressListByJWTUrl,
    method: 'GET'
  })
}

// 根据id地址获取
const getAddressByIdUrl = (id:string)=>`/address/${id}`
export const getAddressByIdAction = (id:string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getAddressByIdUrl(id),
    method: 'GET'
  })
}

// 创建地址
const createAddressUrl = '/address'
export const createAddressAction = (address: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createAddressUrl,
    method: 'POST',
	data: address
  })
}

// 更新地址
const updateAddressUrl = '/address'
export const updateAddressAction = (address: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateAddressUrl,
    method: 'PUT',
	data: address
  })
}

// 根据id地址删除
const deleteAddressByIdUrl = (id:string)=>`/address/${id}`
export const deleteAddressByIdAction = (id:string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteAddressByIdUrl(id),
    method: 'DELETE'
  })
}

// 问题列表获取
const getQuestionsUrl = '/pain_question'
export const getQuestionsAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getQuestionsUrl,
    method: 'GET'
  })
}

// 自定义问题列表获取
const getCustomQuestionsUrl = '/pain_question/custom'
export const getCustomQuestionsAction = (question: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getCustomQuestionsUrl,
    method: 'GET',
	data: question
  })
}

// 根据id问题获取
const getQuestionByIdUrl = (id:string)=>`/pain_question/${id}`
export const getQuestionByIdAction = (id:string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getQuestionByIdUrl(id),
    method: 'GET'
  })
}

// 创建问题
const createQuestionsUrl = '/pain_question'
export const createQuestionsAction = (question: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createQuestionsUrl,
    method: 'POST',
	data: question
  })
}

// 更新问题
const updateQuestionUrl = '/pain_question'
export const updateQuestionAction = (question: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateQuestionUrl,
    method: 'PUT',
	data: question
  })
}

// 更新问题收藏
const updateQuestionCollectUrl = '/pain_question/collect'
export const updateQuestionCollectAction = (id: string, status: number): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateQuestionCollectUrl,
    method: 'PUT',
	data: {
		id,
		status
	}
  })
}

// 问题影像资料上传
const questionUploadUrl = '/pain_question/upload/data'
export const questionUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: questionUploadUrl
	},path)
}

// 答复列表获取
const getRepliesUrl = '/pain_reply/custom'
export const getRepliesAction = (question_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getRepliesUrl,
    method: 'GET',
	data: {question_id}
  })
}

// 创建答复
const createReplyUrl = '/pain_reply'
export const createReplyAction = (reply: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createReplyUrl,
    method: 'POST',
	data: reply
  })
}

// 更新答复
const updateReplyUrl = '/pain_reply'
export const updateReplyAction = (reply: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateReplyUrl,
    method: 'PUT',
	data: reply
  })
}

// 答复影像资料上传
const replyUploadUrl = '/pain_reply/upload/data'
export const replyUploadAction = (path:string): Promise<Record<string,any>> => {
	return doUploadAction({
		url: replyUploadUrl
	},path)
}

// 更新答复点赞
const updateReplyLikeUrl = '/pain_reply/like'
export const updateReplyLikeAction = (id: string, status: number): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateReplyLikeUrl,
    method: 'PUT',
	data: {
		id,
		status
	}
  })
}

// 创建评论
const createCommentUrl = '/pain_comment'
export const createCommentAction = (comment: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createCommentUrl,
    method: 'POST',
	data: comment
  })
}

// 更新答复点赞
const updateCommentLikeUrl = '/pain_comment/like'
export const updateCommentLikeAction = (id: string, status: number): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateCommentLikeUrl,
    method: 'PUT',
	data: {
		id,
		status
	}
  })
}

// 处方列表获取
const getPrescriptionUrl = '/prescription/custom'
export const getPrescriptionAction = (prescription: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getPrescriptionUrl,
    method: 'GET',
	data: prescription
  })
}

// 处方根据id获取
const getPrescriptionByIdUrl = (id:string)=>`/prescription/${id}`
export const getPrescriptionByIdAction = (id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getPrescriptionByIdUrl(id),
    method: 'GET'
  })
}

// 处方根据id增加观看人数
const addPrescriptionWatchNumUrl = (id:string)=>`/prescription/watch/${id}`
export const addPrescriptionWatchNumAction = (id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: addPrescriptionWatchNumUrl(id),
    method: 'POST'
  })
}


// 视频课程列表获取
const getVideoCourseUrl = '/video_course/custom'
export const getVideoCourseAction = (videoCourse: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getVideoCourseUrl,
    method: 'GET',
	data: videoCourse
  })
}

// 视频课程根据id获取
const getVideoCourseByIdUrl = (id:string)=>`/video_course/${id}`
export const getVideoCourseByIdAction = (id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getVideoCourseByIdUrl(id),
    method: 'GET'
  })
}

// 视频课程根据多个id获取
const getVideoCoursesByIdsUrl = '/video_course/find/ids'
export const getVideoCoursesByIdsAction = (ids: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getVideoCoursesByIdsUrl,
    method: 'GET',
	data: {
		ids
	}
  })
}

// 热门轮播课程列表获取
const getCarouselCoursesUrl = '/video_course/carousel'
export const getCarouselCoursesAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getCarouselCoursesUrl,
    method: 'GET'
  })
}

// 根据视频课程id获取视频列表
const getCourseInVideosByCourseIdUrl = (course_id:string)=>`/course_in_video/course/${course_id}`
export const getCourseInVideosByCourseIdAction = (course_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getCourseInVideosByCourseIdUrl(course_id),
    method: 'GET'
  })
}

// 直播课程列表获取
const getLiveCourseUrl = '/live_course/custom'
export const getLiveCourseAction = (liveCourse: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getLiveCourseUrl,
    method: 'GET',
	data: liveCourse
  })
}

// 直播课程根据id获取
const getLiveCourseByIdUrl = (id:string)=>`/live_course/${id}`
export const getLiveCourseByIdAction = (id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getLiveCourseByIdUrl(id),
    method: 'GET'
  })
}

// 直播课程根据多个id获取
const getLiveCoursesByIdsUrl = '/live_course/find/ids'
export const getLiveCoursesByIdsAction = (ids: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getLiveCoursesByIdsUrl,
    method: 'GET',
	data: {
		ids
	}
  })
}

// 器材列表获取
const getEquipmentsUrl = '/equipment/custom'
export const getEquipmentsAction = (equipment: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getEquipmentsUrl,
    method: 'GET',
	data: equipment
  })
}

// 器材列表获取包括型号，无分页，传id集合
const getEquipmentsWithModelsUrl = '/equipment/with_models'
export const getEquipmentsWithModelsAction = (ids: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getEquipmentsWithModelsUrl,
    method: 'GET',
	data: {
		ids
	}
  })
}

// 器材根据id获取
const getEquipmentByIdUrl = (id:string)=>`/equipment/${id}`
export const getEquipmentByIdAction = (id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getEquipmentByIdUrl(id),
    method: 'GET'
  })
}

// 根据器材id获取型号列表
const getModelsByEquipmentIdUrl = (equipment_id:string)=>`/equipment_model/equipment/${equipment_id}`
export const getModelsByEquipmentIdAction = (equipment_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getModelsByEquipmentIdUrl(equipment_id),
    method: 'GET'
  })
}

// 轮播器材列表获取
const getCarouselEquipmentsUrl = '/equipment/carousel'
export const getCarouselEquipmentsAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getCarouselEquipmentsUrl,
    method: 'GET'
  })
}

// 加入课程购物车
const createCourseChartUrl = '/course_chart'
export const createCourseChartAction = (courseChart: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createCourseChartUrl,
    method: 'POST',
	data: courseChart
  })
}

// 课程购物车列表获取
const getCourseChartListUrl = '/course_chart'
export const getCourseChartListAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getCourseChartListUrl,
    method: 'GET'
  })
}

// 根据课程购物车id删除
const deleteCourseChartByIdUrl = (course_chart_id:string)=>`/course_chart/${course_chart_id}`
export const deleteCourseChartByIdAction = (course_chart_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteCourseChartByIdUrl(course_chart_id),
    method: 'DELETE'
  })
}

// 清空用户的课程购物车
const deleteCourseChartsByUserUrl = '/course_chart'
export const deleteCourseChartsByUserAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteCourseChartsByUserUrl,
    method: 'DELETE'
  })
}

// 加入器材购物车
const createEquipmentChartUrl = '/equipment_chart'
export const createEquipmentChartAction = (equipmentChart: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createEquipmentChartUrl,
    method: 'POST',
	data: equipmentChart
  })
}

// 器材购物车列表获取
const getEquipmentChartListUrl = '/equipment_chart'
export const getEquipmentChartListAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getEquipmentChartListUrl,
    method: 'GET'
  })
}

// 根据器材购物车id删除
const deleteEquipmentChartByIdUrl = (equipment_chart_id:string)=>`/equipment_chart/${equipment_chart_id}`
export const deleteEquipmentChartByIdAction = (equipment_chart_id: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteEquipmentChartByIdUrl(equipment_chart_id),
    method: 'DELETE'
  })
}

// 根据器材购物车的多个id删除
const deleteEquipmentChartByIdsUrl = '/equipment_chart/ids/delete'
export const deleteEquipmentChartByIdsAction = (ids: string[]): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteEquipmentChartByIdsUrl,
    method: 'DELETE',
	data: ids
  })
}

// 清空用户的器材购物车
const deleteEquipmentChartsByUserUrl = '/equipment_chart/user/delete'
export const deleteEquipmentChartsByUserAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteEquipmentChartsByUserUrl,
    method: 'DELETE'
  })
}

// 更新器材购物车型号数量
const updateEquipmentChartAddNumUrl = '/equipment_chart/num'
export const updateEquipmentChartAddNumAction = (id: string, type: "reduce" | "add"): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateEquipmentChartAddNumUrl,
    method: 'PUT',
	data: {id, type}
  })
}

// 讲师时间段列表获取
const getLecturerTimesListUrl = '/lecturer_time'
export const getLecturerTimesListAction = (): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getLecturerTimesListUrl,
    method: 'GET'
  })
}

// 患者可预约时间段列表获取
const getLecturerTimesCanBeBookedListUrl = '/lecturer_time/can_be_booked'
export const getLecturerTimesCanBeBookedListAction = (options: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getLecturerTimesCanBeBookedListUrl,
    method: 'GET',
	data: options
  })
}

// 讲师时间段添加
const createLecturerTimeUrl = '/lecturer_time'
export const createLecturerTimeAction = (lecturerTime: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createLecturerTimeUrl,
    method: 'POST',
	data: lecturerTime
  })
}

// 讲师时间段更新
const updateLecturerTimeUrl = '/lecturer_time/normal'
export const updateLecturerTimeAction = (lecturerTime: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateLecturerTimeUrl,
    method: 'PUT',
	data: lecturerTime
  })
}

// 根据讲师时间段id删除
const deleteLecturerTimeUrl = '/lecturer_time/normal'
export const deleteLecturerTimeAction = (id: string, canceled_reason?: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: deleteLecturerTimeUrl,
    method: 'DELETE',
	data: {
		id,
		canceled_reason
	}
  })
}

// 患者课程列表获取
const getPatientCoursesListUrl = '/patient_course'
export const getPatientCoursesListAction = (options: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: getPatientCoursesListUrl,
    method: 'GET',
	data: options
  })
}

// 发起预约
const createBookUrl = '/book'
export const createBookAction = (book: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: createBookUrl,
    method: 'POST',
	data: book
  })
}

// 修改预约
const updateBookUrl = '/book/normal'
export const updateBookAction = (book: Record<string,any>): Promise<Record<string,any>> => {
  return doRequestAction({
    url: updateBookUrl,
    method: 'PUT',
	data: book
  })
}

// 取消预约
const cancelBookUrl = '/book/normal'
export const cancelBookAction = (id: string, canceled_reason: string): Promise<Record<string,any>> => {
  return doRequestAction({
    url: cancelBookUrl,
    method: 'DELETE',
	data: {
		id,
		canceled_reason
	}
  })
}