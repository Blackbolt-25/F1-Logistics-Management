'use client';
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/ui/LoginForm'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm />
    </main>
  )
}
