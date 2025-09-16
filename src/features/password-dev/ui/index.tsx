import { ModalDefault } from "shared/ui/modal";
import { MODAL_KEYS } from "../config";
import { Input } from "shared/ui/input";
import { Button } from "shared/ui/button";
import { useUnit } from "effector-react";
import { password, nickname, submitted } from "../model";

export const PasswordDevModalUi = () => {
  const [passwordValue, passwordFieldUpdate] = useUnit([
    password.$value, 
    password.fieldUpdated, 
  ]);
  const [nicknameValue, nicknameFieldUpdate, sumbite] = useUnit([
    nickname.$value, 
    nickname.fieldUpdated, 
    submitted
  ]);

  return (
    <ModalDefault
      header={{
        children: 'Password for auth',
        weight: 'medium',
        size: 'subheadline1',
        color: 'primary',
        className: 'text-primary',
      }}
      classNames={{
        content: 'flex flex-col gap-2 w-full',
        wrapper: '!bg-bg max-w-[380px]',
      }}
      id={MODAL_KEYS.PASSWORD_AUTH_DEV}
      isNoClose
    >
      <Input 
        value={nicknameValue}
        onValue={nicknameFieldUpdate}
        placeholder="nickname"
      />
      <Input 
        value={passwordValue}
        onValue={passwordFieldUpdate}
        placeholder="password"
      />

      <Button onClick={sumbite}>Submit</Button>
    </ModalDefault>
  );
}