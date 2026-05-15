// src/features/auth/constants/authConstants.js

/**
 * 인증 도메인 상수 모음.
 * 정규식, 길이 제한, 사용자 메시지를 캡슐화합니다.
 */

export const AUTH_RULES = Object.freeze({
  password: {
    minLength: 8,
    maxLength: 64,
    // 영문 + 숫자 + 특수문자 각 1자 이상
    regex: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9\s]).+$/,
  },
  nickname: {
    minLength: 2,
    maxLength: 16,
    // 한글, 영문, 숫자, 언더스코어 허용
    regex: /^[가-힣a-zA-Z0-9_]+$/,
  },
  phone: {
    // 010-1234-5678 또는 01012345678 모두 허용. 내부적으로는 숫자만 저장.
    regex: /^01[0-9]-?\d{3,4}-?\d{4}$/,
  },
  otp: {
    length: 6,
    expiresInSec: 180, // 3분
  },
});

export const AUTH_MESSAGES = Object.freeze({
  email: {
    required: '이메일을 입력해주세요.',
    invalid: '올바른 이메일 형식이 아닙니다.',
    duplicated: '이미 사용 중인 이메일입니다.',
  },
  password: {
    required: '비밀번호를 입력해주세요.',
    invalid: '비밀번호는 8자 이상이며 영문/숫자/특수문자를 모두 포함해야 합니다.',
    mismatch: '비밀번호가 일치하지 않습니다.',
  },
  nickname: {
    required: '닉네임을 입력해주세요.',
    invalid: '닉네임은 2~16자의 한글/영문/숫자만 사용 가능합니다.',
    duplicated: '이미 사용 중인 닉네임입니다.',
    notChecked: '닉네임 중복확인이 필요합니다.',
  },
  phone: {
    required: '전화번호를 입력해주세요.',
    invalid: '올바른 휴대폰 번호 형식이 아닙니다. (예: 010-1234-5678)',
    notVerified: '휴대폰 인증이 필요합니다.',
  },
  otp: {
    required: '인증번호를 입력해주세요.',
    invalid: '인증번호가 일치하지 않습니다.',
    expired: '인증번호가 만료되었습니다. 다시 요청해주세요.',
  },
  agreement: {
    terms: '서비스 이용약관에 동의해주세요.',
    privacy: '개인정보 처리방침에 동의해주세요.',
    age: '만 14세 이상임을 확인해주세요.',
  },
  generic: {
    unknown: '알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    network: '네트워크 연결을 확인해주세요.',
  },
});

export const PASSWORD_STRENGTH = Object.freeze({
  WEAK: 'weak',
  MEDIUM: 'medium',
  STRONG: 'strong',
});