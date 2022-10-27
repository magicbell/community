import Link from 'next/link';
import React from 'react';
import ChangelogEntry from './changelog/ChangelogEntry';

export default function HomeChangelog() {
  return (
    <section className="mt-8">
      <div className="flex items-center justify-between mb-8">
        <h2>Latest Updates</h2>
      </div>
      <ul className="bg-gray-50 rounded-3xl p-2 sm:p-5 xl:p-6 list-none space-y-0 m-0">
        <ChangelogEntry
          title="Filter notifications by category"
          timestamp="2021-07-19"
          isHighlighted
        >
          <>
            <p>
              We've added support for filtering notifications by category. You might find
              it useful to add tabs to your notification inbox. Please check the{' '}
              <Link href="/rest-api/reference#get-notifications">
                fetch notifications API endpoint documentation
              </Link>{' '}
              for details.
            </p>
          </>
        </ChangelogEntry>
        <ChangelogEntry title="Postmark improvements" timestamp="2021-07-09">
          <>
            <p>
              We send to Postmark both the notification ID and the notification broadcast
              ID when an email notification is delivered. You may find this helpful to
              reconcile deliveries.
            </p>
            <p>
              To help you test faster, the email channel will be enabled by default when
              you create a new project. You can disable it from your{' '}
              <a href="https://app.magicbell.com" target="_blank" rel="noreferrer">
                MagicBell dashboard
              </a>
              .
            </p>
          </>
        </ChangelogEntry>
        <ChangelogEntry title="MagicBell Ruby v2.1.0" timestamp="2021-07-07">
          For those using MagicBell in multi-tenant apps, this update allows you to create
          instances of the MagicBell client with different keys.
        </ChangelogEntry>
        <ChangelogEntry
          title="Multiple Mobile-Push apps per project"
          timestamp="2021-06-30"
        >
          We've added support for multiple push apps per project. This is useful if you
          use different app bundles for test/canary/production.
        </ChangelogEntry>
        <ChangelogEntry title="Postmark integration" timestamp="2021-06-20">
          We've added support for delivering email notifications via Postmark. If you'd
          like it setup, please contact us. We also support Mailgun, and Sendgrid.
        </ChangelogEntry>
        <ChangelogEntry title="Compose notification UI" timestamp="2021-06-13">
          We rolled out a compose button in our dashboard that lets you send notifications
          to your users. You can add multiple email addresses or external IDs. We have had
          some requests for sending notifications to a group or to all users, and if you'd
          like to see that, please let us know - we are looking for some feedback on this
          use case.
        </ChangelogEntry>
      </ul>
    </section>
  );
}
