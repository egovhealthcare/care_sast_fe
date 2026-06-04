import { lazy } from "react";
import routes from "./routes";

const manifest = {
  plugin: "care_sast",
  routes,
  extends: [],
  components: {},
  navItems: [],
  encounterTabs: {
    sastSubmissions: lazy(
      () => import("./components/sast-submission-encounter-tab/index")
    ),
  },
};

export default manifest;
