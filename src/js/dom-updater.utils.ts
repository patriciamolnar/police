import Chart from "chart.js/auto";
import { FormattedData } from "./models";
import { COLORS, ERRORS, LABEL_DESCRIPTIONS } from "./static";
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
    errorDiv.innerHTML = `<span class='background'><span class='exclaim'>!</span>&nbsp;${message}</span>`;
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
    errorDiv.innerHTML = `<span class='background'><span class='exclaim'>!</span>&nbsp;${message}</span>`;
  }
};

export const setButtonState = (button: Element | null, buttonText: string) => {
  if (!button) return;

  button.textContent = buttonText;
};

export const generateMap = (
  data: FormattedData,
  state: State,
  canvas: HTMLCanvasElement,
  map: HTMLElement
) => {
  if (!data || !canvas || !map) return;

  map.style.height = "500px";

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
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: "#FFFFFF",
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: { color: "#FFFFFF" },
          grid: { color: "#274e72" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#FFFFFF" },
          grid: { color: "#274e72" },
        },
      },
    },
  });
};

export const generateInfo = (
  data: FormattedData,
  infoContainer: HTMLElement | null
) => {
  if (!infoContainer) return;
  infoContainer.innerHTML = "";
  infoContainer.style.paddingBottom = "0";
  const names = data[0];

  names.forEach((name, i) => {
    const div = document.createElement("div");
    div.classList.add("infoDiv");

    let description = "";
    const desc = LABEL_DESCRIPTIONS[name as keyof typeof LABEL_DESCRIPTIONS];
    if (desc) {
      description = desc;
    }

    const content =
      '<p class="title">' +
      name +
      "</p>" +
      '<p><span class="square" style="background-color:' +
      COLORS[0] +
      '"></span>&nbspNumber of Stops and Searches: ' +
      data[1][i] +
      "</p>" +
      '<p><span class="square" style="background-color:' +
      COLORS[1] +
      '"></span>&nbspNumber of Arrest:  ' +
      data[2][i] +
      "</p>" +
      '<p><span class="square" style="background-color:' +
      COLORS[2] +
      '"></span>&nbspNumber of Other Resolutions: ' +
      data[3][i] +
      "</p>" +
      '<p class="description">' +
      description +
      "</p>";

    div.innerHTML = content;
    infoContainer.appendChild(div);
    infoContainer.style.paddingBottom = "2rem";
  });
};
