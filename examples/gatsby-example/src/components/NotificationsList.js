import { useNotifications } from "@magicbell/react-headless";
import * as React from "react";

export default function NotificationsList() {
  const store = useNotifications();

  return (
    <ul className="divide-y">
      {store.notifications.map((notification) => (
        <li key={notification.id} className="p-2">
          {notification.title}
        </li>
      ))}
    </ul>
  );
}
