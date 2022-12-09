import ArrowLeftIcon from '@heroicons/react/outline/ArrowLeftIcon';
import { NextRouter } from 'next/router';

// TODO : make it work for arbitrary nesting
export default function PageHeadingMenu(props: {
  currentPageName: string;
  router: NextRouter;
}) {
  const { router } = props;
  /* const path = [router.basePath, router.asPath].filter(Boolean).join(''); */
  /* const baseURL = process.env.NEXT_STATIC_BASE_URL || 'https://www.magicbell.com'; */
  // TODO : replace the baseUrl after development
  const baseURL = 'http://localhost:3000';

  return (
    <div className="flex items-center py-5">
      <button
        className="bg-bgDefault px-2 py-2 rounded hover:bg-bgHover"
        onClick={() => router.push(new URL(router.basePath, baseURL))}
      >
        <ArrowLeftIcon className="h-4 w-4 text-white" />
      </button>
      <h3 className="md:text-base font-semibold text-textHighlight pl-3">
        {props.currentPageName}
      </h3>
    </div>
  );
}
