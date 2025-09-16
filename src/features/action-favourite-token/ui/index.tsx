import { useUnit } from "effector-react";
import { Button } from "shared/ui/button"
import { clickedFavourite } from "../model";
import { $tokenIsFavourite } from "entities/token";
import { $publicKey } from "entities/wallet";
import { modalsStore } from "shared/lib/modal";
import { ConnectWalletModalProps } from "features/connect-wallet";

interface FavouriteTokenProps {
  button?: string;
  icon?: string;
  span?: string;
}

export const FavouriteToken = ({
  button,
  icon,
  span
}:FavouriteTokenProps) => {
  const [clickFavourite, tokenIsFavourite] = useUnit([clickedFavourite, $tokenIsFavourite]);
  const [publicKey, openModal] = useUnit([$publicKey, modalsStore.openModal]);
  
  const onClick = () => {
    if(!publicKey) return openModal(ConnectWalletModalProps);
    
    clickFavourite()
  }

  return (
    <Button
      onClick={onClick}
      theme="darkGray"
      icon={{ 
        position: 'left', 
        // @ts-ignore
        name: tokenIsFavourite ? 'favourite_true' : 'watchlist', 
        size: 16 
       }}
      className={{ button, icon }}>
      <span className={span}>Watchlist</span>
    </Button>
  )
}