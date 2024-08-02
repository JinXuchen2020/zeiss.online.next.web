export enum CategoryType {
  '云课堂' = 0,
  '培训课程' = 1,
}

export enum CourseState {
  UnAllocate,
  UnPublish,
  Published
}

export enum SectionCategory {
  Video,
  Pdf,
}

export enum ExamType {
  SingleSelect,
  MultiSelect,
}

export enum ExamLevel {
  Low,
  Medium,
  High
}

export enum VideoStatus{
  init,
  play,
  pause,
  seeked,
  seeking,
  ended,
  disposing
}

export const USER_PROFILE = 'userProfile'
export const RESPONSIVE_THRESHOLD = 415

export const isOfType = <T>(item: any, itemKey : keyof T) : item is T => {
  return item[itemKey] !== undefined
}

export const isWxWorkBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();

  const regex = ua.match(/MicroMessenger/i);
  if(regex && regex.length > 0 && regex[0] === "micromessenger") {
    const wxwork = ua.match(/WxWork/i);
    if(wxwork && wxwork.length > 0 && wxwork[0] === "wxwork") {
      return true
    }
    else {
      return false
    }
  }
  else {
    return false
  }
}

export const isWxBrowser = () => {
  const ua = navigator.userAgent.toLowerCase();

  const regex = ua.match(/MicroMessenger/i);
  if(regex && regex.length > 0 && regex[0] === "micromessenger") {
    return true
  }
  else {
    return false
  }
}