/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState, useCallback, useLayoutEffect } from 'react'
import { useSnapshot } from 'valtio/react'
import { vi } from '~/utils/vi'
import classes from './FixedBirthdayList.module.css'
import cn from 'clsx'
import { ResponsiveBlock } from '~/components/ResponsiveBlock'
// import { useQueryParam, NumberParam } from 'use-query-params'
// import mainCss from '~/components/App/App.module.css'
import { getFullName, getBirtgdayDate } from '~/utils/person-ops'
import Countdown, { zeroPad } from 'react-countdown'
import { getNormalizedDate, getTimeDiff, getTimeAgo } from '~/utils/time-ops'
import { sort } from '~/utils/array-ops'
import { MdKeyboardArrowUp, MdKeyboardArrowDown } from 'react-icons/md'

const limitRangeInDays = 30
const refreshBirthdayListInMinutes = 1

const CountdownRenderer = ({ props, days, hours, minutes, seconds, completed, total, ...rest }: any) => {
  // console.log(Object.keys(props))
  if (completed) return (
    <span className={cn(classes.tag, classes.coloredTagSuccess)}>{getTimeAgo(props.date)}</span>
  )
  const getColorByDays = ({ isCompleted, days }: {
    isCompleted: boolean;
    days: number;
  }) => {
    switch (true) {
      case isCompleted:
        return 'coloredTagSuccess'
      case days <= 3:
        return 'coloredTagDanger'
      case days <= 7:
        return 'coloredTagWarning'
      default:
        return 'coloredTagDefault'
    }
  }
  const targetClassName = getColorByDays({ isCompleted: completed, days })

  return (
    <span className={cn(classes.tag, classes[targetClassName])}>
      {days ? `${days} d ` : ''}{zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
    </span>
  )
}

type TPersonsUiItem = {
  id: string;
  birthday: {
    original: string;
    date: Date | null;
    ts: number | null;
    currentYearDate: Date | null;
    left: {
      isNegative: boolean;
    };
  };
  birthdayDateInCurrentYear: Date | null;
  fullName: string;
}

export const FixedBirthdayList = ({ activeRootId, onClick, selectedId }: {
  activeRootId: string;
  selectedId?: string;
  onClick: (id: string) => void;
}) => {
  // -- NOTE: Refresh list each {refreshBirthdayListInMinutes} mins
  const [refreshListTick, setRefreshListTick] = useState<number>(0)
  useLayoutEffect(() => {
    const timer = setInterval(() => {
      if (window?.document?.hidden) return
      setRefreshListTick((s) => s + 1)
    }, refreshBirthdayListInMinutes * 60 * 1000)
    return () => clearInterval(timer)
  }, [])
  // --

  const personsInfo = useSnapshot(vi.common.personsInfo)
  const birthdays = useMemo<{
    id: string;
    birthday: {
      original: string;
      date: Date | null;
      ts: number | null;
      currentYearDate: Date | null;
      left: {
        isNegative: boolean;
      };
    };
    birthdayDateInCurrentYear: Date | null;
    fullName: string;
  }[]>(() => {
    const res: TPersonsUiItem[] = []
    const regex = /(?<=\[)\d{1,2}-\d{2}-\d{4}(?=\])/g
    // const regex2 = /(]\[)/g

    for (const id in personsInfo) {
      const found = id.match(regex)
      // const twoDates = id.match(regex2)

      // if (!!found && !!found[0] && !twoDates) {
      if (!!found && !!found[0]) {
        // timeLimit?
        // const inTimeLimitRange = 
        // @ts-ignore
        const birthdayDate = getBirtgdayDate({ personData: personsInfo[id] })
        
        if (birthdayDate.inCurrentYear) {
          const timeDiff = getTimeDiff({
            startDate: birthdayDate.inCurrentYear,
            finishDate: new Date(),
          })
          const inTimeLimitRange = timeDiff.d <= limitRangeInDays
          if (inTimeLimitRange) {
            res.push({
              id,
              birthday: {
                original: found[0],
                date: birthdayDate.value,
                ts: birthdayDate.value?.getTime() || null,
                currentYearDate: birthdayDate.inCurrentYear,
                left: {
                  isNegative: timeDiff.isNegative,
                },
              },
              birthdayDateInCurrentYear: birthdayDate.inCurrentYear,
              // @ts-ignore
              fullName: getFullName(personsInfo[id]),
            })
          }
        }
      }
    }

    // return res
    return sort(res, ['birthdayDateInCurrentYear'], 1)
  }, [personsInfo, refreshListTick])
  // const [debugModeParam] = useQueryParam('debug', NumberParam)
  // const isDebugModeEnabled = useMemo<boolean>(() => debugModeParam === 1, [debugModeParam])

  const [isOpened, setIsOpened] = useState<boolean>(false)
  const handleToggle = useCallback(() => setIsOpened((s) => !s), [setIsOpened])

  if (birthdays.length === 0) return null

  return (
    <section
      style={{
        // position: 'fixed',
        // bottom: '10px',
        // right: '10px',
        display: 'flex',
        flexDirection: 'column',
      }}
      className={cn(
        // mainCss.details,
        classes.root,
        'backdrop-blur--lite',
        classes.absolute,
        // {
        //   [mainCss.offsetTopForHeader]: isDebugModeEnabled,
        //   [mainCss.offsetTopForHeaderLimitedHeight]: isDebugModeEnabled,
        // },
        'fade-in',
      )}
    >
      <ResponsiveBlock
        // isPaddedAnyway
        className={cn(classes.stickyHeader)}
        // style={{
        //   position: 'sticky',
        //   top: 0,
        //   boxShadow: 'rgba(34, 60, 80, 0.2) 0px 10px 7px -8px',
        // }}
      >
        <header className={classes.header}>
          <h3 className={classes.title}>⭐ День Рождения в перспективе {limitRangeInDays} дней ({birthdays.length})</h3>
          <button className={classes.toggler} onClick={handleToggle}>{isOpened ? <MdKeyboardArrowDown /> : <MdKeyboardArrowUp />}</button>
        </header>
      </ResponsiveBlock>
      {
        isOpened && (
          <ResponsiveBlock
            // isPaddedAnyway
            className={cn(classes.personsList)}
          >
            {
              birthdays.map(({ id, birthday, fullName }) => {
                const yearsBetweenBirthAndNow = !!birthday.date && !!birthday.currentYearDate
                  ? getTimeDiff({
                    startDate: birthday.date,
                    finishDate: birthday.currentYearDate,
                  })
                  : null
                const isNegativeFromNow = !!birthday.currentYearDate
                  ? getTimeDiff({
                    startDate: new Date(),
                    finishDate: birthday.currentYearDate,
                  }).isNegative
                  : null
                const congratsSymbol = !!yearsBetweenBirthAndNow
                  ? isNegativeFromNow
                    ? `🎉`
                    : ''
                  : ''
                const yearsBetweenDescr = !!yearsBetweenBirthAndNow
                  ? isNegativeFromNow
                    ? `(${yearsBetweenBirthAndNow.y})`
                    : `(will be ${yearsBetweenBirthAndNow.y})`
                  : ''
                return (
                  <div
                    key={id}
                    className={cn(
                      classes.personNewsItem,
                      {
                        [classes.activePerson]: activeRootId === id,
                      },
                    )}
                    style={{
                      // display: 'flex',
                      // alignItems: 'center',
                      // flexWrap: 'wrap',
                      // gap: '8px',
                      // color: activeRootId === id ? 'var(--color-info-msg-text)' : 'inherit',
                      display: 'grid',
                      gridTemplateColumns: 'minmax(120px, auto) auto 1fr',
                      gridTemplateRows: 'auto',
                      columnGap: '8px',
                      rowGap: '8px',
                      padding: '8px',
                      cursor: 'pointer',
                    }}
                    onClick={(_e: any) => onClick(id)}
                  >
                    <div
                      style={{
                        fontWeight: selectedId === id
                          ? 'bold'
                          : 'inherit',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <em style={{ display: 'flex', flexDirection: 'row', gap: '8px', flexWrap: 'wrap' }}>{!!congratsSymbol && <span>{congratsSymbol}</span>}<span>{fullName}</span><span style={{ opacity: 0.5 }}>{!!yearsBetweenDescr && ` ${yearsBetweenDescr}`}</span></em>
                      {
                        !!birthday.currentYearDate && (
                          <div
                            style={{
                              display: 'flex',
                              gap: '8px',
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                            }}
                          >
                            <Countdown
                              date={birthday.currentYearDate}
                              renderer={CountdownRenderer}
                            />
                            {!!birthday.date && (
                              <span>
                                {getNormalizedDate(birthday.date.getTime())}
                              </span>
                            )}
                              <span>{`->`}</span>
                              <span>
                                {getNormalizedDate(new Date(birthday.currentYearDate).getTime())}
                              </span>
                          </div>
                        )
                      }
                    </div>
                  </div>
                )
              })
            }
          </ResponsiveBlock>
        )
      }
    </section>
  )
}
