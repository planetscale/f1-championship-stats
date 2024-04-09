import type { NextPage } from 'next'
import Head from 'next/head'
import useSWR from 'swr'
import { useEffect, useState } from 'react'
import SVG from 'react-inlinesvg'
import { useTheme } from 'next-themes'
import cn from 'classnames'

import LineChart from '@/components/LineChart'
import StandingsItem from '@/components/StandingsItem'

import { constructorColor, constructorName, circuitName } from '@/utils/detail'
import { RaceData, Constructor } from '@/utils/types'

async function fetcher<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  return fetch(input, init).then((res) => res.json())
}

const cloudflareUrl = 'https://f1-championship-stats.ayrton.workers.dev/data.json'
// const fastlyUrl = 'https://f1-planetscale.edgecompute.app/data.json'
const netlifyUrl = 'https://f1-championship-stats-workers.netlify.app/data.json'
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
            label: constructorName(key),
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
        name: constructorName(key),
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
        <meta name='robots' content='noindex' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <header className='container mx-auto items-end justify-between space-y-2 px-3 pb-4 pt-4 md:flex md:px-6 md:pb-2 md:pt-8'>
        <h1 className='text-xl'>
          <span className='block font-brand font-semibold leading-none'>
            2024 <span className='text-[#e20500]'>Formula 1</span>
          </span>
          <span className='font-medium'>Constructor championship standings</span>
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
            className='w-20 flex-1 border-none bg-primary py-0 pl-2 pr-4 text-xs !shadow-none !ring-0 focus:border-blue-500 focus:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-200 focus:ring-offset-0 focus:!transition-none dark:focus:ring-blue-800'
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
            <div className='dark right-3 top-1/2 z-1 mb-3 space-y-1 rounded bg-secondary p-1 font-bold text-primary shadow-lg shadow-black/25 lg:absolute lg:w-32 lg:-translate-y-1/2 lg:p-1.5 xl:right-12 xl:w-38 dark:shadow-black/90 dark:ring-1 dark:ring-white/10'>
              {standings.map((standing, i) => (
                <StandingsItem key={i} standing={standing} />
              ))}
            </div>

            <div className='grid grid-cols-25 whitespace-nowrap pb-2 pt-1 text-2xs lg:pb-0'>
              {raceDates.map((date, i) => (
                <button
                  key={i}
                  disabled={i > lastIndex}
                  onClick={() => {
                    setSelectedRound(i)
                  }}
                  className={cn(
                    'relative flex origin-left translate-x-px -rotate-45 items-center justify-center rounded px-2.5 py-sm lg:left-[18px] lg:h-4.5 lg:w-4.5 lg:rotate-0 lg:px-0 lg:text-center lg:ring-1 lg:ring-black/[.08] xl:left-[26px] 2xl:left-[36px] lg:dark:ring-white/15',
                    {
                      'z-1 bg-gray-850 text-gray-50 lg:border-transparent dark:bg-gray-50 dark:text-gray-900':
                        i === selectedRound,
                      'bg-white dark:bg-gray-850': i !== selectedRound,
                      'text-gray-500': i > lastIndex
                    }
                  )}
                >
                  <div
                    className={cn('flex space-x-xs lg:block lg:translate-y-xs', {
                      'lg:text-gray-50 lg:dark:text-gray-900': i === selectedRound
                    })}
                  >
                    <div className='text-3xs font-bold leading-none'>{date.month}</div>
                    <div className='text-3xs font-bold leading-none lg:text-sm lg:font-normal'>{date.day}</div>
                  </div>
                </button>
              ))}
              <div></div>
            </div>

            <div className='grid grid-cols-25 grid-rows-[7]'>
              <div className='col-start-2 col-end-[26] row-start-1 row-end-2'>
                <div className='grid h-full grid-cols-24'>
                  {[...Array(24)].map((_, i) => (
                    <div
                      key={i}
                      className={cn('border-b border-r border-dashed', {
                        'border-l border-l-gray-100 dark:border-l-gray-850': i === 0 && selectedRound !== 0,
                        'border-l border-l-gray-400 dark:border-l-gray-500': i === 0 && selectedRound === 0,
                        'border-r-gray-400 dark:border-r-gray-500': i % 24 === selectedRound - 1,
                        'border-r-gray-100 dark:border-r-gray-850': i % 24 !== selectedRound - 1,
                        '!border-b-0 !border-r-0': (i + 1) % 24 === 0
                      })}
                    ></div>
                  ))}
                </div>
              </div>

              <div className='z-10 col-start-2 col-end-[25] row-span-full row-end-8 -mx-[6px] -mb-[6px]'>
                <LineChart chartData={chartData} key={lineChartMemoizeKey} />
              </div>
            </div>

            <div className='grid grid-cols-25 justify-items-end whitespace-nowrap pb-6 pt-1 text-2xs text-gray-600'>
              {raceNames.map((name, i) => (
                <div
                  key={i}
                  className={cn('origin-top-right -translate-x-px -rotate-45 px-[6px] py-xs', {
                    'dark: z-1 rounded bg-gray-850 font-bold text-gray-50 lg:border-transparent dark:bg-gray-50 dark:text-gray-900':
                      i === selectedRound
                  })}
                >
                  {name}
                </div>
              ))}
              <div> </div>
            </div>
          </main>

          <section className='container mx-auto px-3 pb-6 pt-2 md:px-6'>
            <div className='space-y-1 rounded border bg-secondary p-3'>
              <h3 className='font-semibold'>How this works</h3>
              <p>
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
