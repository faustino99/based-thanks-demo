'use client';

import { useState } from 'react';

import { AmountDropdown } from '../components/AmountDropdown';
import { RecipientField } from '../components/RecipientField';
import { SubmitButton } from '../components/SubmitButton';
import { ThankYouNoteTextArea } from '../components/ThankYouNoteTextArea';

export default function GiveThanks() {
  const [amount, setAmount] = useState<number | undefined>(undefined);
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [recipientAddress, setRecipientAddress] = useState<
    `0x${string}` | null
  >(null);

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-black dark:bg-background dark:text-white">
      <main className="flex flex-grow justify-center">
        <section className="mx-auto w-full max-w-xl space-y-7 p-6">
          <RecipientField onBlur={setRecipientAddress} />
          <AmountDropdown amount={amount} setAmount={setAmount} />
          <ThankYouNoteTextArea note={note} setNote={setNote} />
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="confirmed"
              className="h-4 w-4 rounded border-gray-300 bg-white text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
              checked={confirmed}
              onChange={() => setConfirmed((prevState) => !prevState)}
            />
            <label
              htmlFor="confirmed"
              className="text-sm text-gray-700 dark:text-gray-300"
            >
              I understand that this message will be publicly visible on the
              Base blockchain
            </label>
          </div>
          <SubmitButton
            recipientAddress={recipientAddress}
            amount={amount}
            note={note}
            confirmed={confirmed}
          />
        </section>
      </main>
    </div>
  );
}
