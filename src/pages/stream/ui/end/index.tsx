import background from 'shared/assets/bg-blocks.png'
import Logo from './assets/logo.svg'
import { Typography } from 'shared/ui/typography'
import clsx from 'clsx'
import { Button } from 'shared/ui/button'
import { ImageHover } from 'shared/ui/image'
import { Link } from 'atomic-router-react'
import { routes } from 'shared/config/router'
import { useUnit } from 'effector-react'
import { $streamInfo } from 'entities/stream'
import { getFullUrlImg } from 'shared/lib/full-url-img'
import { subscribeInStream } from '../../model/follow'

const Profile = ({className}: {className:string}) => {
    const streamInfo = useUnit($streamInfo);
    const countSubscribers = useUnit(subscribeInStream.$countSubscribers);
    const [isFollow, clickFollow] = useUnit([subscribeInStream.$isFollow, subscribeInStream.clickedFollow]);

    return (
        <div className={clsx('rounded-[14px] sm:w-[394px] sm:h-[61px] items-center flex-col sm:flex-row bg-gray-profile pl-[21px] pr-[14px] py-[7px]', className)}>
            <Link to={routes.profile} params={{id: (streamInfo?.creator.user_id ?? 0).toString()}} className='flex h-full items-center'>
                <div className='h-[46px] w-[46px] rounded-full'>
                    <ImageHover 
                        preview={getFullUrlImg(streamInfo?.creator.user_photo_hash ?? '', streamInfo?.creator.user_nickname ?? '')}
                        className='w-full h-full rounded-full'
                    />
                </div>

                <div className='h-full flex gap-[4px] justify-center ml-[10px]'>
                    <Typography className='max-w-[200px] truncate'>{streamInfo?.creator.user_nickname}</Typography>
                    <Typography 
                        color='secondary'
                        className='!gap-[4px]'
                        icon={{name: 'dot', position: 'left', size: 3}}
                    >{countSubscribers}</Typography>
                </div>
            </Link>

            <Button
                onClick={clickFollow}
                theme={isFollow ? 'quaternary' : 'primary'}
                className={{
                    button: clsx('sm:ml-auto mt-[10px] sm:mt-0 w-[123px] h-[36px]')
                }}
            >
                {isFollow ? 'Unfollow' : 'Follow'}
            </Button>
        </div>
    )
}

const textClass = '!font-inter !text-gray-gradient !leading-[100%]'

export const StreamTheEnd = () => {

    return(
        <div className="relative h-full w-full flex items-center justify-center">
            <div className="scale-[0.9] lg:h-[402px] relative z-1 flex flex-col lg:flex-row items-center lg:gap-[57px]">
                <div className='h-full flex flex-col items-center lg:items-start order-2 lg:order-1'>
                    <Logo 
                        className='mt-[38.6px] lg:mt-0 w-[189px] h-[144px] lg:w-[391px] lg:h-[297px]'
                    /> 
                    <Button 
                        as={Link}
                        to={routes.memepad}
                        className={{button: 'lg:max-w-[133px] lg:h-[36px] mt-[60px] lg:mt-[69px] lg:ml-[88px]'}}
                    >
                        Go to platform
                    </Button>

                    <Profile className='mt-[35px] flex lg:hidden' />
                </div>

                <div className="h-full flex flex-col items-center lg:gap-[25px] order-1 lg:order-2">
                    <Typography 
                        weight='semibold' 
                        className={clsx('lg:mt-[77px] !text-[36.86px] lg:!text-[64px] !tracking-[12.09px] lg:!tracking-[21px] text-center', textClass)}
                    >
                        SORRY
                    </Typography>
                    
                    <Typography 
                        weight='semibold' 
                        className={clsx('!text-[27.64px] lg:!text-[40px] !tracking-[1.73px] lg:!tracking-[3px] text-center', textClass)}
                    >
                        THE STREAM'S
                        <br/> OVER
                    </Typography>

                    <Profile className='hidden lg:flex mt-auto' />
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