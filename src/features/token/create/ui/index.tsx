import { UploadImageField } from 'shared/ui/upload-image';
import { $$tokenForm } from '../model';
import { Typography } from 'shared/ui/typography';
import { Input } from 'shared/ui/input';
import { InputBuy } from './input-buy';
import { CheckboxField } from 'shared/ui/checkbox';
import { LiveStream } from './live-stream';
import { Button } from 'shared/ui/button';
import { useUnit } from 'effector-react';
import { useForm } from '@effector-reform/react';
import { api } from 'shared/api';
import { SelectWallet } from 'entities/wallet';

export type CreateTokenStepProps = {
  isLiveStream?: boolean;
};
export const CreateTokenStep = ({ isLiveStream = true }: CreateTokenStepProps) => {
  const pending = useUnit(api.mutations.token.create.$pending);
  const { fields, onSubmit } = useForm($$tokenForm);

  return (
    <form onSubmit={onSubmit} className="flex w-full flex-col justify-between">
      <div className="flex flex-col p-5 max-sm:p-0">
        <div className="flex items-center gap-[30px] max-sm:flex-col max-sm:gap-[15px]">
          <UploadImageField
            disabled={pending}
            className="max-sm:bg-darkGray-3"
            onChange={fields.image.onChange}
            value={fields.image.value}
            error={fields.image.error}
          />
          <div className="flex w-full flex-col gap-4">
            <Input
              disabled={pending}
              value={fields.token_name.value}
              onValue={fields.token_name.onChange}
              error={fields.token_name.error}
              classNames={{ container: 'w-full', flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1' }}
              label="Token name*"
              placeholder="Enter the token name"
            />
            <Input
              disabled={pending}
              classNames={{ container: 'w-full', flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1' }}
              label="Ticker"
              placeholder="Enter the name of the token"
              value={fields.ticker.value}
              onValue={fields.ticker.onChange}
              error={fields.ticker.error}
            />
          </div>
        </div>
        <Input
          disabled={pending}
          classNames={{
            container: 'w-full mt-4 pb-6 border-b-[0.5px] border-b-separator',
            flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1',
          }}
          label="Description"
          value={fields.description.value}
          onValue={fields.description.onChange}
          error={fields.description.error}
          placeholder="Tell about your token..."
        />
        <Typography className="mt-6 mb-4" size="headline3" weight="medium">
          Token
        </Typography>

        <InputBuy disabled={pending} />

        <Typography className="mt-6 mb-4" size="headline3" weight="medium">
          Video preview
        </Typography>
        <Input
          disabled={pending}
          classNames={{ flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1', container: 'w-full' }}
          leftAddon={{ icon: 'youtube' }}
          placeholder="https://youtube.com?watch=..."
          value={fields.preview.value}
          onValue={fields.preview.onChange}
          error={fields.preview.error}
        />
        <Typography className="mt-6 mb-4" size="headline3" weight="medium">
          Socials
        </Typography>
        <div className="border-b-separator grid w-full grid-cols-1 gap-3 border-b-[0.5px] pb-6">
          <Input
            disabled={pending}
            value={fields.socials.twitter.value}
            onValue={fields.socials.twitter.onChange}
            error={fields.socials.twitter.error}
            classNames={{ flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1', container: 'w-full' }}
            leftAddon={{ icon: 'twitter' }}
            placeholder="https://twiter.com"
          />
          <Input
            disabled={pending}
            onValue={fields.socials.telegram.onChange}
            value={fields.socials.telegram.value}
            error={fields.socials.telegram.error}
            classNames={{ flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1', container: 'w-full' }}
            leftAddon={{ icon: 'telegram' }}
            placeholder="https://web.telegram.com"
          />
          <Input
            disabled={pending}
            error={fields.socials.website.error}
            value={fields.socials.website.value}
            onValue={fields.socials.website.onChange}
            classNames={{ flex: 'bg-darkGray-3 max-2lg:bg-darkGray-1', container: 'w-full' }}
            leftAddon={{ icon: 'site' }}
            placeholder="https://your-website-url"
          />
        </div>
        <Typography className="mt-6 mb-4" size="headline2" weight="medium">
          {isLiveStream && 'Live-stream and other'}
          {!isLiveStream && 'Other'}
        </Typography>

        <div className="flex w-full flex-col gap-4">
          <div className="border-separator flex w-full items-center justify-between rounded-[10px] border-[0.5px] p-3">
            <Typography size="subheadline2" weight="regular">
              Include NSFW
            </Typography>
            <CheckboxField
              disabled={pending}
              variant="switch"
              checked={fields.nsfw.value}
              toggle={fields.nsfw.onChange}
            />
          </div>
          {isLiveStream && <LiveStream disabled={pending} />}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <div className="border-t-separator w-full border-t-[0.5px] px-5 pt-5">
          <SelectWallet
            placement="top"
            className={{
              text: 'w-full',
            }}
            isVisibleBalance
          />
        </div>
        <div className="flex w-full items-center justify-end gap-4 p-5 max-sm:mt-5">
          <Typography
            color="secondary"
            size="subheadline2"
            className="!gap-1"
            icon={{ position: 'right', name: 'solana', size: 14 }}>
            The fee is 0.00036
          </Typography>
          <Button isLoaderIcon={pending} theme={pending ? 'quaternary' : 'primary'} disabled={pending} type="submit">
            {pending && 'Launching...'}
            {fields.livestream.value && !pending && 'Continue'}
            {!fields.livestream.value && !pending && 'Launch token'}
          </Button>
        </div>
      </div>
    </form>
  );
};
