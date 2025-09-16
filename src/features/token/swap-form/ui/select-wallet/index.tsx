import { useUnit } from 'effector-react';
import { SelectWallet as SelectWalletUI } from 'entities/wallet';
import { $viewerStatus, ViewerStatus } from 'shared/viewer/model';

export const SelectWallet = () => {
    const viewerStatus = useUnit($viewerStatus);

    if(viewerStatus !== ViewerStatus.Authenticated) return <div className='mt-6' />;

    return(
        <SelectWalletUI
            className={{
                button: '2lg:bg-darаkGray-3 max-w-full',
                container: 'border-b-separator !z-1 mt-6 mb-4 border-b-[0.5px] pb-4',
                children: '2lg:-translate-x-[195px] max-2lg:!left-[85px] w-full',
                text: 'w-full',
            }}
        />
    )
}