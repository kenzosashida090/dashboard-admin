import { useGetOverallStatsQuery } from "@/state/api"
import { useTheme } from "@mui/material"
import { Box, FormControl, InputLabel, MenuItem, Select, type SelectChangeEvent } from "@mui/material"
import React, { useEffect, useMemo, useRef, useState, } from "react"
import * as d3 from 'd3'
import { useSpring, animated } from "@react-spring/web"
import MapTooltip from "./MapTooltip"
import Loading from "./Loading"
const MARGIN = { top: 30, right: 30, bottom: 50, left: 60 };
type ViewChartObjectType = {
  label: 'Sales' | 'Units';
  value: 'totalSales' | 'totalUnits'
}

type DataChart = { month: string, totalSales?: number | undefined, totalUnits?: number | undefined } | undefined
const viewChartObject: ViewChartObjectType[] = [
  {
    label: 'Sales',
    value: 'totalSales'
  },
  {
    label: 'Units',
    value: 'totalUnits'
  }
]
type OverallChartType = {
  width: number;
  height: number;
}
const OverallChart = ({ width, height }: OverallChartType) => {
  const theme = useTheme()
  const { data: sales, isLoading, isError } = useGetOverallStatsQuery()
  const [nearestMonth, setNearestMonth] = useState<string>("")
  const [tooltip, setToolTip] = useState<{ x: number, y: number, ySvg: number, content: string } | null>(null)
  const axesRef = useRef(null)
  const bonusWidth = width - MARGIN.right - MARGIN.left
  const bonusHeight = height - MARGIN.top - MARGIN.bottom
  const [chartView, setChartView] = useState<ViewChartObjectType>(viewChartObject[0])
  // this is for the x axis
  //

  const months = useMemo(() =>
    sales?.monthlyData.map((elem) => elem.month) ?? []
    , [sales])
  const xScale = useMemo(() =>
    d3
      .scalePoint()
      .domain(months)
      .range([0, bonusWidth])
      .padding(0.5)
    , [bonusWidth, months])
  //this is for the y axis
  const [, yMax] = useMemo(() =>
    d3.extent(sales?.monthlyData ?? [], (d) => d[`${chartView?.value}`])
    , [chartView.value, sales?.monthlyData])
  const yScale = useMemo(() =>
    d3
      .scaleLinear()
      .domain([0, yMax || 0])
      .range([bonusHeight, 0])
    , [yMax, bonusHeight])
  const handleSelectView = (e: SelectChangeEvent) => {
    const selected = viewChartObject.find((item) => item?.value === e.target.value)
    setChartView(selected || { label: 'Sales', value: 'totalSales' })
  }

  useEffect(() => {
    const svgElement = d3.select(axesRef.current)
    svgElement.selectAll('*').remove()
    const xAxisGenerator = d3.axisBottom(xScale)
    svgElement
      .append('g')
      .attr('transform', 'translate(0,' + bonusHeight + ')')
      .call(xAxisGenerator)
    const yAxisGnerator = d3.axisLeft(yScale)
    svgElement.append('g').call(yAxisGnerator)

  }, [xScale, yScale, bonusHeight])

  const lineBuilder = useMemo(() =>


    d3
      .line<DataChart>()
      .x((d) => xScale(d?.month || "") ?? 0)
      .y((d) => yScale(d?.[`${chartView?.value ?? 0}`] ?? 0))
      .curve(d3.curveCatmullRom.alpha(0.5))

    , [chartView.value, xScale, yScale])
  const linePath = useMemo(() =>

    lineBuilder(sales?.monthlyData ?? [])
    , [lineBuilder, sales?.monthlyData])
  const allCircles = useMemo(() =>
    sales?.monthlyData.map((item, index) => {
      return (
        <circle
          key={index}
          cx={xScale(item?.month ?? "")}
          cy={yScale(item?.[`${chartView?.value ?? 'totalSales'}`])}
          r={4}
          fill={theme.palette.secondary['100']}
          onMouseLeave={() => setToolTip(null)}
        />
      )
    }), [chartView.value, sales?.monthlyData, theme.palette.secondary, setToolTip, xScale, yScale])

  if (!linePath) return null;
  const onMouseMove = (e: React.MouseEvent<SVGRectElement>) => {
    const svgReact = e.currentTarget.getBoundingClientRect()
    const mouseX = e.clientX - svgReact.left - MARGIN.left

    const eachBand = xScale.step()
    const index = Math.floor((mouseX - (eachBand / 2)) / eachBand + 1)
    const fixedIndex = Math.max(0, Math.min(index, months.length - 1))
    const nearestMonth = months[fixedIndex]
    const nearestData = sales?.monthlyData.find((el) => el.month === nearestMonth)
    setNearestMonth(nearestMonth)
    if (!nearestMonth) return
    setToolTip({
      x: e.clientX,
      y: e.clientY,
      ySvg: yScale(nearestData?.[`${chartView?.value ?? 'totalSales'}`] ?? 0),
      content: `${nearestMonth} - ${nearestData?.[`${chartView?.value ?? 'totalSales'}`]}`
    })
  }
  if (isLoading) return <Loading />
  if (isError) return <p>error</p>
  return (
    <Box m="1.5rem 0" height={'100%'}>
      <FormControl sx={{ minWidth: 120 }} size="medium">
        <InputLabel id='chart-selector-label'>View</InputLabel>
        <Select
          labelId="chart-selector-label"
          id="chart-selector"
          value={chartView?.value ?? ""}
          label='View'
          onChange={handleSelectView}
        >
          {
            viewChartObject.map((sale, index) => (
              <MenuItem key={index} value={sale?.value}>{sale?.label}</MenuItem>
            ))
          }
        </Select>
      </FormControl>
      <MapTooltip tooltip={tooltip} />
      <Box
        maxWidth="1800px"
        maxHeight={"800px"}
      >
        <svg
          viewBox={`0 0 ${width} ${height}`}
          style={{ width: '100%', height: '100%' }}
        >
          <g
            width={bonusWidth}
            height={bonusHeight}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
          >

            <LineItem path={linePath} color={chartView?.label === 'Sales' ? '#67C090' : '#215B63'} />
            {allCircles}
            {tooltip && (
              <Cursor
                height={bonusHeight}
                x={xScale(nearestMonth) ?? 0}
                y={tooltip.ySvg}
                color={"red"}
              />
            )}
            <rect
              width={bonusWidth}
              height={bonusHeight}
              fill="transparent"
              onMouseMove={onMouseMove}
              onMouseLeave={() => setToolTip(null)}
            />
          </g>
          <g
            width={bonusWidth}
            height={bonusHeight}
            ref={axesRef}
            transform={`translate(${[MARGIN.left, MARGIN.top].join(',')})`}
          />
          {/* X axis label */}
          <text
            x={MARGIN.left + bonusWidth / 2}
            y={height - 5}
            textAnchor="middle"
            fill={theme.palette.secondary["100"]}
            fontSize={12}
          >
            Months
          </text>

          {/* Y axis label */}
          <text
            transform={`translate(9, ${MARGIN.top + bonusHeight / 2}) rotate(-90)`}
            textAnchor="middle"
            fill={theme.palette.secondary["100"]}
            fontSize={12}
          >
            {chartView?.label}
          </text>
        </svg>
      </Box>
    </Box >
  )
}
type LineItemProps = {
  path: string;
  color: string;
};

export const LineItem = ({ path, color }: LineItemProps) => {
  const springProps = useSpring({
    to: {
      path,
      color
    },
    reset: true,
    config: {
      friction: 80,
    }
  })
  return (
    <animated.path
      d={springProps.path}
      fill={'none'}
      stroke={color}
      strokeWidth={2}
    />
  )
}
type CursorProps = {
  x: number | null;
  y: number;
  height: number;
  color: string;
};
export const Cursor = ({ x, y, height, color }: CursorProps) => {
  const theme = useTheme()
  const springProps = useSpring({
    to: {
      x,
      y,
    },
  });

  if (!springProps.x) {
    return null;
  }

  return (
    <>
      <animated.line
        x1={springProps?.x}
        x2={springProps?.x}
        y1={0}
        y2={height}
        stroke={theme.palette.primary['100']}
        strokeWidth={1}
      />
      <circle cx={x ?? 0} cy={y ?? 0} r={5} fill={color} />
    </>
  );
};
export default OverallChart
