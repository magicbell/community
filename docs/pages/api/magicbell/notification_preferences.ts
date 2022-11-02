import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  return res.json({
    notification_preferences: {
      categories: {
        announcement: {
          in_app: true,
          mobile_push: true,
          web_push: true,
          email: true,
        },
        billing: {
          in_app: false,
          mobile_push: true,
          web_push: true,
          email: true,
        },
        general: {
          in_app: true,
          mobile_push: true,
          web_push: false,
          email: true,
        },
        planning: {
          in_app: true,
          mobile_push: true,
          web_push: true,
          email: false,
        },
      },
    },
  });
}
