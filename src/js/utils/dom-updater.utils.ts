import Chart from "chart.js/auto";
import { FormattedData } from "../_models";
import { COLORS, ERRORS } from "../_static";
import { State } from "./state.class";

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

export const displayMap = (
  data: FormattedData,
  state: State,
  canvas: HTMLCanvasElement
) => {
  if (!data || !canvas) return;

  if (state.chart) state.chart.destroy();

  if (window.innerWidth > 900) {
    canvas.height = 500;
  }

  state.chart = new Chart(canvas, {
    type: "bar",
    data: {
      labels: data[0],
      datasets: [
        {
          label: "# of Searches",
          data: data[1],
          backgroundColor: COLORS[0],
          borderWidth: 1,
        },
        {
          label: "# of arrests",
          data: data[2],
          backgroundColor: COLORS[1],
          borderWidth: 1,
        },
        {
          label: "# of other resolutions",
          data: data[3],
          backgroundColor: COLORS[2],
          borderWidth: 1,
        },
      ],
    },
    options: {
      indexAxis: "y",
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
        },
      },
    },
  });
};
