import MagicBell, { FloatingNotificationInbox } from '@magicbell/magicbell-react';
import React from 'react';
import HighlightedCode from '../code/HighlightedCode';

interface Props {
  code: string;
  floatingNotificationInboxProps?: { [key: string]: string };
  magicBellProps?: { [key: string]: string };
}

export default function NotificationInboxPreview({
  code,
  magicBellProps = {},
  floatingNotificationInboxProps = {},
}: Props) {
  return (
    <div className="w-full rounded-md relative z-0 mb-4 bg-gray-100">
      <div className="py-3 px-4 rounded-t-md font-mono text-xs uppercase text-gray-700 border-b border-white font-bold">
        Preview
      </div>
      <div className="p-4 md:p-8 h-full flex flex-wrap xl:flex-nowrap">
        <div className="w-full lg:w-1/3" style={{ minHeight: '470px' }}>
          <div className="inline-block ml-6 bg-white p-4 rounded shadow-inner">
            {typeof window === 'undefined' ? null : (
              <MagicBell
                apiKey="MAGICBELL_API_KEY"
                userEmail="jon@example.com"
                serverURL="/docs/api/magicbell"
                defaultIsOpen
                {...magicBellProps}
              >
                {(props) => (
                  <FloatingNotificationInbox
                    height={400}
                    width={500}
                    placement="bottom-start"
                    closeOnClickOutside={false}
                    layout={['header', 'content']}
                    popperOptions={{
                      modifiers: [
                        {
                          name: 'offset',
                          options: {
                            offset: [-42, 30],
                          },
                        },
                      ],
                    }}
                    {...floatingNotificationInboxProps}
                    {...props}
                  />
                )}
              </MagicBell>
            )}
          </div>
        </div>
        <div className="w-full mt-8 -mb-4 lg:mt-0 lg:w-2/3">
          {code && (
            <HighlightedCode className="language-jsx" hideHeader>
              {code}
            </HighlightedCode>
          )}
        </div>
      </div>
    </div>
  );
}
