import { useState,useEffect } from "react"
import { Link,useNavigate } from "react-router-dom"
import { API_URL } from "../Utils/sendUsers"
import useAuthStore from "../Store/useAuthStore"

import styles from './styles/register.module.css'

export default function Register(){
  const navigate = useNavigate()
  const register = useAuthStore((state) => state.register)
  const [formData, setFormData] = useState({
    username:'',
    firstName:'',
    lastName:'',
    birthDate:'',
    password:'',
    confirmPassword:''
  })
  const [errors, setErrors] = useState<Record<string,string>>({})
  const [isloding,setIsLoading]=useState(false)
  const [showPassword,setShowPassword]=useState(false)
  const [showConfirmPassword,setShowConfirmPassword]=useState(false)
  const [isRegistered,setIsRegistered]=useState(false)

  const handleChange=(e:React.ChangeEvent<HTMLInputElement>)=>{
    const {name,value}=e.target
    setFormData(pervData =>({

      ...pervData,[name]:value
    }))
      if(errors[name]){
        setErrors(prevErrors=>({
          ...prevErrors,[name]:''
        }))
      }
    }

    const validateForm =()=>{
      const newErrors:Record<string,string>={}

      if(!formData.username.trim()){
        newErrors.username='اسم المستخدم مطلوب'
      }
      if(!formData.firstName.trim()){
        newErrors.firstName='الاسم الأول مطلوب'
      }
      if(!formData.lastName.trim()){
        newErrors.lastName='الاسم الأخير مطلوب'
      }
      if(!formData.birthDate){
        newErrors.birthDate='تاريخ الميلاد مطلوب'
      }

      {/* تحقق من كلمة المرور*/}
      if(!formData.password){
        newErrors.password='كلمة المرور مطلوبة'
      }
      if(formData.password.length !== 6){
        newErrors.password='كلمة المرور يجب ان تكون 6 أرقام'
      }else if(!/^\d{6}$/.test(formData.password)){
        newErrors.password='كلمة المرور يجب ان تكون أرقام فقط'
      }

      if(formData.password !== formData.confirmPassword){
        newErrors.confirmPassword='كلمات المرور غير متطابقة'
      }

    {/* تحقق من العمر*/ }
    if(formData.birthDate){
      const age = new Date().getFullYear() - new Date(formData.birthDate).getFullYear()
      if(age < 18) newErrors.birthDate='يجب ان يكون عمرك 18 سنة على الأقل'
    }
    return newErrors
  }

  const handelSubmit = async (e:React.FormEvent<HTMLFormElement>)=> {
    e.preventDefault()
    const validationErrors = validateForm()

    if(Object.keys(validationErrors).length > 0){
      setErrors(validationErrors)
      return
    }
    
    
    {/* إرسال البيانات إلى الخادم */ }
    setIsLoading(true)
    try{
      const response = await fetch(`${API_URL}`,{
        method:'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: formData.username,
          first_name:formData.firstName,
          last_name:formData.lastName,
          pin:formData.password,
          birthday:formData.birthDate,
          balance:0,
          profile_img:'',
        })
      })

      if(!response.ok){
      const errorDate = await response.json()
      throw new Error(errorDate.message || 'فشل في إنشاء الحساب')
      }
      const newUser = await response.json()
      register(newUser)
      setIsRegistered(true)

    } catch (error:any) {
      setErrors({general: error.message})
    } finally {
      setIsLoading(false)
    }
  }
  const togglePassword = ()=> setShowPassword(!showPassword)
  const toggleConfirmPassword = ()=>setShowConfirmPassword(!showConfirmPassword)

  useEffect(()=>{
    if(isRegistered){
      navigate('/dashboard')
    }
  },[isRegistered,navigate])

    return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.registerHeader}>
          <div className={styles.systemBadge}>
            <svg className="atm-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
            </svg>
            <span className={styles.systemName}>ATM System</span>
          </div>
          
          <div className={styles.logoContainer}>
            <svg className={styles.logoIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            <h1>إنشاء حساب جديد</h1>
          </div>
        </div>

        <form onSubmit={handelSubmit}  className={styles.registerForm}>
          {/* اسم المستخدم */}
          <div className={styles.formGroup}>
            <label htmlFor="username">اسم المستخدم</label>

            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} fill="currentColor" viewBox="0 0 640 640">
              <path  d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
              </svg>
              
            <input type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="أسم المستخدم"
            name="username"
            aria-required="true"
            autoComplete="username"
            />
            { errors.username &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> {errors.username} </span>
            </div>}
            </div>
          </div>

          {/* الاسم الأول */}
          <div className={styles.formGroup}>
            <label htmlFor="firstName"> الاسم الأول </label>

            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} fill="currentColor" viewBox="0 0 640 640">
              <path  d="M320 312C386.3 312 440 258.3 440 192C440 125.7 386.3 72 320 72C253.7 72 200 125.7 200 192C200 258.3 253.7 312 320 312zM290.3 368C191.8 368 112 447.8 112 546.3C112 562.7 125.3 576 141.7 576L498.3 576C514.7 576 528 562.7 528 546.3C528 447.8 448.2 368 349.7 368L290.3 368z"/>
              </svg>
              
            <input type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="الاسم الأول"
            aria-required="true"
            autoComplete="firstname"
            />
            { errors.firstName &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> {errors.firstName} </span>
            </div>}
            </div>
          </div>

          {/* الاسم الأخير */}
          <div className={styles.formGroup}>
            <label htmlFor="lastName"> الاسم الأخير </label>

            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon}  fill="currentColor" viewBox="0 0 24 24">
                <path  d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
              </svg>
              
            <input type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="الاسم الأخير"
            aria-required="true"
            autoComplete="lastname"
            />
            { errors.lastName &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> {errors.lastName} </span>
            </div>}
            </div>
          </div>

          {/* تاريخ الميلاد */}
          <div className={styles.formGroup}>
            <label htmlFor="birthDate">  تاريخ الميلاد </label>

            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} fill="currentColor" viewBox="0 0 448 512">
              <path  d="M120 0c13.3 0 24 10.7 24 24l0 40 160 0 0-40c0-13.3 10.7-24 24-24s24 10.7 24 24l0 40 32 0c35.3 0 64 28.7 64 64l0 288c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 128C0 92.7 28.7 64 64 64l32 0 0-40c0-13.3 10.7-24 24-24zM384 432c8.8 0 16-7.2 16-16l0-64-88
                0 0 80 72 0zm16-128l0-80-88 0 0 80 88 0zm-136 0l0-80-80 0 0 80 80 0zm-128 0l0-80-88 0 0 80 88 0zM48 352l0 64c0 8.8 7.2 16 16 16l72 0 0-80-88 0zm136 0l0 80 80 0 0-80-80 0zM120 112l-56 0c-8.8 0-16 7.2-16 16l0 48 352 0 0-48c0-8.8-7.2-16-16-16l-264 0z"/>
              </svg>
              
            <input type="date"
            id="birthDate"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            placeholder="تاريخ الميلاد"
            />
            { errors.birthDate &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> {errors.birthDate} </span>
            </div>}
            </div>
          </div>

          {/* كلمة المرور */}
          <div className={styles.formGroup}>
            <label htmlFor="password">  كلمة المرور  </label>

            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
                <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 256c0-35.3
                28.7-64 64-64l16 0z"/>
              </svg>
            <input type={showPassword ? 'text':'password'}
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder=" أدخل كلمة المرور (6 أرقام)"
            aria-required="true"
            autoComplete="new-password"
            minLength={6}
            maxLength={6}
            />
            { errors.password &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> {errors.password} </span>
            </div>}
            <button type='button' onClick={togglePassword} className={styles.passwordToggle}>
              {showPassword ? (
              <svg  viewBox="0 0 576 512">
              <path  d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144
              256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"/>
              </svg>

              ):(
                <svg  viewBox="0 0 576 512">
                  <path fill="rgb(116, 192, 252)" d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM204.5 138.7c23.5-16.8 52.4-26.7 83.5-26.7 79.5 0 144 64.5 144 144 0 31.1-9.9 59.9-26.7 83.5l-34.7-34.7c12.7-21.4 17-47.7 10.1-73.7-13.7-51.2-66.4-81.6-117.6-67.9-8.6 2.3-16.7 5.7-24 10l-34.7-34.7zM325.3 395.1c-11.9 3.2-24.4 4.9-37.3 4.9-79.5 0-144-64.5-144-144 0-12.9 1.7-25.4 4.9-37.3L69.4 139.2c-32.6 36.8-55
                75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6l-64.2-64.2z"/>
                </svg>
              )
            }
            </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">  أعد أدخال كلمة المرور </label>

            <div className={styles.inputWrapper}>
              <svg className={styles.inputIcon} fill="currentColor" viewBox="0 0 448 512" aria-hidden="true">
                <path  d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 256c0-35.3
                28.7-64 64-64l16 0z"/>
              </svg>
              
            <input type={ showConfirmPassword ?'text':'password'}
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="  أدخل كلمة المرور (6 أرقام) مجددا"
            aria-required="true"
            autoComplete="new-password"
            minLength={6}
            maxLength={6}
            />
            { errors.confirmPassword &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> {errors.confirmPassword} </span>
            </div>}
            <button type='button' onClick={toggleConfirmPassword} className={styles.passwordToggle}>
              {showConfirmPassword ? (
                <svg  viewBox="0 0 576 512">
              <path  d="M288 32c-80.8 0-145.5 36.8-192.6 80.6-46.8 43.5-78.1 95.4-93 131.1-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6zM144
              256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64-11.5 0-22.3-3-31.7-8.4-1 10.9-.1 22.1 2.9 33.2 13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-12.2-45.7-55.5-74.8-101.1-70.8 5.3 9.3 8.4 20.1 8.4 31.7z"/>
              </svg>
              ):(<svg  viewBox="0 0 576 512">
                  <path fill="rgb(116, 192, 252)" d="M41-24.9c-9.4-9.4-24.6-9.4-33.9 0S-2.3-.3 7 9.1l528 528c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-96.4-96.4c2.7-2.4 5.4-4.8 8-7.2 46.8-43.5 78.1-95.4 93-131.1 3.3-7.9 3.3-16.7 0-24.6-14.9-35.7-46.2-87.7-93-131.1-47.1-43.7-111.8-80.6-192.6-80.6-56.8 0-105.6 18.2-146 44.2L41-24.9zM204.5 138.7c23.5-16.8 52.4-26.7 83.5-26.7 79.5 0 144 64.5 144 144 0 31.1-9.9 59.9-26.7 83.5l-34.7-34.7c12.7-21.4 17-47.7 10.1-73.7-13.7-51.2-66.4-81.6-117.6-67.9-8.6 2.3-16.7 5.7-24 10l-34.7-34.7zM325.3 395.1c-11.9 3.2-24.4 4.9-37.3 4.9-79.5 0-144-64.5-144-144 0-12.9 1.7-25.4 4.9-37.3L69.4 139.2c-32.6 36.8-55
                75.8-66.9 104.5-3.3 7.9-3.3 16.7 0 24.6 14.9 35.7 46.2 87.7 93 131.1 47.1 43.7 111.8 80.6 192.6 80.6 37.3 0 71.2-7.9 101.5-20.6l-64.2-64.2z"/>
                </svg>)}
            </button>
            </div>
          </div>

          {/* عرض الأخطاء */}
          
          { errors.genarl &&  <div className={styles.errorMessage} >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span> خطاء في جلب البيانات </span>
            </div>
          }
          {/* زر التسجيل */}
          <button type="submit"  className={styles.registerButton}
          disabled={isloding}> 
          {isloding ? (<><span className={styles.spinner}></span></>)
          :('تسجيل')}
          </button>
          
          {/* رابط تسجيل الدخول */}
          <div className={styles.registerFooter}>
            <span>لديك حساب بالفعل؟</span>
            <Link to="/">تسجيل الدخول</Link>
          </div>
        </form>
      </div>
    </div>
  )
    

}