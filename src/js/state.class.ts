import Chart from "chart.js/auto";

const POSTCODE_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1}[0-9]{1,2}[A-Z]{2}$/i;

export class State {
  #postcode: string = "";
  #month: string = "01";
  #year: number = new Date().getFullYear();
  isFirstEntry = true;

  chart: Chart<"bar", number[], string> | null = null;

  getPostcode() {
    return this.#postcode;
  }
  setPostcode(postcode: string) {
    const cleanedPostcode = postcode.replace(/\s/g, "");

    if (cleanedPostcode.match(POSTCODE_REGEX)) {
      this.#postcode = postcode;
    }
  }

  getMonth() {
    return this.#month;
  }
  setMonth(monthStr: string) {
    const month = parseInt(monthStr);
    if (month < 1 || month > 12) return;

    this.#month = monthStr;
  }

  getYear() {
    return this.#year;
  }
  setYear(yearStr: string) {
    const year = parseInt(yearStr);
    const currentYear = new Date().getFullYear();
    if (currentYear - year > 3) return;
    this.#year = year;
  }
}
