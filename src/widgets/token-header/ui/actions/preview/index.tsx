import { ModalDefault } from "shared/ui/modal"
import {MODAL_KEYS} from '../../../config';
import { useStoreMap, useUnit } from "effector-react";
import { Typography } from "shared/ui/typography";
import { modalsStore } from "shared/lib/modal";
import { $token } from "entities/token";
import { getVideoEmbedUrl, type getVideoEmbedUrlResult } from "../../../lib";
import { Button } from "shared/ui/button";

interface FavouriteTokenProps {
  button?: string;
  icon?: string;
  span?: string;
}

export const PreviewButton = ({
  button,
  icon,
  span
}:FavouriteTokenProps) => {
    const token = useUnit($token);
    const preview = getVideoEmbedUrl(token?.youtube ?? '');
    const openModal = useUnit(modalsStore.openModal);
    
    if(!preview) return null;

    return (
        <Button
            onClick={() => openModal({
                ...PreviewModal,
                props: {
                    ...PreviewModal.props,
                    preview
                }
            })}
            theme="darkGray"
            icon={{ position: 'left', name: 'preview', size: 16 }}
            className={{ button, icon }}
        >
            <span className={span}>Preview</span>
        </Button>
    )
}

const Preview = ({preview}: {preview: getVideoEmbedUrlResult}) => {
    const modal = useStoreMap(
        modalsStore.$modals, 
        (modals) => modals.find((modal) => modal.props.id === MODAL_KEYS.PREVIEW)
    );

    return (
        <ModalDefault
            id={MODAL_KEYS.PREVIEW}
            classNames={{
                content: 'flex flex-col gap-2 w-full h-full rounded-xl',
                wrapper: 'max-w-[840px] h-[508px] !p-0 rounded-xl',
            }}
            isNoBtnCLose
        >
            {preview && modal?.isOpen ? 
                preview.type === 'EMBED' ?
                <iframe 
                    className="rounded-xl h-full"
                    src={preview.url}
                />
                :
                <video 
                    className="rounded-xl h-full"
                    src={preview.url}
                />
                :
                <Typography>Nothing</Typography>
            }
        </ModalDefault>
    )
}

const PreviewModal = {
  Modal: Preview,
  isOpen: false,
  props: {
    id: MODAL_KEYS.PREVIEW,
  },
};
