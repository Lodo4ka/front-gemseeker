
import { $favourites } from "../model"
import { Typography } from "shared/ui/typography"
import { useUnit } from "effector-react"
import { $rate } from "features/exchange-rate"
import { formatter } from "shared/lib/formatter"
import clsx from "clsx"
import { Link } from "atomic-router-react"
import { routes } from "shared/config/router"

export const Favourites = () => {
    const [favourites, rate] = useUnit([$favourites, $rate]);

    if((favourites?.length ?? 0) === 0) return null;

    return(
        <div 
            className="border-separator lg:ml-[70px] bg-bg fixed top-15 lg:top-16 right-0 left-0 z-[11] flex h-[44px] items-center gap-1 border-b px-[20px] [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            <Typography
                color='secondary'
                icon={{
                    name: 'favourite_true',
                    size: 20,
                    position: 'left'
                }}
            >
                Watching
            </Typography>

            <div className="h-full flex items-center ml-[16px] w-full overflow-auto">
                {favourites?.map((token, idx, favourites) => (
                    <Typography
                        as={Link}
                        to={routes.token}
                        params={{address: token.address}}
                        key={token.address}
                        className={clsx("gap-[16px]", {
                            'ml-[16px]': idx !== 0
                        })}
                    >
                        <Typography className="gap-[8px]" >
                            <Typography>
                                {token.symbol}
                            </Typography>  

                            <Typography color='secondary'>
                                ${formatter.number.formatSmallNumber(token.rate * rate)}
                            </Typography>  

                            <Typography color='secondary'>
                                ${formatter.number.formatSmallNumber(token.mcap * rate)}
                            </Typography>  

                            <Typography color={token.mcap_diff_24h >= 0 ? 'green' : 'red'}>
                                %{formatter.number.formatSmallNumber(token?.mcap_diff_24h ?? 0)}
                            </Typography>  
                        </Typography>
                        {favourites.length - 1 !== idx  &&
                            <div className="h-[17px] w-[1px] bg-separator" />
                        }
                    </Typography>
                ))}
            </div>
        </div>
    )
}