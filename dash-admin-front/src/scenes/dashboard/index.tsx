import { useGetAuthUserQuery } from "@/state/api"

const Dashboard = () => {
  const  { data:user,  isLoading, isError } = useGetAuthUserQuery()
    const comp = isLoading ? <p>Loading</p> : isError ? <p>Error</p> : <p>Complete</p>
    console.log(user,"looo")
  return (
    <div>
        Dashboard
        {comp}
    </div>
  )
}

export default Dashboard
