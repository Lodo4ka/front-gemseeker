import clsx from 'clsx';
import { ConnectWalletButton } from 'features/connect-wallet';
import { useUnit } from 'effector-react';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Navbar } from 'widgets/navbar';
import { $isOpenMenu, $isOpenSearch, hiddenMenu, navigatedToCreateToken, toggledMenu, toggledSearch } from '../model';
import { routes } from 'shared/config/router';
import { SearchToken, SearchTokenContent } from 'features/search-token';
import { $publicKey } from 'entities/wallet';
import { Typography } from 'shared/ui/typography';
import { StreamButton } from 'features/stream';

export const Header = () => {
  const [toMain, toCreateToken] = useUnit([routes.memepad.open, navigatedToCreateToken]);
  const publicKey = useUnit($publicKey);
  const [isMenuOpen, toggleMenu, hideMenu] = useUnit([$isOpenMenu, toggledMenu, hiddenMenu]);
  const [isSearchOpen, toggleSearch] = useUnit([$isOpenSearch, toggledSearch]);

  return (
    <>
      <header className="border-separator bg-bg fixed top-0 right-0 left-0 z-[51] flex h-15 items-center justify-between gap-2 border-b px-4 lg:left-[70px] lg:h-16 lg:px-5">
        <div onClick={toMain} className="relative flex cursor-pointer items-center hover:opacity-80 lg:hidden">
          <Icon name="logoIcon" size={36} className="h-9 w-9 flex-shrink-0 transition-opacity sm:w-6" />
          {!publicKey && (
            <Icon
              name="logoText"
              className="text-primary ml-1 h-[14px] !w-[80px] flex-shrink-0 transition-all duration-300 sm:h-[16px] sm:!w-[110px]"
            />
          )}
          <Typography className="ml-[5px]" color="secondary">
            BETA
          </Typography>
        </div>

        <SearchToken />

        <div className="flex flex-shrink-0 items-center gap-2.5">
          <div className="hidden gap-2.5 text-[15px] lg:flex">
            <StreamButton />
            <Button onClick={toCreateToken}>+ Launch Token</Button>
          </div>

          {!isSearchOpen && !isMenuOpen && (
            <ConnectWalletButton classNameConnect="!text-xs sm:!text-sm !px-2 sm:!px-4 !gap-0.5 sm:!gap-1" />
          )}

          {!isMenuOpen && (
            <Button
              theme="secondary"
              onClick={toggleSearch}
              className={{
                button: '!h-9 !w-9 !p-0 lg:hidden',
              }}>
              {!isSearchOpen && <Icon className="h-5 w-5" name="search" size={20} />}
              {isSearchOpen && (
                <div className="flex h-5 w-5 items-center justify-center">
                  <div className="relative h-5 w-5">
                    <div className="bg-secondary absolute top-1/2 h-[2px] w-full -translate-y-1/2 rotate-45 rounded-xl" />
                    <div className="bg-secondary absolute top-1/2 h-[2px] w-full -translate-y-1/2 -rotate-45 rounded-xl" />
                  </div>
                </div>
              )}
            </Button>
          )}
          {!isSearchOpen && (
            <Button
              theme="secondary"
              onClick={toggleMenu}
              className={{
                button: 'flex !h-9 !w-9 flex-col items-center justify-center gap-1 !p-2 lg:hidden',
              }}>
              <div
                className={clsx(
                  'bg-secondary h-[2px] w-full rounded-xl transition-all duration-300',
                  isMenuOpen && 'translate-y-[6px] rotate-45',
                )}
              />
              <div
                className={clsx(
                  'bg-secondary h-[2px] w-full rounded-xl transition-all duration-300',
                  isMenuOpen && 'opacity-0',
                )}
              />
              <div
                className={clsx(
                  'bg-secondary h-[2px] w-full rounded-xl transition-all duration-300',
                  isMenuOpen && '-translate-y-[6px] -rotate-45',
                )}
              />
            </Button>
          )}
        </div>
      </header>
      <div
        className={clsx(
          'bg-bg fixed top-0 right-0 left-0 z-[61] h-[calc(100vh-60px)] overflow-y-auto transition-transform duration-300 lg:hidden',
          isMenuOpen ? 'translate-y-[60px]' : '-translate-y-full',
        )}>
        <Navbar onClick={hideMenu} isOpen={true} />
      </div>
      <div
        className={clsx(
          'bg-bg fixed top-0 right-0 left-0 z-[12] h-[calc(100vh-60px)] overflow-y-auto px-3 pt-5 pb-18 transition-transform duration-300 lg:hidden',
          isSearchOpen ? 'translate-y-[60px]' : '-translate-y-full',
        )}>
        <SearchTokenContent isPopoverOpen={true} />
      </div>
    </>
  );
};
