import { useUnit } from "effector-react"
import { $token } from "entities/token"
import { Typography } from "shared/ui/typography"

export const MigrateLoading = () => {
    const token = useUnit($token);

    if(token && (!token?.trade_started && !token?.trade_finished)) return(
        <div className="absolute w-full h-full inset flex justify-center items-center rounded-xl z-10">
            <div className="absolute w-full h-full inset bg-[rgba(17,20,27,0.8)] blur-md z-1" />

            <div className="relative z-2 w-full flex flex-col justify-center items-center">
                <Typography size='subheadline2' color='primary' weight="bold" className="text-center">
                    Gemseeker is migrating...
                </Typography>
                <Typography color='secondary' size='captain1' className="text-center mt-[8px]">
                    Bonding curve has reached 100% and the<br /> token LP is currently being migrated to<br /> Raydium (may take up to 30 min).
                </Typography>

                <div className="h-[1px] w-full max-w-[243px] bg-[rgba(40,48,62,1) mt-[16px]" />

                <Typography size='headline4' weight='medium' className="text-center mt-[16px]">
                    Trade token on these platforms 
                </Typography>
            </div>
        </div>
    )

    return null
}