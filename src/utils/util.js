export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 格式化秒
 * @param seconds 秒
 * @returns {string}
 */
export function formatSecond(seconds) {
  const h = Math.floor((seconds / 3600) % 24);
  const m = Math.floor((seconds / 60) % 60);
  const s = Math.floor(seconds % 60);
  let resultS = '00:' + (s <= 9 ? `0${s.toString()}` : s.toString());
  let result = s <= 9 ? `0${s.toString()}` : s.toString()
  if (m >= 0) {
	resultS = ''
	result = (m <= 9 ? `0${m.toString()}` : m.toString()) + ":" + result;
  }
  if (h > 0) {
	resultS = ''
    result = (h <= 9 ? `0${h.toString()}` : h.toString()) + ":" + result;
  }
  return resultS ? resultS : result;
}