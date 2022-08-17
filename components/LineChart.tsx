import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
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
  const options = {
    events: [],
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
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

  return <Line data={chartData} options={options} />
}

export default LineChart
