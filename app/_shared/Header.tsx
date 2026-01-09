"use client"
import { Button } from '@/components/ui/button'
import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'

const Header = () => {
    const {user} = useUser();

  return (
    <div className='flex items-center justify-between p-4'>
        <div className='flex gap-2 items-center'>
            <Image src={"/ux_logo.webp"} alt="logo" width={40} height={40} />
            <h2 className='text-xl font-semibold'>Kintsugi <span className='text-primary'>UI</span></h2>
        </div>
        <ul className='flex gap-5 items-center'>
            <Link href={"/"}> <li className='hover:text-primary cursor-pointer text-lg '>Home</li> </Link>
            <Link href={"/pricing"}> <li className='hover:text-primary cursor-pointer text-lg'>Pricing</li> </Link>
        </ul>
        {!user ? 
        <SignInButton mode='modal'>
            <Button className='bg-primary cursor-pointer'>Get started</Button> 
        </SignInButton>
        : <UserButton/>}
        
    </div>
  )
}

export default Header
