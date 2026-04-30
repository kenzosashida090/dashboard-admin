import { useTheme } from "@mui/material"

type MapTooltipType = {
  tooltip: {
    x: number
    y: number
    content: string
  } | null
  color?: string
}
const MapTooltip = ({ tooltip, color }: MapTooltipType) => {
  const theme = useTheme()
  if (!tooltip) return null
  return (
    <div
      key={tooltip.content}
      style={{
        position: "fixed",
        top: tooltip.y - 40,
        left: tooltip.x + 10,
        background: color,
        color: "white",
        padding: "4px",
        borderRadius: "4px",

        pointerEvents: "none",
        zIndex: 9999,
        fontSize: 12,
        border: `1px solid ${theme?.palette.secondary["400"]}`
      }}>
      {tooltip.content}
    </div>

  )
}

export default MapTooltip
