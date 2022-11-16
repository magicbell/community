import { MagicBellProvider } from "@magicbell/react-headless";
import { Link } from "gatsby";
import * as React from "react";
import NotificationsMenuItem from "./NotificationsMenuItem";

const navigation = [
  { name: "Dashboard", href: "/", current: false },
  { name: "Team", href: "/team", current: false },
  { name: "Projects", href: "/projects", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  return (
    <MagicBellProvider
      apiKey="df24a28e8921181f6c4220fc306ba76701592d21"
      userEmail="josue@magicbell.io"
    >
      <div>
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
          <div className="border-r border-gray-200 pt-5 flex flex-col flex-grow bg-white overflow-y-auto">
            <div className="flex-grow mt-5 flex flex-col">
              <nav className="flex-1 px-2 pb-4 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                      "group rounded-md py-2 px-2 flex items-center text-sm font-medium"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                <NotificationsMenuItem />
              </nav>
            </div>
          </div>
        </div>

        <div className="md:pl-64">
          <div className="max-w-4xl mx-auto flex flex-col md:px-8 xl:px-0">
            <main className="flex-1">
              <div className="py-6">{children}</div>
            </main>
          </div>
        </div>
      </div>
    </MagicBellProvider>
  );
}
