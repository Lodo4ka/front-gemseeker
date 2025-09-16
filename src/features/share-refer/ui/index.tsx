import { useUnit } from "effector-react"

import { Input } from "shared/ui/input"
import { copied } from "../model";
import { referralLink } from "../config";
import { $viewer } from "shared/viewer";

export const ShareRefer = () => {
    const [user, copy] = useUnit([$viewer, copied]);
    const refLink = `${referralLink}${user?.user_id}`
    
    return(
        <Input
            value={refLink}
            // disabled
            classNames={{
                flex: 'bg-darkGray-3 w-full max-md:bg-darkGray-1',
                input: 'w-full text-secondary cursor-pointer',
                container: 'w-full',
            }}
            rightAddon={{ 
                icon: 'copy', 
                className: 'text-primary cursor-pointer', 
                size: 22,
                onClick: () => copy(refLink)
            }}
        />
    )
}