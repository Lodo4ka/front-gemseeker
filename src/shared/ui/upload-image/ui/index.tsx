import { FieldError } from '@effector-reform/core';
import clsx from 'clsx';
import { useUnit } from 'effector-react';
import { ChangeEvent, useEffect, useState } from 'react';
import { Icon } from 'shared/ui/icon';
import { Typography } from 'shared/ui/typography';
import { EventCallable, StoreWritable } from 'effector';

type UploadImageBaseProps = {
  onFileSelect: (file: File | null) => void;
  file: File | null;
  error?: FieldError;
  defaultPreview?: string;
  className?: string;
  disabled?: boolean;
};

export type UploadImageProps = {
  $file: StoreWritable<File | null>;
  fileSelected: EventCallable<File | null>;
  className?: string;
  defaultPreview?: string;
};

export type UploadImageFieldProps = {
  value: File | null;
  error: FieldError;
  onChange: (newValue: File | null) => void;
  className?: string;
  disabled?: boolean;
};

const UploadImageBase = ({ onFileSelect, file, error, className, defaultPreview, disabled }: UploadImageBaseProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    onFileSelect(file);
  };

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  useEffect(() => {
    if (defaultPreview) setPreview(defaultPreview);
  }, []);

  return (
    <div className={clsx("flex flex-col items-center gap-3", { 'opacity-50': disabled })}>
      <div
        className={clsx(
          'bg-darkGray-2 relative flex h-[110px] w-[110px] items-center justify-center overflow-hidden rounded-full',
          className,
        )}>
        <Icon size={32} name="avatar" className="z-10" />
        {preview && <img src={preview} className="absolute h-full w-full object-cover brightness-50" />}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={clsx("absolute z-[11] h-full w-full cursor-pointer opacity-0", { '!cursor-auto': disabled })}
          disabled={disabled}
        />
      </div>
      <Typography size="subheadline2" className="whitespace-nowrap" weight="regular" color="secondary">
        Upload your image
      </Typography>
      {error && (
        <Typography color="red" size="captain1">
          {error}
        </Typography>
      )}
    </div>
  );
};

export const UploadImage = ({ fileSelected, $file, className, defaultPreview }: UploadImageProps) => {
  const selectFile = useUnit(fileSelected);
  const file = useUnit($file);

  return (
    <UploadImageBase onFileSelect={selectFile} file={file} defaultPreview={defaultPreview} className={className} />
  );
};

export const UploadImageField = ({ value, onChange, error, className, disabled }: UploadImageFieldProps) => {
  return <UploadImageBase onFileSelect={onChange} file={value} error={error} className={className} disabled={disabled} />;
};
