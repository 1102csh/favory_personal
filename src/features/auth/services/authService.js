// src/features/auth/services/authService.js
import { authRepository } from '../api/authRepository';
import { profileRepository } from '../api/profileRepository';
import { AuthError, AUTH_ERROR_CODES } from '../../../shared/lib/errors/AuthError';
import { AUTH_MESSAGES } from '../constants/authConstants';
import { normalizePhone } from '../../../shared/lib/validators/phoneFormatter';

/**
 * Supabase 원시 에러를 도메인 AuthError로 변환.
 */
const mapSupabaseError = (error) => {
    if (!error) return null;
    const msg = error.message?.toLowerCase() ?? '';

    if (msg.includes('already registered') || msg.includes('already exists')) {
        return new AuthError(
            AUTH_ERROR_CODES.EMAIL_DUPLICATED,
            AUTH_MESSAGES.email.duplicated,
            error
        );
    }
    if (msg.includes('invalid login') || msg.includes('invalid credentials')) {
        return new AuthError(
            AUTH_ERROR_CODES.INVALID_CREDENTIALS,
            '이메일 또는 비밀번호가 올바르지 않습니다.',
            error
        );
    }
    if (msg.includes('email not confirmed')) {
        return new AuthError(
            AUTH_ERROR_CODES.EMAIL_NOT_CONFIRMED,
            '이메일 인증이 완료되지 않았습니다. 메일함을 확인해주세요.',
            error
        );
    }
    return new AuthError(AUTH_ERROR_CODES.UNKNOWN, AUTH_MESSAGES.generic.unknown, error);
};

export const authService = {
    /**
     * 회원가입 전체 흐름:
     * 1) 닉네임 중복 재확인 (race condition 방지)
     * 2) Supabase Auth 가입
     * 3) profiles 테이블 row 생성
     * 4) 실패 시 가능한 한 보상 트랜잭션 시도
     *
     * @param {{
     *   email: string,
     *   password: string,
     *   nickname: string,
     *   phone: string,           // 정규화된 숫자만
     *   phoneVerified: boolean,
     *   agreements: { terms: boolean, privacy: boolean, age: boolean, marketing?: boolean }
     * }} input
     */
    async signUp(input) {
        const { email, password, nickname, phone, phoneVerified, agreements } = input;

        if (!phoneVerified) {
            throw new AuthError(AUTH_ERROR_CODES.PHONE_NOT_VERIFIED, AUTH_MESSAGES.phone.notVerified);
        }

        // 1) 닉네임 사전 중복확인 (UX용 — 트리거에서도 한 번 더 검증)
        const isAvailable = await profileRepository.isNicknameAvailable(nickname);
        if (!isAvailable) {
            throw new AuthError(AUTH_ERROR_CODES.NICKNAME_DUPLICATED, AUTH_MESSAGES.nickname.duplicated);
        }

        // 2) Supabase Auth 가입 — user_metadata로 트리거에 데이터 전달
        const { data, error } = await authRepository.signUpWithEmail({
            email,
            password,
            metadata: {
                nickname,
                phone: normalizePhone(phone),
                phone_verified: true,
                agreed_marketing: !!agreements.marketing,
            },
        });

        if (error) {
            // 트리거에서 NICKNAME_DUPLICATED를 던지면 Supabase가 500을 반환하면서
            // 메시지에 해당 문자열이 포함됨 — 이를 에러 매핑에 추가
            if (error.message?.includes('NICKNAME_DUPLICATED')) {
                throw new AuthError(AUTH_ERROR_CODES.NICKNAME_DUPLICATED, AUTH_MESSAGES.nickname.duplicated, error);
            }
            throw mapSupabaseError(error);
        }
        if (!data.user) throw new AuthError(AUTH_ERROR_CODES.UNKNOWN, AUTH_MESSAGES.generic.unknown);

        return { userId: data.user.id, needsEmailConfirm: !data.session };
    },

    async signIn({ email, password }) {
        const { data, error } = await authRepository.signInWithEmail({ email, password });
        if (error) throw mapSupabaseError(error);
        return data;
    },

    async signOut() {
        const { error } = await authRepository.signOut();
        if (error) throw mapSupabaseError(error);
    },

    async sendPasswordReset(email) {
        const { error } = await authRepository.sendPasswordResetEmail(email);
        if (error) throw mapSupabaseError(error);
    },

    /**
     * 소셜 로그인 (Google/Kakao만 지원, Naver는 별도 서비스).
     */
    async signInWithSocial(provider) {
        if (!['google', 'kakao'].includes(provider)) {
            throw new AuthError(AUTH_ERROR_CODES.OAUTH_FAILED, '지원하지 않는 로그인 방식입니다.');
        }
        const { error } = await authRepository.signInWithOAuth(provider);
        if (error) throw mapSupabaseError(error);
    },

    async checkNicknameAvailability(nickname) {
        return profileRepository.isNicknameAvailable(nickname);
    },

    async resendSignupEmail(email) {
        const { error } = await authRepository.resendSignupEmail(email);
        if (error) throw mapSupabaseError(error);
    },

    async updatePassword(newPassword) {
        const { error } = await authRepository.updatePassword(newPassword);
        if (error) throw mapSupabaseError(error);
    },

    async completeSocialProfile({ userId, nickname, phone, phoneVerified, agreements }) {
        if (!phoneVerified) {
            throw new AuthError(AUTH_ERROR_CODES.PHONE_NOT_VERIFIED, AUTH_MESSAGES.phone.notVerified);
        }

        // 닉네임 중복 검사
        const isAvailable = await profileRepository.isNicknameAvailable(nickname);
        if (!isAvailable) {
            throw new AuthError(AUTH_ERROR_CODES.NICKNAME_DUPLICATED, AUTH_MESSAGES.nickname.duplicated);
        }

        const now = new Date().toISOString();
        const { data, error } = await profileRepository.completeProfile(userId, {
            nickname,
            phone: normalizePhone(phone),
            phone_verified_at: now,
            terms_agreed_at: agreements.terms ? now : null,
            privacy_agreed_at: agreements.privacy ? now : null,
            age_agreed_at: agreements.age ? now : null,
            marketing_agreed_at: agreements.marketing ? now : null,
        });

        if (error) throw mapSupabaseError(error);
        return data;
    },
};