

import Header from "@/components/Header"
import DataGridCustomToolbar from "@/components/DataGridCustomToolbar"
import { useGetTransactionsQuery } from "@/state/api"
import { useAppSelector } from "@/state/redux"
import { useTheme } from "@mui/material"
import { Box } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import type { GridColDef, GridRenderCellParams, GridSortModel } from '@mui/x-data-grid'
import { useState } from "react"

type sortModel = {
  field: string;
  sort: string
}

const Transactions = () => {
  const theme = useTheme()
  const colorTheme = useAppSelector((state) => state.global.mode)
  const [page, setPage] = useState(0)
  const [pageSize, setPageSize] = useState(20)
  const [searchInput, setSearchInput] = useState("")
  const [paginationModel, setPaginationModel] = useState({
    page: 1,
    pageSize: 20
  })
  const [sort, setSort] = useState<TransactionFilter["sort"]>(null)
  console.log(sort, "------------")
  const [search, setSearch] = useState<string>("")
  const { data, isLoading, isError } = useGetTransactionsQuery({
    ...paginationModel,
    sort: sort,
    search: search
  })
  console.log(data?.transactions)

  if (isError || !data) {
    return (
      <Box m="1.5rem 2.5rem">
        <h1> Error </h1>

      </Box>
    )
  }

  const customersColumns: GridColDef[] = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "userId",
      headerName: "Name",
      flex: 0.5,
    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params: GridRenderCellParams) => {
        return <span>${Number(params.value).toFixed(2)}</span>
      }
    },
    {
      field: "products",
      headerName: "# of Products",
      sortable: false,
      flex: 0.5,
      renderCell: (params: GridRenderCellParams) => {
        return <span>{params.value.length}</span>
      }
    }
  ]
  const handleSortModelChange = (model: GridSortModel) => {
    if (model.length == 0) {
      setSort(null)
      return
    }
    setSort({
      field: model[0].field as "userId" | "cost" | "products",
      sort: model[0].sort as "asc" | "desc"
    })
  }
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
          loading={isLoading || !data?.transactions}
          rows={(data && data.transactions) || []}
          getRowId={(row) => row._id}
          columns={customersColumns}
          rowCount={(data && data.total) || 0}
          pageSizeOptions={[5, 10, 25]}
          paginationModel={paginationModel}
          paginationMode="server"
          sortingMode="server"
          filterMode="server"
          onPaginationModelChange={setPaginationModel}
          onSortModelChange={handleSortModelChange}
          slots={{ toolbar: DataGridCustomToolbar }}
          slotProps={{
            toolbar: {
              setSearch,
              setSearchInput,
              searchInput
            }
          }
          }
          showToolbar
        />
      </Box>
    </Box>
  )
}

export default Transactions
