import useAuthStore from "../Store/useAuthStore";
import { useNavigate , Link } from "react-router-dom";
import { useState, useEffect, } from "react";
import "./styles/login.css"; // Import the CSS file
export default function Login() {
  const { user, isLoding, error, login, } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [errors,setErrors] = useState<Record<string,string>>({})
  const navigate = useNavigate();
  const [formData ,setFormData]= useState({
    username:'',
    pin:'',
  })

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validation()
    if(Object.keys(validationErrors).length > 0){
      setErrors(validationErrors)
      return
    }
    await login(formData.username,formData. pin);

  };
  const validation = ()=>{
    const newErrors: Record<string,string> = {}
    if(formData.username.trim() === ''){
      newErrors.username = 'أدخل اسم المستخدم '
    }
    if(formData.pin.trim()==='') newErrors.pin = 'أدخل كلمة المرور'
    return newErrors
  }
  const handelChange = (e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target
    setFormData(prevData => ({
      ...prevData , [name]:value
    }))
    if(errors[name]){
      setErrors(prevErors=>({
        ...prevErors , [name]:''
      }))  
    }
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

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label htmlFor="username">اسم المستخدم</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                id="username"
                name="username"
                type="text"
                placeholder="أدخل اسم المستخدم"
                value={formData.username}
                onChange={handelChange}
                autoComplete="username"
                disabled={isLoding}
              />
              {errors.username && <div className="errorMessage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.username}</span>
                </div>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="pin">كلمة المرور</label>
            <div className="input-wrapper">
              <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <input
                id="pin"
                name="pin"
                type={showPassword ? "text" : "password"}
                placeholder="أدخل كلمة المرور"
                value={formData.pin}
                onChange={handelChange}
                autoComplete="current-password"
                disabled={isLoding}
              />
              {errors.pin && <div className="errorMessage">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.pin}</span>
                </div>}
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                )}
              </button>
            </div>
          </div>

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
              "دخول"
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