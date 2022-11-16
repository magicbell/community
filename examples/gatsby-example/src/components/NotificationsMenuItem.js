import { useNotifications } from "@magicbell/react-headless";
import { Link } from "gatsby";
import * as React from "react";

export default function NotificationsMenuItem() {
  const store = useNotifications();

  return (
    <Link
      to="/notifications"
      className="group rounded-md py-2 px-2 flex items-center text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
    >
      <span className="flex-1">Notifications </span>
      <span className="ml-2">{store.total}</span>
    </Link>
  );
}
