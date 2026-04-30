
import Header from '@/components/Header'
import { useGetCustomersQuery } from '@/state/api'
import { useAppSelector } from '@/state/redux';
import { Box, useTheme } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'



const Customers = () => {
  const { data: customers, isLoading } = useGetCustomersQuery()
  const theme = useTheme()


  const colorTheme = useAppSelector((state) => state.global.mode)
  if (!customers) { return <p>HEllo</p> }
  const customersColumns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => {
        return <span>{params.value.replace(/^(\d{3})(\d{3})(\d{4})/, "($1)$2-$3")}</span>
      }
    },
    {
      field: "country",
      headerName: "Country",
      flex: 0.4,

    },
    {
      field: "occupation",
      headerName: "Occupation",
      flex: 1,

    },
    {
      field: "role",
      headerName: "Role",
      flex: 0.5,

    },
  ]
  return (
    <Box m="1.5rem 2.5rem">
      <Header title='Customers' subtitle='I dont know what to do here' />
      <Box
        mt={"40px"}
        height={"75vh"}
        sx={{
          "& .MuiDataGrid-columnHeadersInner": {
            border: "none"
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none"
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.secondary[100],
            borderBottom: "none"
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colorTheme === "dark" ? theme.palette.secondary[600] : theme.palette.background.paper,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: theme.palette.background.paper,
            color: theme.palette.secondary[100],
            borderBottom: "none"
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${theme.palette.secondary[200]} !important`,
          },
        }}
      >

        <DataGrid
          loading={isLoading || !customers}
          rows={customers || []}
          getRowId={(row) => row.id}
          columns={customersColumns}
        />
      </Box>
    </Box>
  )
}

export default Customers
