import Header from "@/components/Header"
import OverallChart from "@/components/OverallChart"
import { useGetOverallStatsQuery } from "@/state/api"
import { useTheme } from "@emotion/react"
import { Box } from "@mui/material"


const OverallStats = () => {
  const { data: stats, isLoading, isError } = useGetOverallStatsQuery()
  const theme = useTheme()
  console.log(stats)
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Overview" subtitle="Overview your sales" />
      <OverallChart width={800} height={400} />
    </Box>
  )
}

export default OverallStats  
