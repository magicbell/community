import * as React from "react";
import Layout from "./src/components/Layout";

export const onRenderBody = ({ setBodyAttributes }, pluginOptions) => {
  setBodyAttributes({
    className: "h-full",
  });
};

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);
