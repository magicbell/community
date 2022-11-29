import React from "react";
import ReactDOM from "react-dom";
import MagicBell, {
  FloatingNotificationInbox,
} from "@magicbell/magicbell-react";

const theme = {
  icon: { borderColor: "#5225C1", width: "24px" },
  unseenBadge: { backgroundColor: "#F80808" },
};

/**
 * You can use userExternalId instead of the userEmail - https://bit.ly/3oiDSAe
 */
ReactDOM.render(
  <MagicBell
    apiKey="74ef9cfa81a890814732b624c2664cfefeaa63d0"
    userEmail="stephan@magicbell.io"
    theme={theme}
    locale="en"
  >
    {(props) => (
      <FloatingNotificationInbox width={400} height={500} {...props} />
    )}
  </MagicBell>,
  document.body
);
