type Props = {
  position: number
  teamName: string
  totalPoints: number
}

const StandingsItem: React.FC<Props> = ({ position, teamName, totalPoints }) => {
  return (
    <div className='flex items-center justify-between'>
      <div className='flex items-center space-x-1'>
        <div className='flex h-2.5 w-2.5 items-center justify-center rounded-xs bg-white text-xs text-gray-900'>
          {position}
        </div>
        <div className='h-2 w-xs translate-x-px rounded bg-gray-700' />
        <div className='text-sm tracking-tighter'>{teamName}</div>
      </div>

      <div className='text-sm font-normal'>{totalPoints} pts</div>
    </div>
  )
}

export default StandingsItem
