

import Logo from './assets/logo.svg'
import background from 'shared/assets/bg-blocks.png'
import { Button } from "shared/ui/button"
import { Typography } from "shared/ui/typography"
import { Link } from "atomic-router-react"
import { routes } from "shared/config/router"
import { Icon } from 'shared/ui/icon'
import { socLinks } from 'shared/constants'
import clsx from 'clsx'

const textClass = '!font-inter !text-gray-gradient !leading-[100%]'

const SocLinks = ({className}: {className:string}) => (
    <div className={clsx('gap-[12px] items-center', className)}>
        {Object.entries(socLinks).map(([key, link]) => (
            <Link key={key} to={link} className='rounded-full bg-darkGray-1 flex items-center justify-center min-w-[43.36px] min-h-[43.36px] lg:min-w-[36px] lg:min-h-[36px]' >
                <Icon 
                    name={key as 'twitter' | 'telegram'}
                    className='w-[18px] h-[18px] lg:w-[15px] lg:h-[15px]'
                />
            </Link>
        ))}
    </div>
)

interface NotFoundPageProps {
    isSoon?: boolean
}

export const NotFoundTemplate = ({isSoon}: NotFoundPageProps) => {
    return(
        <div className="relative h-full w-full flex items-center justify-center">
            <div className="scale-[0.9] relative z-1 flex items-center lg:items-start flex-col lg:flex-row gap-[38.6px] lg:gap-[0px]">
                <div className="flex flex-col gap-[0] lg:gap-[69px] items-center lg:items-start order-2 lg:order-1">
                    <Logo 
                        className='w-[189px] h-[144px] lg:w-[391px] lg:h-[297px] ml-[54px] lg:ml-0 lg:mt-[18px]'
                    />

                    <Button
                        as={Link}
                        to={routes.memepad}
                        className={{
                            button: 'max-w-[152.22px] h-[41.32px] lg:max-w-[133px] lg:h-[36px] lg:ml-[82px] mt-[60px] lg:mt-0'
                        }}
                    >
                        Go to platform
                    </Button>

                    <SocLinks className='flex lg:hidden mt-[35px]' />
                </div>

                <div className="flex flex-col items-center order-1 lg:order-2">
                    <Typography 
                        weight='semibold' 
                        className={clsx('!text-[36.86px] lg:!text-[64px] !tracking-[12.09px] lg:!tracking-[21px]', textClass)}
                    >
                        SORRY
                    </Typography>
                    <Typography 
                        weight='semibold'
                        className={clsx('!text-[127.85px] lg:!text-[222px] !tracking-[0px]', textClass)}
                    >
                        {isSoon ? '405' : '404'}
                    </Typography>
                    <Typography 
                        weight='semibold' 
                        className={clsx('!text-[27.64px] lg:!text-[48px] !tracking-[1.73px] lg:!tracking-[3px]', textClass)}
                    >
                        {isSoon ? 'SOON' : 'PAGE NOT FOUND'}
                    </Typography>

                    <SocLinks className='hidden lg:flex mt-[50px]' />
                </div>
            </div>

            <div
                className='absolute w-full h-full inset-0'
                style={{
                    background: `url(${background})`
                }}
            />
        </div>
    )
}
