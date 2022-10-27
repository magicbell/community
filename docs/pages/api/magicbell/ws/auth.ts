import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json({
    keyName: '0ugvOA.85mHKQ',
    timestamp: 1612536473106,
    nonce: 'f55a1d8c22c304dfb59599e8f9dff3fe',
    mac: 'wymLnXnoufQO8pL5dAlXRDgMyXEwLPhru81HtaVk1NM=',
  });
}
