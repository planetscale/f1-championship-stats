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

const options: any = {
  animation: false,
  events: [],
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
      min: 0,
      max: 600,
      ticks: {
        maxTicksLimit: 7
      }
    }
  }
}

const LineChart: React.FC<Props> = ({ chartData }) => {
  return <Line data={chartData} options={options} />
}

export default LineChart
