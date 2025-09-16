import { useUnit } from "effector-react";
import { $isBuyQuick, toggledVariantQuick } from "entities/token";
import { Checkbox } from "shared/ui/checkbox";
import { Typography } from "shared/ui/typography"

export const ToggleVariantTx = () => {
    const [isBuy, handleVariantQuick] = useUnit([$isBuyQuick, toggledVariantQuick]);
    return(
        <div 
            // hidden sm:!flex
            className="flex bg-darkGray-1 min-h-4 min-w-[93px] justify-between rounded-lg py-[6px] px-[3px] cursor-pointer"
            style={{
                background: `radial-gradient(circle at left, ${isBuy ? 'rgba(52, 211, 153' : 'rgba(254, 57, 87'}, 0.25) 0%, rgb(26, 30, 40) 35%), var(--color-darkGray-1)`
            }}
            onClick={handleVariantQuick}
        >
            <Typography icon={{ name: 'energy', position: 'left' }} className="!gap-[2px]" size="subheadline2">
                {isBuy ? 'Buy' : 'Sell'}
            </Typography>

            <Checkbox
                variant="switch" 
                switchStyle='default'
                $isChecked={$isBuyQuick} 
                handleClick={() => {}}
                toggled={toggledVariantQuick} 
            />
        </div>
    )
}