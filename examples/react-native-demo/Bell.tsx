import { useNotifications } from "@magicbell/react-headless";
import React from "react";
import { View, Text } from "react-native";

/**
 * Component that shows the number of unseen notifications.
 *
 * Uses the `useNotifications` hook to fetch the counter from MagicBell.
 */
function Bell({ color }) {
  const { unreadCount } = useNotifications();

  return (
    <View>
      <Text
        style={{
          position: "absolute",
          backgroundColor: "rgb(223, 71, 89)",
          padding: 4,
          color: "white",
          borderRadius: 3,
          right: -2,
          top: -4,
        }}
      >
        {unreadCount === 1 ? '1 new notification' : `${unreadCount} new notifications`}
      </Text>
    </View>
  );
}

export default Bell;
