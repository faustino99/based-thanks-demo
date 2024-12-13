export function ThankYouNoteTextArea({
  note,
  setNote,
}: {
  note: string;
  setNote: (note: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="message"
        className="block text-lg font-bold text-gray-700 dark:text-gray-200"
      >
        What are you giving thanks for?
      </label>
      <textarea
        id="message"
        maxLength={100}
        rows={4}
        className="w-full resize-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="ex: Alice helped me debug my smart contract"
      ></textarea>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        <span className="text-gray-400 dark:text-gray-500">
          {`${100 - note.length} characters remaining`}
        </span>
      </p>
    </div>
  );
}
