import { Link } from "atomic-router-react";
import { useUnit } from "effector-react";
import { $token } from "entities/token";
import { Button } from "shared/ui/button"

interface SearchInXProps {
  button?: string;
  icon?: string;
  span?: string;
}

export const SearchInX = ({
    button,
    icon,
    span
}: SearchInXProps) => {
    const token = useUnit($token);

    return(
        <Button
            as={Link}
            to={`https://x.com/search?q=${token?.address}`}
            target="_blank"
            theme="darkGray"
            icon={{ position: 'left', name: 'twitter', size: 16 }}
            className={{ button, icon }}
        >
            <span className={span}>Search</span>
        </Button>
    )
}