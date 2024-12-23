import { updateError } from "./utils/dom-updater";
import { State } from "./utils/validators.utils";

// initialising years
(() => {
  const currentYear = new Date().getFullYear();
  const years = [currentYear];

  for (let i = 1; i <= 3; i++) {
    years.push(currentYear - i);
  }

  const yearSelect = document.querySelector("#year");
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

// DOM elements
const mapContainer = document.querySelector("#mapContainer");
const infoContainer = document.querySelector("#infoContainer");
const postcodeField = document.querySelector("#postcode");
const errorDiv = document.querySelector("#error");
const searchBtn = document.querySelector("#search");

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
  updateError(errorDiv, postcodeField, "Invalid postcode", isValidPostcode);
});

searchBtn?.addEventListener("click", (e) => {
  e.preventDefault();
});

// const queryData = async () => {};
