"use client"

import { useState } from "react";
import { useForm } from "react-hook-form";
import { ReCaptchaScript, generateRecaptchaToken } from "@/lib/recaptchav3Client";

type FormType = {
  name: string;
  email: string;
}

export default function ReCaptchaForm() {
  const [resultMessage, setResultMessage] = useState('');
  const {register, handleSubmit, formState: {isSubmitting}} = useForm<FormType>();

  const onSubmit = async (data: FormType) => {
    const action = 'contact';

    try {
      // トークン生成
      const token = await generateRecaptchaToken(process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY!, action);

      // トークンとアクションをリクエストデータに混ぜる
      const reqJson = JSON.stringify({
        ...data,
        token,
        action,
      });

      // サーバーに送信
      const res = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: reqJson,
      });

      const resJson = await res.json();
      if (res.ok) {
        setResultMessage('送信しました');
        console.log('ok');
      } else {
        setResultMessage(`送信エラー<br>${resJson.message}`);
      }

    } catch (e) {
      setResultMessage(`送信エラー`);
      console.error(e);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        名前：<input {...register('name')} /><br />
        メール：<input {...register('email')} /><br />
        <button type="submit">submit</button>
      </form>
      {isSubmitting && <p>送信中...</p>}
      {!isSubmitting && resultMessage && <p>{resultMessage}</p>}
      <ReCaptchaScript sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITEKEY!}/>
    </>
  )
}