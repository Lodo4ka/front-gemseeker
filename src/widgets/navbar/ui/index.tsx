import { Icon, IconName } from 'shared/ui/icon';
import { navbar } from '../config';
import { Link } from 'atomic-router-react';
import { Typography } from 'shared/ui/typography';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { RouteInstance, RouteParams } from 'atomic-router';
import { routes } from 'shared/config/router';
import { api } from 'shared/api';
import { Button } from 'shared/ui/button';
import { ConnectWalletButton } from 'features/connect-wallet';
import { socLinks } from 'shared/constants';
import { $viewerStatus, ViewerStatus } from 'shared/viewer/model';

export interface NavMenuItem<T extends RouteParams = {}> {
  title: string;
  icon: IconName;
  route: RouteInstance<T>;
  params?: T;
  isNeedAuth?: boolean 
}

export type Navbar = {
  title: string;
  routes: NavMenuItem[];
};

type NavbarProps = {
  isOpen: boolean;
  onClick?: () => void;
};

export const Refer = ({ isOpen, onClick }: NavbarProps) => (
  <Link
    to={routes.refer}
    onClick={onClick && onClick}
    className={clsx(
      'group bg-darkYellow relative z-0 flex h-9 items-center overflow-hidden rounded-lg',
      'transition-all duration-300 ease-in-out',
      isOpen ? 'w-full justify-center' : 'w-9 justify-center',
    )}>
    <Icon className="text-yellow h-[18px] w-[18px]" size={18} name="refer" />
    <div className={clsx('transition-all duration-300 ease-in-out', isOpen ? 'ml-2 opacity-100' : 'w-0 opacity-0')}>
      <Typography weight="regular" size="subheadline2" className="text-yellow whitespace-nowrap">
        Refer
      </Typography>
    </div>
  </Link>
);

const NavbarItem = <T extends RouteParams>({
  title,
  icon,
  route,
  params,
  isOpen,
  onClick,
  isNeedAuth
}: NavMenuItem<T> & { isOpen: boolean; onClick?: () => void }) => {
  const [isOpened, routeParams] = useUnit([route.$isOpened, route.$params]);
  const [viewerStatus] = useUnit([$viewerStatus]);
  const isActive = routeParams?.type !== 'click' ? (JSON.stringify(routeParams) === JSON.stringify(params) && isOpened) : false;

  if(isNeedAuth && viewerStatus !== ViewerStatus.Authenticated) return null;

  return (
    <Link
      to={route}
      params={params}
      onClick={onClick && onClick}
      className={clsx(
        'group relative z-0 flex h-11 items-center overflow-hidden rounded-lg lg:h-9',
        'hover:bg-darkGray-1 w-9 justify-center p-0 transition-all duration-300 ease-in-out',
        isOpen && `w-full justify-start gap-2 p-2`,
        isActive && 'bg-darkGray-1',
      )}>
      <Icon
        className={clsx('text-secondary z-10 h-[18px] w-[18px] transition-all duration-300', isActive && 'text-yellow')}
        size={18}
        name={icon}
      />
      <div
        className={clsx(
          'pointer-events-none absolute top-1/2 z-0 -translate-y-1/2',
          'left-9 -translate-x-full opacity-0 transition-all duration-300 ease-in-out',
          isOpen && 'left-9 translate-x-0 opacity-100',
        )}>
        <Typography
          weight="regular"
          size="subheadline2"
          className={clsx('text-secondary block whitespace-nowrap', isActive && '!text-primary')}>
          {title}
        </Typography>
      </div>
    </Link>
  );
};

const SectionTitle = ({ title, isOpen }: { title: string; isOpen: boolean }) => (
  <div
    className={clsx(
      'relative -translate-x-full opacity-0 transition-all duration-300 ease-in-out',
      isOpen && 'translate-x-0 opacity-100',
    )}>
    <Typography weight="regular" size="captain1" className="text-secondary whitespace-nowrap">
      {title}
    </Typography>
  </div>
);

const NavbarSection = ({ title, routes, isOpen, onClick }: Navbar & { isOpen: boolean; onClick?: () => void }) => (
  <div
    className={clsx(
      'flex flex-col gap-2 transition-all duration-300 ease-in-out',
      'border-t-separator w-9 overflow-hidden border-t-[0.5px] pt-0',
      isOpen && 'w-full border-t-transparent px-4',
    )}>
    <SectionTitle title={title} isOpen={isOpen} />
    <div className="flex flex-col gap-2">
      {routes.map((route) => (
        <NavbarItem params={{}} onClick={onClick} key={route.title} {...route} isOpen={isOpen} />
      ))}
    </div>
  </div>
);

export const NavbarHeader = () => {
  return(
    <div className='!flex lg:!hidden w-full px-2'>
      <ConnectWalletButton 
        classNameAuth="w-full h-[60px] max-w-[300px] m-auto"
        classNameConnect="m-auto"
        classNameLogout='ml-auto' 
      />
    </div>
  )
}

const NavbarFooter = ({ isOpen, onClick }: NavbarProps) => {
  const user = useUnit(api.queries.user.me.$data);

  return (
    <div className="flex flex-col gap-6">
      {user &&
        <div className="px-4">
          <Refer onClick={onClick} isOpen={isOpen} />
        </div>
      }
      <div className="border-t-separator flex h-[76px] w-full items-center justify-center border-t-[0.5px] px-4">
        <div className='w-full hidden lg:block'>
          {user && (
            <NavbarItem<{ id: string }>
              onClick={onClick}
              title="Profile"
              icon="profile"
              route={routes.profile}
              params={{ id: String(user.user_id) }}
              isOpen={isOpen}
            />
          )}
        </div>

        <div className='lg:hidden flex gap-2'>
          <Button
            as={Link}
            to={socLinks.twitter}
            theme="quaternary"
            className={{ button: 'h-10 w-10 !rounded-full !p-[6px]' }}
            icon={{ name: 'twitter', size: 18, position: 'left' }}
          />

          <Button
            as={Link}
            to={socLinks.telegram}
            theme="quaternary"
            className={{ button: 'h-10 w-10 !rounded-full !p-[6px]' }}
            icon={{ name: 'telegram', size: 18, position: 'left' }}
          />
        </div>
      </div>
    </div>
  );
};

export const Navbar = ({ isOpen, onClick }: NavbarProps) => (
  <div className="bg-bg flex h-full w-full flex-col justify-between gap-11">
    <div className="flex flex-col items-center gap-3 pt-5 [&>*:first-child]:border-t-0 [&>*:first-child]:pt-0">
      <NavbarHeader />

      {navbar.map(({ title, routes }) => (
        <NavbarSection onClick={onClick} key={title} title={title} routes={routes} isOpen={isOpen} />
      ))}
    </div>

    <NavbarFooter onClick={onClick} isOpen={isOpen} />
  </div>
);


