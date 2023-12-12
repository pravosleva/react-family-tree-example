/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react'
import clsx from 'classnames'
import css from './ResponsiveBlock.module.css'

type TProps = {
  isLimited?: boolean;
  isPaddedMobile?: boolean;
  style?: React.CSSProperties;
  className?: string;
  hasDesktopFrame?: boolean;
  children: React.ReactNode;
  // zeroPaddingMobile?: boolean;
  isLimitedForDesktop?: boolean;
  // isLastSection?: boolean;
  // hasRedBorder?: boolean;
  isPaddedAnyway?: boolean;
}

export const ResponsiveBlock: React.FC<any> = ({
  // zeroPaddingMobile,
  children,
  // isLimited,
  isPaddedMobile,
  style,
  className,
  // hasDesktopFrame,
  isLimitedForDesktop,
  // isLastSection,
  // hasRedBorder,
  isPaddedAnyway,
}: TProps) => {
  switch (true) {
    case isLimitedForDesktop:
      return (
        <div
          className={clsx(
            css.base,
            // classes.isLimitedForDesktop,
            // classes.limitedWidth,
            // classes.centered,
            {
              [css.isPaddedMobile]: isPaddedMobile,
              // [css.redBorder]: hasRedBorder,
            },
            className,
          )}
          style={style || {}}
        >
          {children}
        </div>
      )
    // case isLimited && !isPaddedMobile && !hasDesktopFrame:
    // case isLimited && !isPaddedMobile:
    //   return (
    //     <div
    //       className={clsx(
    //         classes.base,
    //         // { [classes.isLastSection]: isLastSection },
    //         classes.limitedWidth,
    //         classes.centered,
    //       )}
    //     >
    //       {children}
    //     </div>
    //   )
    default:
      return (
        <div
          className={clsx(
            css.base,
            {
              // [css.redBorder]: hasRedBorder,
              [css.isPadded]: isPaddedAnyway,
            },
            className,
          )}
          style={style || {}}
        >
          {children}
        </div>
      )
  }
}
