import { Navbar } from '@/components/shared/navbar'
import { getMe } from '@/service/getMe';
import React from 'react'

const authLayout = async ({children}:{children:React.ReactNode}) => {
  const user=await getMe();
  return <div>
    <Navbar user={user}/>
    {children}
  </div>
}

export default authLayout