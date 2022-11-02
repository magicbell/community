import type { NextApiRequest, NextApiResponse } from 'next';

const notification = (data: Record<string, unknown>) => ({
  id: id('not'),
  title: 'Test Notification',
  content: 'Notification Content',
  action_url: '',
  category: 'announcement',
  sent_at: timeAgo(0),
  ...data,
  recipient: {
    id: id('usr'),
    email: 'person@example.com',
    ...(data.recipient as any),
  },
});

let count = 0;
const id = (prefix: string) => `${prefix}_${++count}`;
const timeAgo = (seconds: number) => Math.floor(Date.now() / 1000) - seconds;

const fakeNotifications = {
  latest: [
    notification({
      title: "You're Invited to a Recording Session",
      content:
        'Please start preparing 10 minutes before your scheduled session. Enjoy the conversation!',
    }),
    notification({
      title: "The project 'Refactor the code' is due soon",
      content:
        '<p>A friendly reminder that your project is due soon.</p> <p>You can submit all remaining documents electronically <i>in just minutes</i>.</p>',
    }),
    notification({
      title: "Deploying Rails apps on Amazon's Elastic Kubernetes Service",
      content:
        '<p>Service providers like DigitalOcean, Google Cloud, and Amazon offer managed Kubernetes, and unless you are feeling adventurous, I highly recommend using them. At MagicBell, we use Amazon\'s Elastic Kubernetes Service (EKS) and find it quite performant (once you get past all the hoops of IAM etc).</p><p style="opacity: 0.5; margin-top: 6px; text-transform: uppercase;">Hana Mohan (MagicBell)</p>',
    }),
    notification({
      title: 'Tom mentioned you in a coment',
      content:
        '<p>Hi <b style="color: black !important;">@Dan</b>, could you please get me the files this client is requesting?</p><p><button style="padding: 12px; border-radius: 3px; background-color:rgb(255, 222, 0); width: 100%; border: none; color: black !important;">View thread</button></p>',
    }),
  ],
  billing: [
    notification({
      title: `Invoice for ${new Date().toLocaleString('en-us', {
        month: 'short',
        year: 'numeric',
      })}`,
      content: `Your invoice is due in 7 days. Please reach out if you need assistance.`,
    }),
    notification({
      title: `Quota threshold reached (90% used)`,
      content: `You've exceeded 90% of your quota. Please upgrade your plan to ensure continued access.`,
    }),
    notification({
      title: 'Failed to charge card.',
      content: `We were unable to charge your card. Please update your card details via account settings.`,
    }),
  ],
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const params = req.query || {};

  const category = (params['categories[]'] || null) as
    | keyof typeof fakeNotifications
    | null;

  let notifications = category
    ? fakeNotifications[category] || fakeNotifications.latest
    : fakeNotifications.latest;

  // set some read/seen dates
  notifications = notifications.map((notification, idx) => ({
    ...notification,
    read_at: idx > 1 ? timeAgo(0) : null,
    seen_at: idx > 0 ? timeAgo(0) : null,
    sent_at: timeAgo((idx + 1) * 60),
  }));

  if (typeof params.seen !== 'undefined') {
    notifications = notifications.filter(
      (x) => Boolean((x as any).seen_at).toString() === params.seen,
    );
  }

  if (typeof params.read !== 'undefined') {
    notifications = notifications.filter(
      (x) => Boolean((x as any).read_at).toString() === params.read,
    );
  }

  if (category) {
    notifications = notifications.map((notification) => ({
      ...notification,
      category,
    }));
  }

  return res.json({
    project_id: id('prj'),
    unseen_count: notifications.filter((x) => !(x as any).seen_at).length,
    unread_count: notifications.filter((x) => !(x as any).read_at).length,
    total: notifications.length,
    total_pages: 1,
    per_page: params.per_page || 15,
    current_page: params.page || 1,
    notifications,
    user: { email: 'person@example.com' },
  });
}
