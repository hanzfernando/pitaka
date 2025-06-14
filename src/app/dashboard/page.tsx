'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect } from 'react';

const DashboardPage = () => {
  useEffect(() => {
      async function checkUser() {
        const {
          data: { user },
        } = await supabase.auth.getUser();
  
        console.log('User:', user);
      }
  
      checkUser();
    }, []);
        
  return (
    <div>page</div>
  )
}

export default DashboardPage