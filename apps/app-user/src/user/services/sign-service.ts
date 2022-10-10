import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SignService {
  private kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
  private kakaoProfileUrl = 'https://kapi.kakao.com/v2/user/me';
  private kakaoRedirectUrlForSignUp = 'http://localhost:3000/user/signUp/kakao';
  private kakaoRedirectUrlForSignIn = 'http://localhost:3000/user/signIn/kakao';

  /**
   * 카카오 회원가입
   * @param code
   */
  async signUpForKakao(code: string) {
    const tokenResponse = await axios.post(
      this.kakaoTokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.AUTHENTICATION_KAKAO_API_KEY,
        redirect_uri: this.kakaoRedirectUrlForSignUp,
        code: code,
      }),
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    const userResponse = await axios.get(this.kakaoProfileUrl, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: 'Bearer ' + tokenResponse.data.access_token,
      },
    });

    return {
      header: userResponse.headers,
      data: userResponse.data,
    };
  }

  /**
   * 카카오 로그인
   * @param code
   */
  async signInForKakao(code: string) {
    const tokenResponse = await axios.post(
      this.kakaoTokenUrl,
      new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.AUTHENTICATION_KAKAO_API_KEY,
        redirect_uri: this.kakaoRedirectUrlForSignIn,
        code: code,
      }),
      {
        timeout: 30000,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        },
      },
    );

    const userResponse = await axios.get(this.kakaoProfileUrl, {
      timeout: 30000,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        Authorization: 'Bearer ' + tokenResponse.data.access_token,
      },
    });

    return {
      header: userResponse.headers,
      data: userResponse.data,
    };
  }
}
