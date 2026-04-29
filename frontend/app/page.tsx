'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='));

    if (token) {
      const roleRow = document.cookie
        .split('; ')
        .find(row => row.startsWith('role='));
      const role = roleRow ? roleRow.substring('role='.length) : undefined;

      if (role === 'ADMIN') router.push('/admin');
      else if (role === 'TEACHER') router.push('/teacher');
      else router.push('/student');
    } else {
      router.push('/login');
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500">Loading...</p>
    </div>
  );
}