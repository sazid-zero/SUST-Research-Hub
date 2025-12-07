'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export function LogoutModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })
      
      router.push('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      // Still redirect to login even if there's an error
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        disabled={isLoading}
        className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-foreground hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-50"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        <span className="font-medium">{isLoading ? 'Logging out...' : 'Logout'}</span>
      </button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Logout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to logout? You will need to login again to access your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3 justify-end">
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout} disabled={isLoading} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isLoading ? 'Logging out...' : 'Logout'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
