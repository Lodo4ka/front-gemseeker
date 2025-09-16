import { useUnit } from "effector-react";
import { trackMediaQuery } from "@withease/web-api";

import BannerMobile from '../../assets/BannerMobile.png'
import BannerDesktop from '../../assets/BannerDesktop.png'
import { appStarted } from "shared/config/init";
import { ReactNode } from "react";
import clsx from "clsx";

export const { desktop } = trackMediaQuery( 
  { desktop: '(min-width: 768px)' }, 
  { setup: appStarted }
);

interface GuideTemplateProps {
    title: ReactNode,
    content: ReactNode,
    closeGuide: () => void,
    isGuideOpen: boolean,
    className?: string
}

export const GuideTemplate = ({
    title,
    content,
    closeGuide,
    isGuideOpen,
    className
}: GuideTemplateProps) => {
    const isDesktop = useUnit(desktop.$matches)
    const backgrounds = {
        mobile: BannerMobile,
        desktop: BannerDesktop
    }

    if (!isGuideOpen) return null;

    return(
        <div className={clsx("min-w-[0px] flex-[0_0_100%]", className)}>
            <div 
                className='relative p-4 aspect-[323/160] h-[160px] w-full rounded-xl bg-cover bg-center md:aspect-[1330/220] md:h-auto'
                style={{ backgroundImage: `url(${isDesktop ? backgrounds.desktop : backgrounds.mobile})` }}
            >
                <button onClick={closeGuide} className="absolute top-4 right-4 h-5 w-5">
                    <div className="bg-secondary absolute top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 rounded-xl" />
                    <div className="bg-secondary absolute top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 rounded-xl" />
                </button>

                <div className="flex h-full items-center justify-center">
                    <div className="flex flex-col items-center gap-3 md:gap-3 lg:gap-6">
                        <div className="flex flex-col items-center">
                            {title}
                        </div>

                        <div className="flex w-full justify-center gap-2">
                            {content}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}