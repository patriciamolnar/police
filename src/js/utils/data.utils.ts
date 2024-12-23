import { PoliceData, PostcodeData } from "../_models";

export const getUrl = (postcode: string) => {
  return `https://api.postcodes.io/postcodes/${postcode}`;
};

export const getLatLong = async (
  postcode: string
): Promise<PostcodeData | null> => {
  const url = `https://api.postcodes.io/postcodes/${postcode}`;

  try {
    const data = await fetch(url);
    const json = await data.json();
    return json;
  } catch (error) {
    return null;
  }
};

export const getPoliceData = async (
  lat: number,
  long: number,
  month: number,
  year: number
): Promise<PoliceData | null> => {
  const url = `https://data.police.uk/api/stops-street?lat=${lat}&lng=${long}&date=${year}-${month}`;

  try {
    const data = await fetch(url);
    const json = await data.json();
    return json;
  } catch (error) {
    return null;
  }
};
