'use client';
import { useRouter } from 'next/navigation'
import LoginForm from '@/components/ui/LoginForm'

export default function Home() {
  const router = useRouter()

  const onLoginSuccess = (userType: string) => {
    router.push(`/dashboard/${userType}`)
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <LoginForm onLoginSuccess={onLoginSuccess} />
    </main>
  )
}
