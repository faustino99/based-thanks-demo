export const contractAddress = '0xe0436062c2F0c3483D13451fD947783106e3dC74';
export const contractAbi = [
  {
    inputs: [
      {
        internalType: 'address',
        name: 'recipient',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'amount',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: 'note',
        type: 'string',
      },
    ],
    name: 'sendPraise',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export const eventAbi = {
  anonymous: false as const,
  inputs: [
    {
      indexed: true,
      internalType: 'address',
      name: 'sender',
      type: 'address',
    } as const,
    {
      indexed: true,
      internalType: 'address',
      name: 'recipient',
      type: 'address',
    } as const,
    {
      indexed: false,
      internalType: 'uint256',
      name: 'amount',
      type: 'uint256',
    } as const,
    {
      indexed: false,
      internalType: 'string',
      name: 'note',
      type: 'string',
    } as const,
    {
      indexed: false,
      internalType: 'uint256',
      name: 'timestamp',
      type: 'uint256',
    } as const,
  ] as const,
  name: 'PraiseSent' as const,
  type: 'event' as const,
} as const;
