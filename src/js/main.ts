import { fetchResult } from "./api.utils";
import { formatData } from "./data-formatter.utils";
import {
  generateInfo,
  generateMap,
  setButtonState,
  updatePostcodeError,
} from "./dom-updater.utils";
import { State } from "./state.class";
import "./../css/styles.css";

// DOM elements
const map = document.querySelector("#map") as HTMLElement;
const canvas = document.querySelector("canvas") as HTMLCanvasElement;
const infoContainer = document.querySelector("#infoContainer") as HTMLElement;
const postcodeField = document.querySelector("#postcode");
const monthSelect = document.querySelector("#month");
const yearSelect = document.querySelector("#year");
const searchBtn = document.querySelector("#search") as HTMLButtonElement;
const errorDiv = document.querySelector("#error");

const title = document.querySelector("#title");
const otherRes = document.querySelector("#otherResolution");

const state = new State();

// initialising years
(() => {
  const date = new Date();
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();

  // only make current year available if it's march +
  const years = [];
  if (currentMonth > 2) {
    years.push(currentYear);
  } else {
    state.setYear(currentYear - 1);
  }

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

  // selecting month 3 months ago
  const twoMonthsAgo = new Date(currentYear, currentMonth - 2).getMonth();
  const newMonth = twoMonthsAgo + 1;
  const monthSelectValue = newMonth < 10 ? `0${newMonth}` : `${newMonth}`;
  const monthOption = monthSelect?.querySelector(
    `option[value='${monthSelectValue}']`
  ) as HTMLOptionElement;
  if (monthOption) {
    monthOption.selected = true;
  }
})();

const resetContainers = () => {
  if (!infoContainer) return;
  infoContainer.innerHTML = "";
  infoContainer.style.paddingBottom = "0";

  map.style.height = "0";
  title?.classList.add("hidden");
  otherRes?.classList.add("hidden");
  if (state.chart) state.chart.destroy();
};

const onSearch = async () => {
  if (state.isFirstEntry) {
    validatePostcode();
    state.isFirstEntry = false;
  }

  setButtonState(searchBtn, "Loading...");
  resetContainers();

  const data = await fetchResult(state, errorDiv, postcodeField);
  if (data) {
    const formattedData = formatData(data);
    generateMap(formattedData, state, canvas, map);
    generateInfo(formattedData, infoContainer);
    title?.classList.remove("hidden");
    otherRes?.classList.remove("hidden");
  }

  searchBtn.blur();
  setButtonState(searchBtn, "Search");
};

const validatePostcode = () => {
  const isValidPostcode = !!state.getPostcode();
  updatePostcodeError(errorDiv, postcodeField, isValidPostcode);

  if (!isValidPostcode) {
    searchBtn?.setAttribute("disabled", "true");
  } else {
    searchBtn?.removeAttribute("disabled");
  }
};

// event listeners
document.body.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.documentElement.classList.remove("no-focus-outline");
  }
});

postcodeField?.addEventListener("input", (e) => {
  state.setPostcode((e.target as HTMLInputElement).value);

  if (!state.isFirstEntry) {
    validatePostcode();
  }
});

monthSelect?.addEventListener("change", (e) => {
  state.setMonth((e.target as HTMLSelectElement).value);
});

yearSelect?.addEventListener("change", (e) => {
  state.setYear((e.target as HTMLSelectElement).value);
});

searchBtn?.addEventListener("click", onSearch);
searchBtn?.addEventListener("tap", onSearch);
