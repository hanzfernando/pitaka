'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase/client'

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Auth
        supabaseClient={supabase}
        providers={['google']}
        appearance={{ theme: ThemeSupa }}
        theme="default"
      />
    </div>
  )
}

export default LoginPage
