import ArrowLeftIcon from '@heroicons/react/outline/ArrowLeftIcon';
import { NextRouter } from 'next/router';

export default function PageHeadingMenu(props: {
  currentPageName: string;
  router: NextRouter;
  currentPagePath: string;
}) {
  const { router } = props;
  const previousPagePath = props.currentPagePath.split('/').slice(-2, -1)[0];
  const path = [router.basePath, `/${previousPagePath}`].filter(Boolean).join('');
  const baseURL = process.env.NEXT_STATIC_BASE_URL || 'https://www.magicbell.com';

  return (
    <div className="flex items-center py-5">
      <button
        className="bg-bgDefault px-2 py-2 rounded hover:bg-bgHover"
        onClick={() => router.push(new URL(path, baseURL))}
      >
        <ArrowLeftIcon className="h-4 w-4 text-white" />
      </button>
      <h3 className="md:text-base font-semibold text-textHighlight pl-3">
        {props.currentPageName}
      </h3>
    </div>
  );
}
