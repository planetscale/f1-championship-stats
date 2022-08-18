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

const delayBetweenPoints = 25

const options: any = {
  animation: {
    x: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      from: NaN, // the point is initially skipped
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.xStarted) {
          return 0
        }
        ctx.xStarted = true
        return ctx.index * delayBetweenPoints
      }
    },
    y: {
      type: 'number',
      easing: 'linear',
      duration: delayBetweenPoints,
      delay(ctx) {
        if (ctx.type !== 'data' || ctx.yStarted) {
          return 0
        }
        ctx.yStarted = true
        return ctx.index * delayBetweenPoints
      }
    }
  },
  events: [],
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

const LineChart: React.FC<Props> = ({ chartData }) => {
  return <Line data={chartData} options={options} />
}

export default LineChart
