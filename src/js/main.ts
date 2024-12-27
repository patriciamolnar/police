import { fetchResult } from "./utils/api.utils";
import { formatData } from "./utils/data-formatter.utils";
import {
  generateInfo,
  generateMap,
  setButtonState,
  updatePostcodeError,
} from "./utils/dom-updater.utils";
import { State } from "./utils/state.class";
import "./../css/styles.css";

// DOM elements
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const infoContainer = document.querySelector("#infoContainer") as HTMLElement;
const postcodeField = document.querySelector("#postcode");
const monthSelect = document.querySelector("#month");
const yearSelect = document.querySelector("#year");
const searchBtn = document.querySelector("#search");
const errorDiv = document.querySelector("#error");

const title = document.querySelector("#title");
const otherRes = document.querySelector("#otherResolution");

// initialising years
(() => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear];

  for (let i = 1; i <= 3; i++) {
    years.push(currentYear - i);
  }

  if (!yearSelect) return;

  years.forEach((year) => {
    const option = document.createElement("option");
    const yearStr = year.toString();
    option.value = yearStr;
    option.text = yearStr;
    yearSelect.appendChild(option);
  });
})();

const state = new State();

const resetContainers = () => {
  if (!infoContainer) return;
  infoContainer.innerHTML = "";

  title?.classList.add("hidden");
  otherRes?.classList.add("hidden");
};

const onSearch = async () => {
  setButtonState(searchBtn, "Loading...");
  resetContainers();
  const data = await fetchResult(state, errorDiv, postcodeField);
  if (data) {
    const formattedData = formatData(data);
    generateMap(formattedData, state, canvas);
    generateInfo(formattedData, infoContainer);
    title?.classList.remove("hidden");
    otherRes?.classList.remove("hidden");
  }
  setButtonState(searchBtn, "Search");
  //remove focus from button
};

// event listeners
//todo: is there a better way to do this?
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.documentElement.classList.remove("no-focus-outline");
  }
});

postcodeField?.addEventListener("blur", (e) => {
  const isValidPostcode = state.setPostcode(
    (e.target as HTMLInputElement).value
  );
  updatePostcodeError(errorDiv, postcodeField, isValidPostcode);
});

monthSelect?.addEventListener("change", (e) => {
  state.setMonth((e.target as HTMLSelectElement).value);
});

yearSelect?.addEventListener("change", (e) => {
  state.setYear((e.target as HTMLSelectElement).value);
});

searchBtn?.addEventListener("click", onSearch);
searchBtn?.addEventListener("tap", onSearch);
