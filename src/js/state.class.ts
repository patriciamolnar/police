import Chart from "chart.js/auto";
export class State {
  isFirstEntry = true;
  chart: Chart<"bar", number[], string> | null = null;

  #POSTCODE_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1}[0-9]{1,2}[A-Z]{2}$/i;
  #postcode: string = "";
  #month: string = "01";
  #year: number = new Date().getFullYear();

  getPostcode() {
    return this.#postcode;
  }
  setPostcode(postcode: string) {
    const cleanedPostcode = postcode.replace(/\s/g, "");

    if (cleanedPostcode.match(this.#POSTCODE_REGEX)) {
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
  setYear(year: string | number) {
    let _year: number;

    if (typeof year === "string") {
      const y = parseInt(year);
      if (!y) return;
      _year = y;
    } else {
      _year = year;
    }

    const currentYear = new Date().getFullYear();
    if (currentYear - _year > 3) return;
    this.#year = _year;
  }
}
