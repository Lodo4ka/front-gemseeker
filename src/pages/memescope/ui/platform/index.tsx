import { useUnit } from "effector-react"
import { Typography } from "shared/ui/typography"

import {$platform, changedPlatform, platformVariant} from '../../model'

export const Platform = () => {
    const [activePlatform, changePlatform] = useUnit([$platform, changedPlatform]);

    const isActive = (platform: platformVariant) => activePlatform === platform;
    const handleChange = (platform: platformVariant) => () => changePlatform(platform);

    return(
      <div className='flex gap-[12px] mt-[16px]'>
        <Typography
            onClick={handleChange('Gemseeker')}
            className="cursor-pointer"
            size="headline4"
            color={isActive('Gemseeker') ? 'primary' : "secondary"}
            icon={{ 
                name: isActive('Gemseeker') ? 'gemseeker_gold' : 'gemseeker_not_active', 
                position: 'left', 
                size: 20 
            }}
        >
          Gemseeker
        </Typography>

        <Typography
            onClick={handleChange('Pump')}
            className="cursor-pointer"
            size="headline4"
            color={isActive('Pump') ? 'primary' : "secondary"}
            icon={{ 
                name: isActive('Pump') ? 'pump_green' : 'pump_not_active', 
                position: 'left', 
                size: 20,
            }}
        >
          Pump
        </Typography>

        <Typography
            onClick={handleChange('Moonshot')}
            className="cursor-pointer"
            size="headline4"
            color={isActive('Moonshot') ? 'primary' : "secondary"}
            icon={{ 
                name: isActive('Moonshot') ? 'moonshot_green' : 'moonshot_not_active', 
                position: 'left', 
                size: 20 
            }}
        >
          Moonshot
        </Typography>
      </div>
    )
}