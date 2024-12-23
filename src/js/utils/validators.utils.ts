const POSTCODE_REGEX = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]{0,1}[0-9]{1,2}[A-Z]{2}$/i;

export class State {
  #postcode: string = "";
  #month: string = "01";
  #year: number = new Date().getFullYear();

  setPostcode(postcode: string) {
    if (postcode.match(POSTCODE_REGEX)) {
      this.#postcode = postcode;
      return true;
    } else {
      return false;
    }
  }
}
