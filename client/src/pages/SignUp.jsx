import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Label, TextInput } from 'flowbite-react'

export default function SignUp() {
  return (
    <div className='min-h-screen mt-20'>
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            <span className='px-2 py-1 bg-linear-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white' >Sachin's</span>
            Blog
          </Link>
          <p className='text-sm mt-5'>You can signup using email and password or with Google</p>
        </div>

        {/* Right */}
        <div className="flex flex-col gap-4">
          <form>
            <div>
              <Label htmlFor="username"> Your username: </Label>
              <TextInput type='text' placeholder='Username' id='username' />
            </div>
            <div>
              <Label htmlFor="username"> Your email: </Label>
              <TextInput type='text' placeholder='name@company.com' id='email' />
            </div>
            <div>
              <Label htmlFor="username"> Your password: </Label>
              <TextInput type='text' placeholder='Password' id='password' />
            </div>
            <Button type='submit' className="mt-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:bg-gradient-to-l focus:ring-purple-200 dark:focus:ring-purple-800 w-full">
              Sign-Up
            </Button>
          </form>
          <div className="flex gap-2 text-sm mt-5">
              <span>Have an account?</span>
              <Link to='/sign-in' className = 'text-blue-500'>
                Sign In
              </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
