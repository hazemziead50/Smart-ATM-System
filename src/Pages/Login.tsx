import useAuthStore from "../Store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import * as z from 'zod'
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../Component/input";
import "./styles/login.css"; 


const loginSchema = z.object({
    username:z.string().trim().min(1,{message:'أدخل اسم المستخدم'}),
    pin:z.string().trim().min(1,{message:"أدخل كلمة المرور"})
    .min(6,{message:'كلمة المرور لا تقل عن 6 أرقام '})
})


type LoginFormInput =z.infer< typeof loginSchema>

export default function Login() {
  const { user, isLoding, error, login, } = useAuthStore();

  
  const navigate = useNavigate();

  // useForm
  const {
    register,
    handleSubmit,
    formState:{errors}
  } = useForm <LoginFormInput>({
    resolver:zodResolver(loginSchema),
    mode:'onTouched'
  })

  const onSubmit:SubmitHandler <LoginFormInput> = async(data)=> {
        await login(data.username,data.pin)
  }
  
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
        
<div className="system-badge">
  <svg className="atm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
  </svg>
  <span className="system-name">ATM System</span>
</div>
          <div className="logo-container">
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1>تسجيل الدخول</h1>
          </div>
          <p className="subtitle">مرحباً بك! يرجى إدخال بياناتك</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
      
          <Input
            label="أسم المستخدم"
            name="username"
            disabled={isLoding}
            type="text"
            placeholder="أدخل أسم المستخدم"
            register={register}
            error={errors.username?.message}
          />

          <Input
            label="كلمة المرور"
            name="pin"
            disabled={isLoding}
            type="password"
            placeholder="أخل كلمة المرور "
            register={register}
            error={errors.pin?.message}
          
          />

          {error && (
            <div className="error-message">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <button type="submit" className="login-button" disabled={isLoding}>
            {isLoding ? (
              <>
                <span className="spinner"></span>
                جاري الدخول...
              </>
            ) : (
              "تسجيل الدخول"
            )}
          </button>

          <div className="login-footer">
            <span>ليس لديك حساب؟</span>
            <Link to="/register">إنشاء حساب جديد</Link>
          </div>

        </form>
      </div>
    </div>
  );
}