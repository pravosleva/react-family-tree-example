import cn from 'classnames'
import css from './Progressbar.module.css'

type TProps = {
  value: number;
}

export const Progressbar = ({
  value,
}: TProps) => {
  return (
    <div className={cn(css.circle)}>
      <div
        className={cn(css.inner)}
        style={{
          backgroundImage: `conic-gradient(var(--color-success-msg-bg) ${value <= 100 ? value : 100}%, var(--color-info-msg-text) 0)`,
        }}
      >
        {value <= 100 ? value : 100}%
      </div>
    </div>
  )
}
