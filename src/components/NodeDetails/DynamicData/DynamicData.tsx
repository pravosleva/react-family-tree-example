import { useEffect, useState, useMemo } from 'react'
import css from './DynamicData.module.css'
import cn from 'classnames';
import { ResponsiveBlock } from '~/components/ResponsiveBlock'
import { vi } from '~/utils/vi';
import { subscribeKey } from 'valtio/utils';
import { TPersonInfo } from '~/types'
import SimpleReactLightbox, { SRLWrapper } from 'simple-react-lightbox'
import { LazyImage } from '~/components/LazyImage'

type TProps = {
  id: string;
}
type TImageLightboxFormat = { src: string, alt?: string }

export const DynamicData = ({ id }: TProps) => {
  const [personInfo, setPersonInfo] = useState<TPersonInfo | null>(vi.common.personsInfo[id] || null)
  useEffect(() => {
    // NOTE: See also https://valtio.pmnd.rs/docs/api/utils/subscribeKey
    // Subscribe to all changes to the state proxy (and its child proxies)
    const unsubscribe = subscribeKey(vi.common.personsInfo, id, (val) => {
      setPersonInfo(val)
    })
    return () => {
      // Unsubscribe by calling the result
      unsubscribe()
    }
  }, [setPersonInfo, id])
  // const isErrored = useMemo(() => !!personInfo && !personInfo.ok, [personInfo])
  const galleryItems = useMemo<TImageLightboxFormat[]>(() => personInfo?.data?.googleSheets?.mainGallery
    ? personInfo?.data?.googleSheets?.mainGallery.map(({ url, descr }) => ({ src: url, alt: descr }))
    : [], [personInfo?.data?.googleSheets?.mainGallery])

  return (
    <>
      {
        galleryItems.length > 0 && (
          <ResponsiveBlock isPaddedAnyway>
            <SimpleReactLightbox>
              <div className={cn(css.srLWrapperLayout, css.bigFirst)}>
                <SRLWrapper
                  options={{
                    settings: {
                      // overlayColor: "rgb(25, 136, 124)",
                      // overlayColor: 'rgba(0, 0, 0, 0.75)',
                    },
                    caption: {
                      captionAlignment: 'start',
                      captionColor: '#FFFFFF',
                      captionContainerPadding: '20px 0 30px 0',
                      captionFontFamily: 'inherit',
                      captionFontSize: 'inherit',
                      captionFontStyle: 'inherit',
                      captionFontWeight: 'inherit',
                      captionTextTransform: 'inherit',
                      showCaption: true
                    },
                    buttons: {
                      showDownloadButton: false,
                      showAutoplayButton: false,
                      // backgroundColor: 'rgba(30,30,36,0.8)',
                      // backgroundColor: 'rgb(25, 136, 124)',
                      // backgroundColor: '#22577a',
                      // backgroundColor: '#f44336',
                      backgroundColor: 'var(--chakra-colors-red-500)',
                      iconColor: 'rgba(255, 255, 255, 1)',
                      iconPadding: '10px',
                    },
                    thumbnails: {
                      showThumbnails: true,
                      thumbnailsAlignment: 'center',
                      thumbnailsContainerBackgroundColor: 'transparent',
                      thumbnailsContainerPadding: '0',
                      thumbnailsGap: '0 1px',
                      thumbnailsIconColor: '#ffffff',
                      thumbnailsOpacity: 0.4,
                      thumbnailsPosition: 'bottom',
                      thumbnailsSize: ['100px', '80px']
                    },
                    progressBar:{
                      backgroundColor: '#f2f2f2',
                      fillColor: '#000000',
                      height: '3px',
                      showProgressBar: true,
                    },
                    // translations: {}, // PRO ONLY
                    // icons: {} // PRO ONLY
                  }}
                >
                  {
                    galleryItems.map(({ src, alt }: TImageLightboxFormat, i) => {
                      // const { large, medium, thumbnail, small } = photoData
                      // const src = !!large ? `${apiUrl}${large.url}` : medium ? `${apiUrl}${medium.url}` : !!small ? `${apiUrl}${small.url}` : `${apiUrl}${thumbnail.url}`
                      // const thumbnailSrc = !!thumbnail ? `${apiUrl}${thumbnail.url}` : src
                      // const isActive = src === defaultSrc 

                      return (
                        <div
                          className={cn(css.gridItem)}
                          key={`${src}_${i}`}
                        >
                          <a
                            href={src}
                            target='_blank'
                            rel='noreferrer'
                            // className={clsx({ 'active': isActive })}
                          >
                            {/* <img src={src} alt={alt} /> */}
                            <LazyImage src={src} alt={alt} />
                            {/* <Img
                              // @ts-ignore
                              // ref={isActive ? activeItemRef : undefined}
                              src={src}
                              alt={alt || ''}
                              loading='lazy'
                              fallback={<Loader />}
                              // @ts-ignore
                              // containerRef={containerRef}
                              // sources={[
                              //   { source: 'portrait.jpg', media: '(orientation: portrait)' },
                              //   { source: 'landscape.jpg', media: '(orientation: landscape)' },
                              // ]}
                            /> */}
                          </a>
                        </div>
                      )
                    })
                  }
                </SRLWrapper>
              </div>
            </SimpleReactLightbox>
          </ResponsiveBlock>
        )
      }
      <ResponsiveBlock
        className={cn(
          css.wrapper,
        )}
        isPaddedAnyway
      >
        <pre>{JSON.stringify(personInfo, null, 2)}</pre>
      </ResponsiveBlock>
    </>
  )
}
