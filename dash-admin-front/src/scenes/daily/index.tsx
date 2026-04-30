import DailyChart from "@/components/DailyChart"
import Header from "@/components/Header"
import { Box, useTheme } from "@mui/material"

const DailyStats = () => {
  const theme = useTheme()
  return (
    <Box m="1.5rem 2.5rem">
      <Header title="Overview" subtitle="Overview your sales" />
      <DailyChart width={800} height={400} />
    </Box>
  )
}

export default DailyStats
