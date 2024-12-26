import { useEffect, useRef, useState } from 'react';

const defaultOptionLabel = 'Select number of transactions...';
const optionLabelToCount = {
  '5 transactions': 5,
  '10 transactions': 10,
  '25 transactions': 25,
  '50 transactions': 50,
};

type TransactionCountDropdownProps = {
  count: number;
  setCount: (count: number) => void;
};

export function TransactionCountDropdown({
  count,
  setCount,
}: TransactionCountDropdownProps) {
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
        htmlFor="transactionCount"
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        View last
      </label>
      <label
        id="transactionCount"
        className="w-96 cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 transition-colors dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
        onClick={() => setIsExpanded((prevState) => !prevState)}
      >
        {count ? `${count} transactions` : defaultOptionLabel}
      </label>
      <div className="relative">
        {isExpanded && (
          <div className="absolute z-10 mt-1 flex w-96 cursor-pointer flex-col rounded-lg border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-900">
            {Object.entries(optionLabelToCount).map(([label, value]) => (
              <p
                key={label}
                className={`px-4 py-2 hover:bg-gray-700 dark:text-gray-400 ${
                  count === value ? 'bg-gray-800' : ''
                }`}
                onClick={() => {
                  setCount(value);
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
