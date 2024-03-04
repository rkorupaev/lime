import React, {useState} from 'react'
import {PieChart, Pie, Sector, Cell} from 'recharts'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {GetAppsStatsDayResponse} from '../../../services/AppService'
import Tooltip from '@mui/material/Tooltip'
dayjs.extend(duration)

export const secondsToHHMMss = (seconds: number) => {
    const duration = dayjs.duration(seconds, 'seconds')

    const hours = duration.hours()
    const minutes = duration.minutes()
    const remainingSeconds = duration.seconds()

    const formattedHours = String(hours).padStart(2, '0')
    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`
}

const generateColors = (count: number): string[] => {
    const colors = []
    const goldenRatioConjugate = 0.618033988749895

    const getRandomHue = (): number => {
        let hue = Math.random()
        hue += goldenRatioConjugate
        hue %= 1
        return Math.floor(hue * 360)
    }

    for (let i = 0; i < count; i++) {
        const hue = getRandomHue()
        const saturation = 40 + Math.random() * 20 // Более низкая насыщенность
        const lightness = 50 + Math.random() * 10 // Слегка изменяем светлоту
        const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`
        colors.push(color)
    }

    return colors
}

const colorsArray = generateColors(100)

// eslint-disable-next-line
//@ts-ignore
const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180
    const {cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value} = props
    const sin = Math.sin(-RADIAN * midAngle)
    const cos = Math.cos(-RADIAN * midAngle)
    const sx = cx + (outerRadius + 10) * cos
    const sy = cy + (outerRadius + 10) * sin
    const mx = cx + (outerRadius + 30) * cos
    const my = cy + (outerRadius + 30) * sin
    const ex = mx + (cos >= 0 ? 1 : -1) * 22
    const ey = my
    const textAnchor = cos >= 0 ? 'start' : 'end'

    return (
        <g>
            {payload.app_name.length > 18 ? (
                <Tooltip title={payload.app_name}>
                    <text x={cx} y={cy} dy={8} width={80} accentHeight={15} textAnchor='middle' fill={fill}>
                        {`${payload.app_name.slice(0, 15)}...`}
                    </text>
                </Tooltip>
            ) : (
                <text x={cx} y={cy} dy={8} width={80} accentHeight={15} textAnchor='middle' fill={fill}>
                    {payload.app_name}
                </text>
            )}

            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius}
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={outerRadius + 6}
                outerRadius={outerRadius + 10}
                fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill='none' />
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke='none' />
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill='#333'>{`${secondsToHHMMss(
                value
            )}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill='#999'>
                {`(${(percent * 100).toFixed(2)}%)`}
            </text>
        </g>
    )
}

export const PieChartWrapper = ({data}: {data: GetAppsStatsDayResponse[] | undefined}) => {
    const [activeIndex, setActiveIndex] = useState(0)

    // eslint-disable-next-line
    //@ts-ignore
    const onPieEnter = (index) => {
        setActiveIndex(index.name)
    }

    if (!data) {
        return null
    } else
        return (
            <PieChart width={520} height={400}>
                <Pie
                    activeIndex={activeIndex}
                    // activeIndex={data.map((_, index) => index)}
                    activeShape={renderActiveShape}
                    data={data}
                    innerRadius={80}
                    outerRadius={110}
                    fill='#8884d8'
                    dataKey='foreground_time'
                    onMouseEnter={(e) => onPieEnter(e)}
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colorsArray[index]} />
                    ))}
                </Pie>
            </PieChart>
        )
}
