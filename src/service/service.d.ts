export interface Result<T> {
  message: string; // 返回处理消息
  code: number; // 返回状态码
  data: T; // 返回数据
}