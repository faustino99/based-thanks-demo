type PraiseLogsRequest = {
  address?: string;
};

type PraiseLogsResponse = {
  data: {
    praiseSents: {
      id: string;
      sender: string;
      recipient: string;
      timestamp: bigint;
      amount: bigint;
      note: string;
    }[];
  };
};

export async function fetchPraiseLogs({
  address,
}: PraiseLogsRequest): Promise<PraiseLogsResponse['data']['praiseSents']> {
  const response = await fetch(
    // test endpoint
    // 'https://api.studio.thegraph.com/query/99147/based-thanks-test/0.0.2',
    'https://api.studio.thegraph.com/query/99147/based-thanks/version/latest',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: `
            query FetchPraiseLogs {
                praiseSents(first: 50, orderBy: timestamp, orderDirection: desc ${!!address ? `where: {or:[{recipient: "${address}"}, {sender: "${address}"}]}` : ''}) {
                id
                sender
                recipient
                timestamp
                amount
                note
            }
            }
        `,
        variables: {},
      }),
    }
  );

  const responseJson = (await response.json()) as PraiseLogsResponse;
  return responseJson.data.praiseSents;
}
