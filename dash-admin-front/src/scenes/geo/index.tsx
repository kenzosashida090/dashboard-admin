import Header from "@/components/Header"
import { useGetGeographyQuery } from "@/state/api"
import { Box } from "@mui/material"
import type { FeatureCollection } from "geojson"
import React, { useEffect, useMemo, useRef, useState } from "react"
import * as d3 from 'd3'
import Legend from "@/components/Legend"
import { useTheme } from "@emotion/react"
import { debounce } from "lodash"

import MapTooltip from "@/components/MapTooltip"
type MapProps = {
  width: number
  height: number;
}
const Geography = ({ width = 800, height = 400 }: MapProps) => {
  const { data: geo, isLoading, isError } = useGetGeographyQuery()
  const containerRef = useRef<HTMLDivElement>(null)
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null)

  const theme = useTheme()
  const [tooltip, setTooltip] = useState<{ x: number, y: number, content: string } | null>(null)
  const colorSchale = useMemo(() =>
    d3
      .scaleThreshold<number, string>() //THis is a type of color scale more often use in chorapletg maps mor direct colors
      .domain([1, 5, 10, 20, 30, 40, 50])
      .range([...d3.schemeBlues[4]])
    , [])

  const onMouseMove = useMemo(() =>
    debounce((e: React.MouseEvent) => {
      setTooltip(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null)
    }, 30), [])
  // Fetch world borders separately

  useEffect(() => {

    fetch("https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson")
      .then(res => res.json())
      .then(data => setGeoData(data as FeatureCollection))

  }, [])

  const projections = useMemo(() =>
    d3
      .geoMercator()
      .scale((width / 2) / Math.PI - 20)
      .center([10, 55])
      .translate([width / 2, height / 2]),
    [height, width])
  const geoPathGenerator = useMemo(() =>
    d3.geoPath().projection(projections)
    , [projections])
  const allSvgPaths = useMemo(() =>
    geoData?.features
      .map((shape, index) => {
        if (shape?.properties === null) return
        const isoCode = shape.properties['ISO3166-1-Alpha-3']
        if (!isoCode) return
        const regionData = geo?.find((region) => region.id === isoCode)

        const color = regionData ? colorSchale(regionData.value) : theme?.palette.secondary["400"]

        return (

          <path
            key={`${shape?.properties['ISO3166-1-Alpha-3']} + ${index}`}
            d={geoPathGenerator(shape) ?? ""}
            stroke="lightGrey"
            strokeWidth={0.5}
            fill={color}
            fillOpacity={1}
            onMouseEnter={(event) => setTooltip({
              x: event.clientX, y: event.clientY, content: `${isoCode} - ${regionData?.value ?? 0}`
            })}
            onMouseMove={onMouseMove}
            onMouseLeave={() => setTooltip(null)}
          />


        )
      }), [geo, geoData, colorSchale, theme, geoPathGenerator, onMouseMove])
  if (isLoading) return <p>Loading</p>
  if (isError) return <p>Error</p>
  return (
    <Box m="1.5rem 2.5rem" height={'100%'} >
      <Header title="Geography" subtitle="All users around the world." />
      <Box
        /// <reference path="" />
        ref={containerRef}
        sx={{
          border: `1px solid ${theme?.palette.secondary["400"]}`,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          minHeight: '120vh',
          maxHeight: '110vh'
        }}
        width={"100%"}

      >
        <MapTooltip tooltip={tooltip} />
        <svg style={{ width: '100%', flex: 1, minHeight: 0, }} viewBox={`0 0 ${width} ${height}`} >

          {allSvgPaths}
        </svg>
        <Legend width={400} height={100} colorScale={colorSchale} />
      </Box >
    </Box >
  )
}

export default Geography

