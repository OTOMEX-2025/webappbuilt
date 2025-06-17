// components/ProtectedRoute.js
"use client";
import { useUser } from '@/context/UserContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    } else if (!loading && user && allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
      router.push('/unauthorized');
    }
  }, [user, loading, router, pathname, allowedRoles]);

  if (loading || !user || (allowedRoles.length > 0 && !allowedRoles.includes(user.userType))) {
    return <div>Loading...</div>;
  }

  return children;
}