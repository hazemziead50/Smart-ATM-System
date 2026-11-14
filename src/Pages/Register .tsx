
import { Link, useNavigate } from "react-router-dom"
import { useForm, type SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Input from "../Component/input"
import { API_URL } from "../Utils/sendUsers"
import useAuthStore from "../Store/useAuthStore"
import styles from './styles/register.module.css'

// 1. تعريف مخطط التحقق عبر Zod
const registerSchema = z.object({
  username: z.string().trim().min(1, "اسم المستخدم مطلوب"),
  firstName: z.string().trim().min(1, "الاسم الأول مطلوب"),
  lastName: z.string().trim().min(1, "الاسم الأخير مطلوب"),
  birthDate: z
    .string()
    .min(1, "تاريخ الميلاد مطلوب")
    .refine((val) => {
      const birth = new Date(val)
      const today = new Date()
      let age = today.getFullYear() - birth.getFullYear()
      const m = today.getMonth() - birth.getMonth()
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--
      }
      return age >= 18
    }, "يجب أن يكون عمرك 18 سنة على الأقل"),
  password: z
    .string()
    .min(1, "كلمة المرور مطلوبة")
    .length(6, "كلمة المرور يجب أن تكون 6 أرقام")
    .regex(/^\d{6}$/, "كلمة المرور يجب أن تكون أرقام فقط"),
  confirmPassword: z.string().min(1, "تأكيد كلمة المرور مطلوب")
}).refine((data) => data.password === data.confirmPassword, {
  message: "كلمات المرور غير متطابقة",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function Register() {
  const navigate = useNavigate()
  const registerUser = useAuthStore((state) => state.register)

  // 2. إعداد useForm
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      birthDate: '',
      password: '',
      confirmPassword: ''
    }
  })

  // 3. دالة الإرسال
  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_name: data.username,
          first_name: data.firstName,
          last_name: data.lastName,
          pin: data.password,
          birthday: data.birthDate,
          balance: 0,
          profile_img: '',
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'فشل في إنشاء الحساب')
      }

      const newUser = await response.json()
      registerUser(newUser)
      navigate('/dashboard')
    } catch (error: any) {
      setError("root", {
        type: "server",
        message: error.message || 'حدث خطأ أثناء الاتصال بالخادم'
      })
    }
  }

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

        <form onSubmit={handleSubmit(onSubmit)} className={styles.registerForm}>
          {/* اسم المستخدم */}
         
          <Input
            label="أسم المستخدم"
            name="username"
            type="text"
            register={register}
            placeholder="أدخل أسم المستخدم"
            error={errors.username?.message}
          />

          {/* الاسم الأول */}
          <Input
            label=" الاسم الأول"
            name="firstName"
            type="text"
            register={register}
            placeholder="أدخل الأسم الأول "
            error={errors.firstName?.message}
          />

          {/* الاسم الأخير */}
         
             <Input
            label=" الاسم الأخر"
            name="lastName"
            type="text"
            register={register}
            placeholder="أدخل الأسم الأخير "
            error={errors.lastName?.message}
          />

          {/* تاريخ الميلاد */}
        
           <Input
            label=" تاريخ الميلاد "
            name="birthDate"
            type="Date"
            register={register}
            placeholder="أدخل  تاريخ ميلادك "
            error={errors.birthDate?.message}
          />

          {/* كلمة المرور */}
         
          <Input
            label=" كلمة المرور "
            name="password"
            type="password"
            register={register}
            placeholder="أدخل كلمة مرور من 6 ارقام "
            error={errors.password?.message}
          />
          {/* تأكيد كلمة المرور */}
         
          <Input
            label="تأكيد كلمة المرور "
            name="confirmPassword"
            type="password"
            register={register}
            placeholder="أعد أدخال كلمة مرور من 6 ارقام "
            error={errors.confirmPassword?.message}
          />

          {/* الخطأ العام من الخادم */}
          {errors.root && (
            <div className={styles.errorMessage}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{errors.root.message}</span>
            </div>
          )}

          {/* زر التسجيل */}
          <button type="submit" className={styles.registerButton} disabled={isSubmitting}>
            {isSubmitting ? <span className={styles.spinner}></span> : 'تسجيل'}
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