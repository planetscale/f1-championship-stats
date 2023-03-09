import type { NextPage } from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import SVG from 'react-inlinesvg'
import { useTheme } from 'next-themes'

import LineChart from '@/components/LineChart'
import StandingsItem from '@/components/StandingsItem'

import { constructorColor, circuitName } from '@/utils/detail'
import { RaceData, Constructor } from '@/utils/types'

async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  return fetch(input, init).then((res) => res.json())
}

const cloudflareUrl = 'https://f1-championship-stats.mike.workers.dev/data.json'
// const fastlyUrl = 'https://f1-planetscale.edgecompute.app/data.json'
const netlifyUrl = 'https://f1-championship-stats.netlify.app/data.json'
const vercelUrl = 'https://f1-championship-stats-workers.preview.planetscale.com/api/data.json'

const Home: NextPage = () => {
  const { resolvedTheme } = useTheme()
  const [edgeFunctionUrl, setEdgeFunctionUrl] = useState(cloudflareUrl)
  const [lineChartMemoizeKey, setLineChartMemoizeKey] = useState(0)
  const { data, error } = useSWR<RaceData>(edgeFunctionUrl, fetcher)
  const [raceNames, setRaceNames] = useState([])
  const [datasets, setDatasets] = useState([])
  const [raceDates, setRaceDates] = useState([])
  const [selectedRound, setSelectedRound] = useState(datasets[0]?.data.length - 1 ?? -1)
  const [teams, setTeams] = useState({})
  const [standings, setStandings] = useState([])
  const [lastIndex, setLastIndex] = useState(0)

  useEffect(() => {
    const lastIndex = datasets[0]?.data.length - 1
    setSelectedRound(lastIndex ?? -1)
    setLastIndex(lastIndex ?? 0)
  }, [datasets])

  useEffect(() => {
    if (data) {
      const f = new Intl.DateTimeFormat('en-us', { month: 'short', day: 'numeric', timeZone: 'UTC' })

      setRaceDates(
        data?.races.map((item) => {
          return f.formatToParts(Date.parse(item.date)).reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {})
        }) ?? []
      )
      setRaceNames(data.races.map((item) => circuitName(item.race_name)))

      const teams: Record<string, Constructor> = data.results.reduce((acc, item) => {
        if (!acc[item.teamId]) {
          acc[item.teamId] = { name: item.name, points: [], id: item.teamId }
        }
        acc[item.teamId].teamName = item.name
        acc[item.teamId].points.push(item.points)
        return acc
      }, {})

      setTeams(teams)

      setDatasets(
        Object.keys(teams).map((key) => {
          const team = teams[key]
          return {
            label: team.name,
            data: team.points,
            fill: false,
            borderWidth: 2,
            borderColor: constructorColor(key),
            backgroundColor: constructorColor(key),
            pointBorderColor: resolvedTheme === 'light' ? '#FFFFFF' : '#000000',
            pointBorderWidth: 2
          }
        })
      )
    }
  }, [data, resolvedTheme])

  useEffect(() => {
    if (selectedRound < 0) {
      return
    }

    const standingsArr = Object.keys(teams).map((key, i) => {
      const team = teams[key]
      const points = team.points[selectedRound]
      return {
        position: i + 1,
        points: points,
        name: team.name,
        teamId: team.id
      }
    })

    const newStandings = standingsArr
      .sort((a, b) => b.points - a.points)
      .map((standing, i) => {
        return {
          position: i + 1,
          points: standing.points,
          name: standing.name,
          teamId: standing.teamId
        }
      })

    setStandings(newStandings)
  }, [selectedRound, teams])

  if (error) return

  const chartData = {
    labels: raceNames,
    datasets: datasets
  }

  return (
    <>
      <Head>
        <title>F1 Constructors Championship standings</title>
        <meta
          name='description'
          content='F1 Constructors Championship standings week-by-week. Powered by edge functions and PlanetScale.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='container mx-auto items-end justify-between space-y-2 px-3 pt-4 pb-4 md:flex md:px-6 md:pb-2 md:pt-8'>
        <h1 className='text-xl font-semibold lg:text-2xl'>
          <span className='block font-brand leading-none tracking-tighter'>
            2023 <span className='text-[#E20500]'>Formula 1</span>
          </span>
          Constructor championship standings
        </h1>

        <div className='flex rounded border p-1 font-semibold focus-within:border-blue-500 focus-within:shadow-none focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-200 focus-within:ring-offset-0 focus:!transition-none dark:focus-within:ring-blue-800'>
          <label className='dark select-none whitespace-nowrap rounded-xs bg-secondary px-1 py-sm text-xs text-primary'>
            Edge function
          </label>

          <select
            onChange={(event) => {
              setEdgeFunctionUrl(event.target.value)
              setLineChartMemoizeKey(lineChartMemoizeKey + 1)
            }}
            defaultValue={cloudflareUrl}
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
          <main className='container relative mx-auto overflow-hidden px-3 pb-6 font-brand md:px-6 lg:pr-8'>
            <div className='dark top-12 left-14 z-1 mb-3 space-y-1 rounded bg-secondary p-1 font-bold text-primary shadow-xl shadow-black/25 supports-bg-blur:bg-black/90 supports-bg-blur:backdrop-blur-sm dark:shadow-black/90 dark:ring-1 dark:ring-white/10 supports-bg-blur:dark:bg-gray-850/60 lg:absolute lg:w-32 lg:p-1.5 xl:w-38 2xl:left-18 2xl:top-14'>
              {standings.map((standing, i) => (
                <StandingsItem key={i} standing={standing} />
              ))}
            </div>

            <div className='grid translate-x-[18px] translate-y-3 grid-cols-26 whitespace-nowrap pt-1 pb-2 text-2xs sm:translate-x-[19px] md:translate-x-[23px] lg:translate-x-[22px] lg:pb-0 xl:translate-x-[34px] 2xl:translate-x-[46px]'>
              {raceDates.map((date, i) => (
                <button
                  key={i}
                  disabled={i > lastIndex}
                  onClick={() => {
                    setSelectedRound(i)
                  }}
                  className={`flex origin-left translate-x-px -rotate-45 items-center justify-center rounded bg-primary py-sm px-2.5 lg:h-4.5 lg:w-4.5 lg:rotate-0 lg:px-0 lg:text-center lg:ring-1 lg:ring-black/[.08] lg:dark:ring-white/15 ${
                    i === selectedRound
                      ? 'z-1 bg-gray-850 text-gray-50 shadow-lg shadow-black/25 dark:bg-gray-50 dark:text-gray-900 dark:shadow-black/90 lg:border-transparent'
                      : 'lg:shadow-black/5 lg:dark:shadow-black/90'
                  } ${i > lastIndex ? 'text-secondary' : 'lg:shadow-md'}`}
                >
                  <div
                    className={`flex space-x-xs lg:block lg:translate-y-xs ${
                      i === selectedRound ? 'lg:text-gray-50 lg:dark:text-gray-900' : ''
                    }`}
                  >
                    <div className='text-3xs font-bold leading-none tracking-tighter'>{date.month}</div>
                    <div className='text-3xs font-bold leading-none lg:text-sm lg:font-normal'>{date.day}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className='grid grid-cols-26 grid-rows-[7]'>
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

              <div className='col-start-2 col-end-[23] row-start-1 row-end-2'>
                <div className='grid h-full grid-cols-25'>
                  {[...Array(21)].map((_, i) => (
                    <div
                      key={i}
                      className={`border-b border-r border-r-gray-50 [border-bottom-style:dashed] dark:border-r-gray-850 ${
                        i % 21 === selectedRound - 1 ? 'border-r-gray-800 dark:border-r-gray-100' : ''
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className='relative col-start-2 col-end-[23] row-start-2 row-end-[8]'>
                <div className='grid h-full grid-cols-25'>
                  {[...Array(126)].map((_, i) => (
                    <div
                      key={i}
                      className={`relative border-b border-r border-r-gray-50 [border-bottom-style:dashed] dark:border-r-gray-850 ${
                        i % 21 === selectedRound - 1
                          ? 'border-r-gray-800 after:absolute after:-bottom-2 after:-right-px after:block after:h-2 after:w-px after:bg-gray-800 dark:border-r-gray-100 dark:after:bg-gray-100'
                          : ''
                      }`}
                    />
                  ))}
                </div>

                <div className='absolute -inset-x-[6px] -inset-y-[5px]'>
                  <LineChart chartData={chartData} key={lineChartMemoizeKey} />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-26 justify-items-end whitespace-nowrap pt-1 pb-6 text-2xs text-gray-600'>
              {raceNames.map((name, i) => (
                <div
                  key={i}
                  className={`origin-top-right -translate-x-px -rotate-45 py-xs px-[6px] ${
                    i === selectedRound
                      ? 'dark: z-1 rounded bg-gray-850 font-bold tracking-tighter text-gray-50 shadow-lg shadow-black/25 dark:bg-gray-50 dark:text-gray-900 dark:shadow-black/90 lg:border-transparent'
                      : ''
                  }`}
                >
                  {name}
                </div>
              ))}
            </div>
          </main>

          <section className='container mx-auto px-3 pt-2 pb-6 md:px-6'>
            <div className='space-y-1 border-y py-3'>
              <h3 className='text-sm font-semibold'>How this works</h3>
              <p className='lg:w-3/4'>
                This is powered by edge functions and a PlanetScale database. Each edge function uses{' '}
                <a href='https://github.com/planetscale/database-js' className='text-blue'>
                  @planetscale/database
                </a>{' '}
                to query data over HTTP. Use the drop down to swap between different edge functions. See the source for
                each function{' '}
                <a href='https://github.com/planetscale/f1-championship-stats/tree/main/examples' className='text-blue'>
                  here
                </a>
                .
              </p>
            </div>
          </section>

          <footer className='container mx-auto mt-2 items-center justify-between space-y-2 px-3 pb-8 sm:flex sm:space-y-0 md:px-6'>
            <a href='https://planetscale.com' className='flex items-center space-x-1 font-semibold'>
              <span>Powered by</span> <SVG src='planetscale.svg' />
            </a>

            <a
              href='https://github.com/planetscale/f1-championship-stats'
              className='flex items-center space-x-1 font-semibold'
            >
              <span>View on</span> <SVG src='github-icon.svg' />
            </a>
          </footer>
        </>
      )}
    </>
  )
}

export default Home
