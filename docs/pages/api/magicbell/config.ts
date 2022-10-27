import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json({
    ws: {
      region: 'eu',
      channel: 'user_05d52b50-9842-4a5c-acef-a1bb361f9e68-project_83',
      auth_url: 'ws/auth',
    },
    inbox: { features: { no_magicbell_branding: { enabled: true } } },
    channels: {
      webPush: {
        enabled: false,
      },
    },
  });
}
