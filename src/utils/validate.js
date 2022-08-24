/**
 * 邮箱
 * @param {*} s
 */
export function isEmail(s) {
    return /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(s);
}

/**
 * 手机号码
 * @param {*} s
 */
export function isMobile(s) {
  return /^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(166)|(17[0,1,3,5,6,7,8])|(18[0-9])|(19[8|9|5]))\d{8}$|^0\d{2,3}-?\d{7,8}$/.test(s);
}