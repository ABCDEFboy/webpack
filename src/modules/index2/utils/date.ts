/**
 * @class
 * 时间操作相关的工具函数
 */
class DateUtils {
  /**
   *formatTimeString 获取hh:mm:ss
   *@param: time 单位为s
   *
   */
  static formatTimeString = (time: number) => {
    let hours: string | number = Math.floor(time / 3600);
    const minuteTime = time % 3600;
    let minutes: string | number = Math.floor(minuteTime / 60);
    const secondTime = minuteTime % 60;
    let seconds: string | number = Math.round(secondTime);
    if (hours < 10) hours = `0${hours}`;
    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  };
}

export default DateUtils;
