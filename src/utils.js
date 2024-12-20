import { fetchChangelog, parseChangelog } from "./utils/fetchChangelog.js";
import { loadPage } from "./utils/loadPage.js";
import { tooltip } from "./utils/tooltip.js";
import {
  getUnload,
  refWithoutUnload,
  reloadWithoutUnload,
  setUnload,
} from "./utils/closeUtils.js";

export const Utils = {
  fetchChangelog,
  loadPage,
  tooltip,
  getUnload,
  reloadWithoutUnload,
  refWithoutUnload,
  setUnload,
  parseChangelog,
};
