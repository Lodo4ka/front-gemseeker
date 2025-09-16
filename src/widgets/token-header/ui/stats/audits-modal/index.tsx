import { ModalDefault } from 'shared/ui/modal';
import { Details } from 'entities/token';

const AUDITS_MODAL_KEY = 'AUDITS_MODAL_KEY'

const AuditsModal = () => {
  return(
    <ModalDefault
      id={AUDITS_MODAL_KEY}
      header={{
        children: 'Audits'
      }}
      classNames={{
        wrapper: 'w-full max-w-[500px]'
      }}
    >
      <Details />
    </ModalDefault>
  )
}

export const AuditsModalProps = {
  Modal: AuditsModal,
  props: {
    id: AUDITS_MODAL_KEY
  },
  isOpen: true,
}