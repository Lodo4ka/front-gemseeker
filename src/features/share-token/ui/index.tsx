import { useUnit } from "effector-react";
import { Button } from "shared/ui/button"
import { $viewer } from "shared/viewer";
import { copied } from "../model";
import { shareTokenLink } from "../config";

interface FavouriteTokenProps {
  button?: string;
  icon?: string;
  span?: string;
}

export const ShareToken = ({
  button,
  icon,
  span
}:FavouriteTokenProps) => {
  const [user, copy] = useUnit([$viewer, copied]);
  const refLink = `${shareTokenLink}${user?.user_id}`
  
  return (
    <Button
      theme="darkGray"
      icon={{ position: 'left', name: 'share', size: 16 }}
      className={{ button, icon }}
      onClick={() => copy(refLink)}
  >
      <span className={span}>Share</span>
    </Button>
  )
}
