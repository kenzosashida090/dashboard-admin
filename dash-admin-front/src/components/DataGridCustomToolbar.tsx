import Tooltip from '@mui/material/Tooltip';

import ViewColumnIcon from '@mui/icons-material/ViewColumn';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, { useState, useRef } from "react"
import {
  Toolbar,
  ToolbarButton,
  ColumnsPanelTrigger,
  ExportCsv
} from '@mui/x-data-grid';
import FlexBetween from './FlexBetween';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { Search } from '@mui/icons-material';

type CustomToolbarProps = {
  setSearchInput: React.Dispatch<React.SetStateAction<string>>
  setSearch: React.Dispatch<React.SetStateAction<string>>
  searchInput: string
}

const DataGridCustomToolbar = ({ setSearchInput, setSearch, searchInput }: CustomToolbarProps) => {
  const [isExpandedExport, setIsExpandedExport] = useState(false)
  const exportMenuTriggerRef = useRef<HTMLButtonElement>(null)
  return (
    <Toolbar>
      <FlexBetween width={'100%'}>
        <FlexBetween>
          <Tooltip title="Columns">
            <ColumnsPanelTrigger render={<ToolbarButton />}>
              <ViewColumnIcon fontSize='small' />
            </ColumnsPanelTrigger>
          </Tooltip>
          <Tooltip title="Export">
            <ToolbarButton
              aria-expanded={isExpandedExport ? 'true' : undefined}
              onClick={() => setIsExpandedExport(true)}
            >
              <FileDownloadIcon fontSize="small" />
            </ToolbarButton>
          </Tooltip>
          <Menu
            anchorEl={exportMenuTriggerRef?.current}
            open={isExpandedExport}
            onClose={() => setIsExpandedExport(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            slotProps={{
              list: {
                'aria-labelledby': 'export-menu-trigger'
              }
            }}
          >
            <ExportCsv render={<MenuItem />} onClick={() => setIsExpandedExport(false)}>
            </ExportCsv>
          </Menu>

        </FlexBetween>
        <TextField
          label={"Search..."}
          sx={{ mb: "0.5rem", width: "15rem" }}
          onChange={(e) => setSearchInput(e.target.value)}
          slotProps={{
            input: {
              endAdornment: <InputAdornment position='end'>
                <IconButton
                  onClick={() => {
                    setSearch(searchInput)
                    setSearchInput("")
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            }

          }}
          variant='standard'
        />
      </FlexBetween>
    </Toolbar>
  )
}
export default DataGridCustomToolbar
