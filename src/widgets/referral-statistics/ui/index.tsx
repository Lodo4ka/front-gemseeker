import { useUnit } from "effector-react"
import { referList } from "../config"
import { Typography } from "shared/ui/typography"
import { $referral, $referralStatus, referraloadded } from "../model"
import { LoadedData } from "shared/ui/loaded-data"
import { Skeleton } from "shared/ui/skeleton"
import { formatter } from "shared/lib/formatter"

interface ReferralStatisticsProps {
    isFallback?:boolean
}

export const ReferralStatistics = ({
isFallback
}: ReferralStatisticsProps) => {
    const [referral, referralStatus] = useUnit([$referral, $referralStatus]);
    const isLoading = (isFallback || referralStatus === 'pending') || !referral

    if(isLoading) return <ReferralStatisticsFallback isFallback={isFallback} />

    return(
        <div className="grid w-full grid-cols-4 grid-rows-1 gap-[10px] max-sm:grid-cols-2 max-sm:grid-rows-2">
            {referral && referList.map(({ title, key }) => (
                <div
                    key={title}
                    className="bg-darkGray-3 max-md:bg-darkGray-1 flex w-full flex-col rounded-xl p-4 max-md:p-3"
                >
                    <Typography className="max-md:text-[12px]" weight="regular" size="subheadline2" color="secondary">
                        {title}
                    </Typography>

                    <div className="bg-separator mt-4 mb-3 h-[0.5px] w-full max-md:mt-3" />

                    <Typography className="max-md:text-[18px]" weight="regular" size="headline2">
                        {formatter.number.uiDefault(referral[key])}
                    </Typography>
                </div>
            ))}
        </div>
    )
}

const ReferralStatisticsFallback = ({isFallback}: ReferralStatisticsProps) => {
    return (
        <div className="grid w-full grid-cols-4 grid-rows-1 gap-[10px] max-sm:grid-cols-2 max-sm:grid-rows-2">
            {!isFallback && <LoadedData loadedData={referraloadded} />}
            {referList.map(({ title }) => (
                <div
                    key={title}
                    className="bg-darkGray-3 max-md:bg-darkGray-1 flex w-full flex-col rounded-xl p-4 max-md:p-3"
                >
                    <Skeleton isLoading className="h-5 w-24 max-md:h-4 max-md:w-20" />
                    <div className="bg-separator mt-4 mb-3 h-[0.5px] w-full max-md:mt-3" />
                    <Skeleton isLoading className="h-8 w-16 max-md:h-6 max-md:w-14" />
                </div>
            ))}
        </div>
    )
}