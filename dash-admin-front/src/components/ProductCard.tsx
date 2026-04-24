import { useTheme } from '@emotion/react'
import { Button, Card, CardActions, CardContent, Collapse, Rating, Typography } from '@mui/material'
import React, { useState } from 'react'


const ProductCard = (product: Products) => {
    const theme = useTheme()
    const [isExpanded, setIsExpanded] = useState(false)
    return (
    <Card
        sx={{
            backgroundImage: "none",
            backgroundColor: theme.palette.background.alt,
            borderRadius: "0.55rem"
        }}
    >
      <CardContent>
        <Typography sx={{ fontSize:14}} color={theme.palette.secondary[700]} gutterBottom>
            {product.category}
        </Typography>
        <Typography variant='h5' component={"div"}>
            {product.name}
        </Typography>
        <Typography sx={{ mb:"1.5rem"}} color={theme.palette.secondary[400]}>
            {Number(product.price).toFixed(2)}
        </Typography>
        <Rating value={product.rating} readOnly/>
        </CardContent>
        <CardActions>
            <Button
                variant="contained"
                size='small'
                onClick={()=> setIsExpanded((prev)=> !prev)}
                >
                See more
            </Button>
        </CardActions>
        <Collapse
            in={isExpanded}
            timeout={"auto"}
            unmountOnExit
            sx={{
                color: theme.palette.neutral[300]
            }}
        >
            <CardContent>
                <Typography>id: {product._id}</Typography>
                <Typography>Supply Left: {product.supply}</Typography>
                <Typography>Yearly Sales This Year: {product.yearlySalesTotal}</Typography>
                <Typography>Yearly Units Sold This Year: {product.yearlyTotalSoldUnits}</Typography>
            </CardContent>
        </Collapse>
    </Card>
  )
}

export default ProductCard
