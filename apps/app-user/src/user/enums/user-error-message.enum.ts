/**
 * 유저 에러 메세지
 */
export enum UserErrorMessage {
  UNAUTHORIZED = '인증이 올바르지 않습니다.',
  NOT_FOUND = '존재하지 않는 유저 입니다.',
  NOT_FOUND_PASSWORD = '비밀번호가 올바르지 않습니다.',
  INTERNAL_SERVER_ERROR = '알 수 없는 오류 입니다.',
  CONFLICT = '이미 존재하는 유저 입니다.',
}
