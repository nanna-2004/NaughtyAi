"use client"
import { SidebarProvider } from '@/components/ui/sidebar'
import React, { useEffect } from 'react'
import AppSidebar from './_components/Appsidebar'
import AppHeader from './_components/AppHeader'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../_components/AuthContext'


function DashboardProvider({children}) {
  const {user} = useAuthContext(); 
  const router = useRouter();
  useEffect(() => {
    // Wrap the navigation logic in a condition to ensure it runs client-side
    if (typeof window !== "undefined") {
      user && CheckedUserAuthenticated();
    }
  }, [user]);
  const CheckedUserAuthenticated=() => {
    if(!user){
      router.replace('/');
    }
  }
  return (
    <SidebarProvider>
      <AppSidebar/>
    <div className='w-full'>
      <AppHeader/>
      <div className='p-10'>
        {children}
      </div>
      
      </div>
     </SidebarProvider>
  )
}

export default DashboardProvider