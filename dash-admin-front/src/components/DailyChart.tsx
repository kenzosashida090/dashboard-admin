import { useGetOverallStatsQuery } from "@/state/api"
import { Box, useTheme } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { DatePicker } from 'react-datepicker'
import * as d3 from 'd3'
import "react-datepicker/dist/react-datepicker.css";
import { Cursor, LineItem } from "./OverallChart"
import MapTooltip from "./MapTooltip"
import Loading from "./Loading"

type OverallChartType = {
  width: number;
  height: number;
}
const MARGIN = { top: 80, right: 60, bottom: 50, left: 60 };
type DataChart = { month: string, totalSales?: number | undefined, totalUnits?: number | undefined } | undefined

const DailyChart = ({ width, height }: OverallChartType) => {
  const theme = useTheme()
  const { data: sales, isLoading, isError } = useGetOverallStatsQuery()
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([null, null])
  const [tooltipSales, setToolTipSales] = useState<{ x: number, y: number, ySvg: number, content: string } | null>(null)
  const [tooltipUnits, setToolTipUnits] = useState<{ x: number, y: number, ySvg: number, content: string } | null>(null)
  const [startDate, endDate] = dateRange
  const [nearestMonth, setNearestMonth] = useState<string>("")
  const axisRef = useRef(null)
  const bonusWidth = width - MARGIN.right - MARGIN.left
  const bonusHeight = height - MARGIN.top - MARGIN.bottom
  const filteredData = useMemo(() => {
    if (!sales?.monthlyData) return []
    if (!startDate || !endDate) return sales.monthlyData

    const startMonth = startDate.toLocaleString('en-US', { month: 'long' })
    const endMonth = endDate.toLocaleString('en-US', { month: 'long' })

    const startIndex = sales.monthlyData.findIndex(d => d.month === startMonth)
    const endIndex = sales.monthlyData.findIndex(d => d.month === endMonth)

    if (startIndex === -1 || endIndex === -1) return []
    return sales.monthlyData.slice(startIndex, endIndex + 1)
  }, [sales, startDate, endDate])

  const months = useMemo(() => filteredData.map((el) => el.month) ?? [], [filteredData])
  const xScale = useMemo(() =>
    d3
      .scalePoint()
      .domain(months)
      .range([0, bonusWidth])

    , [bonusWidth, months])


  const [, yMaxSales] = useMemo(() =>
    d3.extent(filteredData ?? [], (d) => d.totalSales)
    , [filteredData])
  const [, yMaxUnits] = useMemo(() =>
    d3.extent(filteredData ?? [], (d) => d.totalUnits)
    , [filteredData])
  const yScaleSales = useMemo(() =>
    d3
      .scaleLinear()
      .domain([0, yMaxSales || 0])
      .range([bonusHeight, 0])
    , [bonusHeight, yMaxSales])

  const yScaleUnits = useMemo(() =>
    d3
      .scaleLinear()
      .domain([0, yMaxUnits || 0])
      .range([bonusHeight, 0])

    , [bonusHeight, yMaxUnits])

  useEffect(() => {
    const svgElement = d3.select(axisRef.current)
    svgElement.selectAll('*').remove()
    const monthXAxisGenerator = d3.axisBottom(xScale)
    const ySalesAxisLeft = d3.axisLeft(yScaleSales)
    const yUnitsAxisRight = d3.axisRight(yScaleUnits)
    const gSales = svgElement.append('g').call(ySalesAxisLeft)
    const gUnits = svgElement.append('g').attr('transform', `translate(${bonusWidth},0)`).call(yUnitsAxisRight)

    svgElement
      .append('g')
      .attr('transform', `translate(0,${bonusHeight})`)
      .call(monthXAxisGenerator)
    gSales
      .append('circle').attr("cx", 500).attr("cy", -70).attr("r", 6).style("fill", "#69b3a2")


    gSales.append("text")
      .attr("x", 545)  // offset to the right of circle
      .attr("y", -69)
      .text("Sales")
      .style("font-size", "12px")
      .style("fill", "#69b3a2")
      .attr("alignment-baseline", "middle")

    gUnits
      .append('circle').attr("cx", -180).attr("cy", -50).attr("r", 6).style("fill", "#215B63")


    gUnits.append("text")
      .attr("x", -165)  // offset to the right of circle
      .attr("y", -49)
      .text("Units")
      .style("font-size", "12px")
      .style("fill", "#215B63")
      .attr("alignment-baseline", "middle")



  }, [bonusHeight, bonusWidth, xScale, yScaleSales, yScaleUnits])

  const lineBuilderSales = useMemo(() =>
    d3
      .line<DataChart>()
      .x((d) => xScale(d?.month || "") ?? 0)
      .y((d) => yScaleSales(d?.totalSales ?? 0))
      .curve(d3.curveCatmullRom.alpha(0.5))

    , [filteredData, xScale, yScaleSales])
  const lineBuilderUnits = useMemo(() =>
    d3.line<DataChart>()
      .x(d => xScale(d?.month || "") ?? 0)
      .y(d => yScaleUnits(d?.totalUnits ?? 0))
      .curve(d3.curveCatmullRom.alpha(0.5))

    , [filteredData, xScale, yScaleUnits])
  const linePathSales = useMemo(() =>
    lineBuilderSales(filteredData ?? [])
    , [lineBuilderSales, filteredData])
  const linePathUnits = useMemo(() =>
    lineBuilderUnits(filteredData ?? [])
    , [lineBuilderUnits, filteredData])
  const salesCircles = useMemo(() =>
    filteredData.map((item, index) => {
      return (
        <circle
          key={index}
          cx={xScale(item?.month ?? "")}
          cy={yScaleSales(item?.['totalSales'])}
          r={4}
          fill={theme.palette.secondary['100']}
          onMouseLeave={() => setToolTipSales(null)}
        />
      )
    })
    , [filteredData, xScale, yScaleSales, theme.palette.secondary])
  const unitCircles = useMemo(() =>

    filteredData.map((item, index) => {
      return (
        <circle
          key={index}
          cx={xScale(item?.month ?? "")}
          cy={yScaleUnits(item?.['totalUnits'])}
          r={4}
          fill={theme.palette.secondary['100']}
          onMouseLeave={() => setToolTipUnits(null)}
        />
      )
    })
    , [filteredData, xScale, yScaleUnits, theme.palette.secondary])
  const onMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const svgReact = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - svgReact.left - MARGIN.left

    const eachBand = xScale.step()
    const index = Math.floor((mouseX - (eachBand / 2)) / eachBand + 1)
    const fixedIndex = Math.max(0, Math.min(index, months.length - 1))
    const nearestMonth = months[fixedIndex]
    const nearestData = filteredData.find((el) => el.month === nearestMonth)
    setNearestMonth(nearestMonth)
    if (!nearestMonth) return
    setToolTipSales({
      x: e.clientX,
      y: e.clientY - 100,
      ySvg: yScaleSales(nearestData?.['totalSales'] ?? 0),
      content: `${nearestMonth} - ${nearestData?.['totalSales']}`
    })
    setToolTipUnits({
      x: e.clientX,
      y: e.clientY,
      ySvg: yScaleUnits(nearestData?.['totalUnits'] ?? 0),
      content: `${nearestMonth} - ${nearestData?.['totalUnits']}`
    })

  }

  if (isLoading) return <Loading />
  if (isError) return <p>error</p>
  if (!linePathSales || !linePathUnits) return null

  return (
    <Box m="1.5rem 0" height={'100%'}>
      <DatePicker
        startDate={startDate}
        endDate={endDate}
        onChange={setDateRange}
        selectsRange
        isClearable

      />
      <MapTooltip tooltip={tooltipSales} color={"#67C090"} />
      <MapTooltip tooltip={tooltipUnits} color={"#215B63"} />
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: '100%' }}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
          <LineItem key={`sales-${months.join('-')}`} path={linePathSales} color="#67C090" />
          <LineItem key={`units-${months.join('-')}`} path={linePathUnits} color="#215B63" />
          {salesCircles}
          {unitCircles}
          {tooltipSales && (
            <>
              <Cursor
                height={bonusHeight}
                x={xScale(nearestMonth) ?? 0}
                y={tooltipUnits?.ySvg ?? 0}
                color={"red"}
              />
              <Cursor
                height={bonusHeight}
                x={xScale(nearestMonth) ?? 0}
                y={tooltipSales?.ySvg ?? 0}
                color={"red"}
              />

            </>
          )}
          <rect
            width={bonusWidth}
            height={bonusHeight}
            fill="transparent"
            onMouseMove={onMouseMove}
            onMouseLeave={() => {
              setToolTipSales(null);
              setToolTipUnits(null)
            }}
          />
        </g>
        <g ref={axisRef} transform={`translate(${MARGIN.left}, ${MARGIN.top})`} />
      </svg>
    </Box>
  )
}

export default DailyChart
