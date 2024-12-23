import { ERRORS } from "../_static";

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
