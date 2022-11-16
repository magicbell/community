import * as React from "react";
import Layout from "./src/components/Layout";
import "./src/styles/global.css";

export const wrapPageElement = ({ element, props }) => (
  <Layout {...props}>{element}</Layout>
);
