import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'
import { useGetProductsQuery } from '@/state/api'
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'

const Products = () => {
  const {data:products, isLoading, isError} =useGetProductsQuery()
  const isNonMobile = useMediaQuery("(min-width:1000px)")
  const theme = useTheme()
  if(isError) {
    return       <Typography
            variant='h2'
            color={theme.palette.secondary[100]}
            fontWeight="bold"
            sx={{mb:"5px"}}
            >
                {"Error"}
            </Typography>
  }
  return (
    <Box m="1.5rem 2.5rem">
      <Header title='Products'  subtitle='See your list of products' />
      {
        products || !isLoading  ?(
          <Box
            mt="20px"
            display={'grid'}
            gridTemplateColumns={"repeat(4,minmax(0,1fr))"}
            justifyContent={"space-between"}
            rowGap={"24px"}
            columnGap={"1.33%"}
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4"} // if its mobile us the entire 4 span column
            }}
          >
            {
              products?.map((product, id)=>(
                <ProductCard {...product} key={id} />
              ))
            }

          </Box>
        ):
        (
      <Typography
        variant='h2'
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{mb:"5px"}}
        >
           {"Loading"}
        </Typography>
        )
      }
    </Box>
  )
}

export default Products
