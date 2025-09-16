import { Button } from "shared/ui/button"
import { claimed } from "../model";
import { useUnit } from "effector-react";

export const ClaimRefer = () => {
    const claime = useUnit(claimed);
    
    return (
        <Button 
            className={{ button: 'text-nowrap max-md:w-full' }}
            onClick={claime}
        >
            Claim rewards
        </Button>
    )
}
