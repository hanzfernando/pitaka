'use client';

import GoogleLoginButton from '@/components/GoogleLoginButton';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <GoogleLoginButton />
    </div>
  );
}
