export const updateError = (
  errorDiv: Element | null,
  element: Element | null,
  message: string,
  isValid: boolean
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
