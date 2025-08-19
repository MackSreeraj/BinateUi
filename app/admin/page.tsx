'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// This is a simple redirect page that will send users to the admin dashboard if they're logged in as admin,
// or to the admin login page if they're not
export default function AdminRedirectPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to admin login page
    router.push('/admin/login');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </div>
  );
}
