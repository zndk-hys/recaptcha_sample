"use client";

import Script from "next/script";

type Grecaptcha = {
  ready(cb: () => void): void;
  execute(siteKey: string, opts: { action: string }): Promise<string>;
}

/**
 * grecaptcha.ready待ち
 */
async function grecaptchaIsReady(): Promise<Grecaptcha> {
  return new Promise(resolve => {
    if ("grecaptcha" in window) {
      resolve(window.grecaptcha as Grecaptcha);
    } else {
      const timerId = setInterval(() => {
        if ("grecaptcha" in window) {
          clearInterval(timerId);
          resolve(window.grecaptcha as Grecaptcha);
        }
      }, 50);
    }
  });
}

/**
 * トークン生成
 */
export async function generateRecaptchaToken(sitekey: string, action: string): Promise<string> {
  const grecaptcha = await grecaptchaIsReady();

  return new Promise((resolve, reject) => {
    grecaptcha.ready(() => {
      try {
        grecaptcha.execute(sitekey, {action}).then(token => resolve(token))
      } catch(e) {
        reject(e);
      }
    });
  });
}

export function ReCaptchaScript({sitekey}: {sitekey: string}) {
  return (
    <Script src={`https://www.google.com/recaptcha/api.js?render=${sitekey}`} strategy="afterInteractive" />
  );
}