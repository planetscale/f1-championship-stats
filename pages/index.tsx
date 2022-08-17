import type { NextPage } from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import { useState } from 'react'
import SVG from 'react-inlinesvg'
import { useTheme } from 'next-themes'
import maxBy from 'lodash.maxby'

import LineChart from '@/components/LineChart'
import StandingsItem from '@/components/StandingsItem'

import { constructorColor, circuitName } from '@/utils/detail'
import { RaceData, Constructor } from '@/utils/types'

function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  return fetch(input, init).then((res) => res.json())
}

const cloudflareUrl = 'https://f1-championship-stats.mike.workers.dev/data.json'
const netlifyUrl = 'https://f1-championship-stats.netlify.app/data.json'
const vercelUrl = 'https://f1-championship-stats-workers.preview.planetscale.com/api/data.json'

const Home: NextPage = () => {
  const { resolvedTheme } = useTheme()
  const { data, error } = useSWR<RaceData>('https://f1-championship-stats.mike.workers.dev/data.json', fetcher)
  const [edgeFunctionUrl, setEdgeFunctionUrl] = useState(cloudflareUrl)
  const onChange = (event) => setEdgeFunctionUrl(event.target.value)

  if (error) return

  let raceNames = []
  const datasets = []
  let currentRound = -1

  const f = new Intl.DateTimeFormat('en-us', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const raceDates: Array<Record<string, string>> =
    data?.races.map((item) => {
      return f.formatToParts(Date.parse(item.date)).reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {})
    }) ?? []

  if (data) {
    raceNames = data.races.map((item) => circuitName(item.race_name))

    const { round } = maxBy(data.results, 'round')
    currentRound = round - 1

    const teams: Record<string, Constructor> = data.results.reduce((acc, item) => {
      if (!acc[item.teamId]) {
        acc[item.teamId] = { teamName: item.name, points: [] }
      }
      acc[item.teamId].teamName = item.name
      acc[item.teamId].points.push(item.points)
      return acc
    }, {})

    for (const [key, team] of Object.entries(teams)) {
      datasets.push({
        label: team.teamName,
        data: team.points,
        fill: false,
        borderWidth: 2,
        borderColor: constructorColor(key),
        backgroundColor: constructorColor(key),
        pointBorderColor: resolvedTheme === 'light' ? '#FFFFFF' : '#000000',
        pointBorderWidth: 2
      })
    }
  }

  const chartData = {
    labels: raceNames,
    datasets: datasets
  }

  return (
    <>
      <Head>
        <title>F1 Championship standings</title>
        <meta name='description' content='F1 Championship standings' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='container mx-auto items-end justify-between space-y-2 px-6 pt-8 pb-2 md:flex'>
        <h1 className='text-xl lg:text-2xl'>
          <span className='block text-[#E20500]'>2022 Formula 1</span>Constructor championship standings {resolvedTheme}
        </h1>

        <div className='flex rounded border p-1 focus-within:border-blue-500 focus-within:shadow-none focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 focus-within:ring-offset-0 focus:!transition-none dark:focus-within:ring-blue-800'>
          <label className='dark select-none whitespace-nowrap rounded-xs bg-secondary px-1 py-sm text-xs text-primary'>
            Edge function
          </label>

          <select
            onChange={onChange} defaultValue={cloudflareUrl}
            className='w-20 flex-1 border-none bg-primary py-0 pr-4 pl-2 text-xs !shadow-none !ring-0 focus:border-blue-500 focus:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 focus:!transition-none dark:focus:ring-blue-800'
          >
            <option value={cloudflareUrl}>Cloudflare</option>
            <option value={netlifyUrl}>Netlify</option>
            <option value={vercelUrl}>Vercel</option>
          </select>
        </div>
      </header>

      {data && (
        <>
          <main className='container relative mx-auto px-6 pb-6 lg:pr-8'>
            <div className='dark top-1/2 right-5 z-1 mb-3 space-y-1 rounded bg-secondary p-2 font-bold text-primary shadow-xl shadow-black/25 dark:shadow-black/90 dark:ring-1 dark:ring-white/10 lg:absolute lg:w-38 lg:-translate-y-1/2 xl:right-14 2xl:right-20'>
              {data?.standings.map((standing, i) => (
                <StandingsItem key={i} standing={standing} />
              ))}
            </div>

            <div className='grid translate-x-[18px] translate-y-3 grid-cols-22 whitespace-nowrap pt-1 pb-2 text-2xs sm:translate-x-[19px] md:translate-x-[23px] lg:translate-x-[22px] lg:pb-0 xl:translate-x-[34px] 2xl:translate-x-[46px]'>
              {raceDates.map((date, i) => (
                <div
                  key={i}
                  className={`flex origin-left translate-x-px -rotate-45 items-center justify-center rounded bg-primary py-sm px-2.5 lg:h-4.5 lg:w-4.5 lg:rotate-0 lg:px-0 lg:text-center lg:ring-1 lg:ring-black/[.08] lg:dark:ring-white/15 ${
                    i === currentRound
                      ? 'z-1 bg-gray-850 text-gray-50 shadow-lg shadow-black/25 dark:bg-gray-50 dark:shadow-black/90 lg:border-transparent'
                      : 'lg:shadow-md lg:shadow-black/5 lg:dark:shadow-black/90'
                  }`}
                >
                  <div
                    className={`flex space-x-xs lg:block lg:translate-y-xs ${
                      i === currentRound ? 'lg:text-gray-50 lg:dark:text-gray-900' : ''
                    }`}
                  >
                    <div className='text-3xs font-bold leading-none tracking-tighter'>{date.month}</div>
                    <div className='text-3xs font-bold leading-none lg:text-sm lg:font-normal'>{date.day}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className='grid grid-cols-22 grid-rows-[7]'>
              <div className='col-start-1 col-end-2 row-start-1 row-end-[8]'>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  600
                </div>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  500
                </div>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  400
                </div>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  300
                </div>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  200
                </div>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  100
                </div>
                <div className='border-b border-r border-r-gray-50 pt-8 text-xs text-secondary [border-bottom-style:dashed] dark:border-r-gray-850'>
                  0
                </div>
              </div>

              <div className='col-start-2 col-end-[23] row-start-1 row-end-3'>
                <div className='grid h-full grid-cols-21'>
                  {[...Array(42)].map((_, i) => (
                    <div
                      key={i}
                      className={`border-b border-r border-r-gray-50 [border-bottom-style:dashed] dark:border-r-gray-850 ${
                        i % 21 === 11 ? 'border-r-gray-800 dark:border-r-gray-100' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='relative col-start-2 col-end-[23] row-start-3 row-end-[8]'>
                <div className='grid h-full grid-cols-21'>
                  {[...Array(105)].map((_, i) => (
                    <div
                      key={i}
                      className={`relative border-b border-r border-r-gray-50 [border-bottom-style:dashed] dark:border-r-gray-850 ${
                        i % 21 === 11
                          ? 'border-r-gray-800 after:absolute after:-bottom-2 after:-right-px after:block after:h-2 after:w-px after:bg-gray-800 dark:border-r-gray-100 dark:after:bg-gray-100'
                          : ''
                      }`}
                    />
                  ))}
                </div>

                <div className='absolute -inset-x-[6px] -inset-y-[5px]'>
                  <LineChart chartData={chartData} />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-22 justify-items-end whitespace-nowrap pt-1 pb-6 text-2xs text-secondary'>
              {raceNames.map((name, i) => (
                <div
                  key={i}
                  className={`origin-top-right -translate-x-px -rotate-45 py-xs px-[6px] ${
                    i === currentRound
                      ? 'rounded bg-gray-850 font-bold tracking-tighter text-gray-50 shadow-lg shadow-black/25 dark:bg-gray-50 dark:text-gray-900 dark:shadow-black/90'
                      : ''
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>
          </main>

          <footer className='container mx-auto mt-2 flex items-center justify-between px-6 pb-8'>
            <a className='flex items-center space-x-1' href='http://www.planetscale.com'>
              <span>Powered by</span> <SVG src='planetscale.svg' />
            </a>

            <a className='flex items-center space-x-1' href='https://github.com/planetscale/f1-championship-stats'>
              <span>View on</span> <SVG src='github-icon.svg' />
            </a>
          </footer>
        </>
      )}
    </>
  )
}

export default Home
