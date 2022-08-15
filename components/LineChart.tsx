import { useEffect, useRef } from 'react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Ticks
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

import { Line } from 'react-chartjs-2'

type ChartData = {
  labels: any[]
  datasets: any[]
}

type Props = {
  chartData: ChartData
}

const LineChart: React.FC<Props> = ({ chartData }) => {
  const chartRef = useRef(null)

  useEffect(() => {
    if (chartRef.current) {
      console.log(chartRef)
    }
  }, [])

  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      xAxis: {
        display: false
      },
      yAxis: {
        display: false,
        ticks: {
          maxTicksLimit: 7
        }
      }
    }
  }

  return <Line data={chartData} options={options} ref={chartRef} />
}

export default LineChart
