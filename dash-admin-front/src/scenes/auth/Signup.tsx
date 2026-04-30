import Header from "@/components/Header"
import { useSignupMutation } from "@/state/api"

const Signup = () => {
  const [signup] = useSignupMutation()
  const handleSubmit = async (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const data = Object.fromEntries(formData.entries()) as {
      email: string;
      password: string;
      name: string;
      country: string;
    }



    await signup(data)
    console.log("signup")
  }
  return (
    <form onSubmit={handleSubmit}>
      <input name='email' id='email' type='text' />
      <input name='password' id='password' type='text' />
      <input name='name' id='name' type='text' />
      <input name='country' id='country' type='text' />
      <button type='submit'>Login</button>
    </form>
  )
}

export default Signup
