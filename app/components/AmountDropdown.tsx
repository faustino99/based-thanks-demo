import { useEffect, useRef, useState } from 'react';

const defaultOptionLabel = 'Select an amount..';
const optionLabelToAmount = {
  '🙏 – ex: gave me great advice': 1,
  '🙏🙏 - ex: helped me debug my code': 2,
  '🙏🙏🙏 - ex: mentored me on an important project': 3,
};

type AmountDropdownProps = {
  amount: number | undefined;
  setAmount: (amount: number) => void;
};

export function AmountDropdown({ amount, setAmount }: AmountDropdownProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsExpanded(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col space-y-1" ref={dropdownRef}>
      <label
        htmlFor="amount"
        className="whitespace-nowrap text-lg font-bold text-gray-700 dark:text-gray-200"
      >
        How much $THNX should be minted?
      </label>
      <label
        id="amount"
        className="w-full cursor-pointer appearance-none rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        {!!amount ? `${amount} $THNX` : defaultOptionLabel}
      </label>
      <div className="v-0 relative">
        {isExpanded && (
          <div className="absolute z-10 mt-1 flex w-full cursor-pointer flex-col rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900">
            {Object.entries(optionLabelToAmount).map(([label, amount]) => (
              <p
                key={label}
                className="px-4 py-4 hover:bg-gray-700 dark:text-gray-400"
                onClick={() => {
                  setAmount(amount);
                  setIsExpanded(false);
                }}
              >
                {label}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
