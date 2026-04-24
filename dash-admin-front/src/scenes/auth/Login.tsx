import { useLoginMutation } from '@/state/api'
import React, { useState } from 'react'

const Login = () => {
    const [login] = useLoginMutation()
    const [userData, setUserData] = useState()
    const handleSubmit= async (event)=>{
        event.preventDefault()
        const formData = new FormData(event.target)
        const data = Object.fromEntries(formData.entries())
        await login({email:String(data['email']), password:String(data['password'])})
        console.log("logged")
    }
  return ( 
    <form onSubmit={handleSubmit}>
      <input name='email' id='email' type='text'  />
      <input name='password' id='password' type='text'  />
      <button type='submit'>Login</button>
    </form>
  )
}

export default Login
