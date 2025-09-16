import { ReactNode } from 'react';
import { ToastContainer } from 'react-toastify';
import { Icon } from 'shared/ui/icon';
import { Loader } from 'shared/ui/loader';

export const withToast = (component: () => ReactNode) => () => {
  return (
    <>
      <ToastContainer
        hideProgressBar
        draggable
        draggablePercent={40}
        closeButton={false}
        icon={({ type }) => {
          switch (type) {
            case 'success':
              return <Icon name="successToast" size={20} className="text-[#34D399]" />;
            case 'error':
              return <Icon name="errorToast" size={20} className="text-[#E95B70]" />;
            case 'info':
              return <Icon name="infoToast" size={20} className="text-[#3772FF]" />;
            default:
              return (
                <Loader
                  className={{
                    wrapper: '!h-[20px] !w-[20px]',
                    border: '!border-2',
                    borderYellow: '!m-1 !border-2',
                    borderPrimary: '!h-[6px] !w-[6px]',
                  }}
                />
              );
          }
        }}
      />

      {component()}
    </>
  );
};
