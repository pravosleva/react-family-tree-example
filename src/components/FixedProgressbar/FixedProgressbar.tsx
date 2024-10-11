import { useSnapshot } from 'valtio/react'
import { Progressbar } from './Progressbar'
import { vi } from '~/utils/vi'

export const FixedProgressbar = () => {
  const snap = useSnapshot(vi.common)
  const loadPercentage = Math.ceil((snap.counters.load.processed / snap.counters.total) * 100)

  if (loadPercentage >= 100) return null

  return (
    <div
      style={{
        position: 'fixed',
        // top: 'calc(48px + 10px)',
        top: '50%',
        left: '50%',
        transform: 'translateX(-50%) translateY(-50%)',
        zIndex: 1000,
      }}
      className='fade-in'
    >
      <Progressbar value={loadPercentage} />
    </div>
  )
}
