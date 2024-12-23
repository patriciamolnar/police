import { PoliceData, PostcodeData } from "../_models";
import { ERRORS } from "../_static";
import { updateError, updatePostcodeError } from "./dom-updater.utils";
import { State } from "./state.class";

const getLatLong = async (postcode: string): Promise<PostcodeData | null> => {
  const url = `https://api.postcodes.io/postcodes/${postcode}`;

  try {
    const data = await fetch(url);
    const json = await data.json();
    const { latitude, longitude } = json.result;
    return { latitude, longitude };
  } catch (error) {
    return null;
  }
};

const getPoliceData = async (
  loc: PostcodeData,
  state: State
): Promise<PoliceData[] | null> => {
  const url = `https://data.police.uk/api/stops-street?lat=${
    loc.latitude
  }&lng=${loc.longitude}&date=${state.getYear()}-${state.getMonth()}`;

  try {
    const data = await fetch(url);
    const json = await data.json();
    return json;
  } catch (error) {
    return null;
  }
};

export const fetchResult = async (
  state: State,
  errorDiv: Element | null,
  postcodeField: Element | null
) => {
  const location = await getLatLong(state.getPostcode());
  if (!location) {
    updatePostcodeError(errorDiv, postcodeField, false);
    return;
  }

  const searches = await getPoliceData(location, state);
  if (!searches) {
    updateError(errorDiv, ERRORS.no_data_for_date, false);
  } else if (searches.length === 0) {
    updateError(errorDiv, ERRORS.no_data_for_postcode, false);
  } else {
    updateError(errorDiv, "", true);
  }

  return searches;
};
