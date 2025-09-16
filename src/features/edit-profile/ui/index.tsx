import { useUnit } from 'effector-react';
import { Button } from 'shared/ui/button';
import { Icon } from 'shared/ui/icon';
import { Input } from 'shared/ui/input';
import { Typography } from 'shared/ui/typography';
import {
  $bio,
  $file,
  $isEdit,
  $isSubscribed,
  $name,
  $photo,
  changedBio,
  changedName,
  fileSelected,
  toggledEdit,
  toggledSubscribed,
  updatedProfile,
} from '../model';
import { UploadImage } from 'shared/ui/upload-image';
import { api } from 'shared/api';
import { Skeleton } from 'shared/ui/skeleton';
import { ImageWrapper } from 'shared/ui/image';
import { getFullUrlImg } from 'shared/lib/full-url-img';

export const EditProfile = ({ isOwnProfile }: { isOwnProfile: boolean }) => {
  const [name, bio, photo, isEdit, isSubscribed] = useUnit([$name, $bio, $photo, $isEdit, $isSubscribed]);
  const [changeName, changeBio] = useUnit([changedName, changedBio]);
  const [toggleEdit, toggleSubscribed] = useUnit([toggledEdit, toggledSubscribed]);
  const [updateProfile, pending] = useUnit([updatedProfile, api.mutations.user.update.$pending]);

  if (isEdit)
    return (
      <div className="max-2lg:flex-col max-2lg:items-center max-2lg:gap-4 flex w-full items-start gap-6">
        <UploadImage 
          defaultPreview={getFullUrlImg(photo, name)} 
          $file={$file} 
          fileSelected={fileSelected} 
        />
        <div className="flex w-full flex-col gap-4">
          <Input
            value={name}
            label="Name"
            onValue={changeName}
            classNames={{ container: 'w-full', flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1' }}
            placeholder="Enter your name"
          />
          <div className="flex w-full flex-col gap-2">
            <Input
              label="Bio"
              value={bio}
              onValue={changeBio}
              classNames={{ container: 'w-full', flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1' }}
              placeholder="Enter your bio"
            />
          </div>
          <Button
            disabled={pending}
            onClick={updateProfile}
            className={{ button: 'max-2lg:w-full w-fit' }}
            theme="quaternary">
            {pending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    );

  return (
    <div className="max-2lg:flex-col max-2lg:items-center max-2lg:gap-4 flex w-full items-center gap-6">
      <ImageWrapper
        src={getFullUrlImg(photo, name)}
        classNames={{ both: 'h-[110px] min-w-[110px] max-w-[110px] rounded-full' }}
        isHoverImg
      />
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center gap-2">
          <Typography size="headline2" color="primary">
            {name}
          </Typography>
          {isOwnProfile && <Icon onClick={toggleEdit} className="cursor-pointer" name="pencil" size={24} />}
        </div>
        <Typography size="headline3" color="secondary">
          {bio || '-----'}
        </Typography>
        {!isOwnProfile && (
          <Button
            onClick={toggleSubscribed}
            theme={!isSubscribed ? 'primary' : 'quaternary'}
            className={{ button: 'w-fit' }}>
            {isSubscribed ? 'You follow' : 'Follow'}
          </Button>
        )}
      </div>
    </div>
  );
};

export const EditProfileSkeleton = () => (
  <div className="max-2lg:flex-col max-2lg:items-center max-2lg:gap-4 flex w-full items-start gap-6">
    <Skeleton isLoading className="h-[110px] min-w-[110px] rounded-full" />
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <Skeleton isLoading className="h-6 w-[60%] rounded" />
      </div>
      <Skeleton isLoading className="h-[22px] w-full rounded" />
      <Skeleton isLoading className="max-2lg:w-full h-10 w-24 rounded" />
    </div>
  </div>
);
