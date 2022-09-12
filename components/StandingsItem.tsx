import { constructorColor } from '@/utils/detail'
import { Standing } from '@/utils/types'

type Props = {
  standing: Standing
}

const StandingsItem: React.FC<Props> = ({ standing }) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-1'>
        <div className='flex h-2.5 w-2.5 items-center justify-center rounded-xs bg-gray-50 text-[10px] font-bold tracking-[-1px] text-gray-900'>
          {standing.position}
        </div>
        <div style={{ background: constructorColor(standing.teamId) }} className='h-2 w-xs translate-x-px rounded' />
        <div className='text-sm tracking-tighter'>{standing.name}</div>
      </div>

      <div className='text-sm font-normal'>{standing.points} pts</div>
    </div>
  )
}

export default StandingsItem
