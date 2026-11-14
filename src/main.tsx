import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {QueryClient , QueryClientProvider} from '@tanstack/react-query'
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import './theme.css'

import App from './App.tsx'
const queryClient = new QueryClient({
    defaultOptions:{
      queries:{
        staleTime:1000*60*5 , // 5دقائق قبل اعتبار البيانات قديمة
        gcTime: 1000 * 60 * 10, // أبقاء البيانات غير المستخدمة في الكاش 10دقائق
        retry:1,// إعادة المحاولة لمرة واحدة فقط عند حدوث خطأ في الطلب
        refetchOnWindowFocus:false // تعطيل إعادة الجلب التلقائي عند الرجوع لنافذة المتصفح

      }
    }
})
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false}/>
      </QueryClientProvider>
  </StrictMode>,
)
