import Chart from "chart.js/auto";
import { FormattedData } from "../_models";
import { COLORS, ERRORS } from "../_static";

export const updatePostcodeError = (
  errorDiv: Element | null,
  element: Element | null,
  isValid: boolean,
  message = ERRORS.postcode
) => {
  if (!element || !errorDiv) return;

  if (isValid) {
    element.classList.remove("error");
    element.classList.remove("error-border");
    errorDiv.textContent = "";
  } else {
    element.classList.add("error");
    element.classList.add("error-border");
    errorDiv.innerHTML = `<span class='background'><span class='exclaim'>!</span>${message}</span>`;
  }
};

export const updateError = (
  errorDiv: Element | null,
  message: string,
  isValid: boolean
) => {
  if (!errorDiv) return;

  if (isValid) {
    errorDiv.textContent = "";
  } else {
    errorDiv.innerHTML = `<span class='background'><span class='exclaim'>!</span>${message}</span>`;
  }
};

export const setButtonState = (button: Element | null, buttonText: string) => {
  if (!button) return;

  button.textContent = buttonText;
};

export const displayMap = (data: FormattedData) => {
  if (!data) return;

  const canvas = document.getElementById("mapContainer") as HTMLCanvasElement;

  if (window.innerWidth < 900) {
    canvas.height = 500;
  }

  new Chart(canvas, {
    type: "bar",
    data: {
      labels: data[0],
      datasets: [
        {
          label: "# of Searches",
          data: data[1],
          backgroundColor: COLORS,
        },
        {
          label: "# of arrests",
          data: data[2],
          backgroundColor: COLORS,
        },
        {
          label: "# of other resolutions",
          data: data[3],
          backgroundColor: COLORS,
        },
      ],
    },
  });
};
