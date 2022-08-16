import { constructorColor } from '../pages/index'

type Standing = {
  position: number
  name: string
  points: number
  teamId: string
}

type Props = {
  standing: Standing
}

const StandingsItem: React.FC<Props> = ({ standing }) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-1'>
        <div className='flex h-3 w-3 items-center justify-center rounded-xs bg-white text-xs font-bold tracking-[-1px] text-gray-900'>
          {standing.position}
        </div>
        <div style={{ background: constructorColor[standing.teamId] }} className='h-2 w-xs translate-x-px rounded' />
        <div className='text-sm tracking-tighter'>{standing.name}</div>
      </div>

      <div className='text-sm font-normal'>{standing.points} pts</div>
    </div>
  )
}

export default StandingsItem
