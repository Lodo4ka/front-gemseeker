import { useUnit } from 'effector-react';
import { Button } from 'shared/ui/button';
import {
  deposited,
  $pending,
  initSignAllTransactions,
  $instructionsBatches,
  $connection,
  depositSucceeded,
  depositFailed,
} from 'entities/wallet';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { PublicKey, Transaction, TransactionInstruction } from '@solana/web3.js';
import { WalletNotConnectedError } from '@solana/wallet-adapter-base';
import bs58 from 'bs58';

export const DepositButton = () => {
  const { signAllTransactions, publicKey, sendTransaction } = useWallet();
  const [deposit, initializeSignAllTransactions, depositSucceed, depositFail, instructionsBatches, connection] =
    useUnit([deposited, initSignAllTransactions, depositSucceeded, depositFailed, $instructionsBatches, $connection]);
  const pending = useUnit($pending);
  useEffect(() => {
    if (instructionsBatches) {
      if (!publicKey) throw new WalletNotConnectedError();

      const sendDepositTx = async () => {
        const transaction = new Transaction();
        for (const batch of instructionsBatches) {
          for (const instruction of batch) {
            const keys = instruction.accounts.map((account) => ({
              pubkey: new PublicKey(account.pubkey),
              isSigner: account.isSigner,
              isWritable: account.isWritable,
            }));

            const data = Buffer.from(bs58.decode(instruction.data));

            const txInstruction = new TransactionInstruction({
              keys,
              programId: new PublicKey(instruction.programId),
              data,
            });

            transaction.add(txInstruction);
          }
        }
        const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash('confirmed');
        const minContextSlot = await connection.getSlot('confirmed');

        transaction.recentBlockhash = blockhash;
        transaction.feePayer = publicKey;

        try {
          const signature = await sendTransaction(transaction, connection, { minContextSlot });

          console.log(signature);

          const confirmation = await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature });

          if (confirmation.value.err) {
            throw new Error(`Transaction failed: ${confirmation.value.err.toString()}`);
          }

          console.log(`Transaction successful! Signature: ${signature}`);
          depositSucceed(signature);
        } catch (error) {
          depositFail(JSON.stringify(error));
          console.log(error);
        }
      };

      sendDepositTx();
    }
  }, [publicKey, instructionsBatches, sendTransaction, connection]);

  useEffect(() => {
    if (signAllTransactions) initializeSignAllTransactions(signAllTransactions);
  }, [signAllTransactions]);

  return (
    <Button
      onClick={deposit}
      disabled={pending}
      className={{ button: 'disabled:bg-yellow/30 w-[140px] max-sm:mt-[30px] max-sm:w-fit' }}>
      {pending ? 'Depositing...' : 'Deposit'}
    </Button>
  );
};
