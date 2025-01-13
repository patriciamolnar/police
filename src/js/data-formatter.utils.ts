import { FormattedData, PoliceData } from "./models";

export const formatData = (data: PoliceData[]) => {
  const reducedData = reduceData(data);
  const xAxis = sortDataForX(reducedData);
  const yAxis = sortDataForY(reducedData, xAxis);
  const merged = mergingStolenGood(yAxis);
  const renamed = renameLabels(merged);
  return renamed;
};

const reduceData = (data: PoliceData[]) => {
  return data.map((item) => [item.object_of_search, item.outcome_object.name]);
};

//getting x-Axis values & setting up y values.
const sortDataForX = (data: string[][]) => {
  const result: FormattedData = [[], [], [], []];

  data.forEach((item) => {
    if (!result[0].includes(item[0])) {
      result[0][result[0].length] = item[0];

      //filling y-Axis arrays with 0s for future calculations.
      result[1][result[1].length] = 0;
      result[2][result[2].length] = 0;
      result[3][result[3].length] = 0;
    }
  });

  return result;
};

const sortDataForY = (data: string[][], result: FormattedData) => {
  data.forEach((item) => {
    const index = result[0].indexOf(item[0]);
    result[1][index]++;

    if (/arrest/i.test(item[1])) {
      result[2][index]++;
    }

    if (!/arrest/i.test(item[1]) && !/no further action/i.test(item[1])) {
      result[3][index]++;
    }
  });

  return result;
};

const mergingStolenGood = (result: FormattedData) => {
  const indexOfEvidence = result[0].indexOf(
    "Evidence of offences under the Act"
  );

  if (indexOfEvidence != -1) {
    const indexOfTheaft = result[0].indexOf("Stolen goods");

    //remove "Evidence of offences under the Act" from x axis
    result[0].splice(indexOfEvidence, 1);

    //update "Stolen goods" values by adding "Evidence of offences under the Act" values
    for (let i = 1; i <= 3; i++) {
      const totalOfEvidence = result[i][indexOfEvidence] as number;
      const totalOfTheaft = result[i][indexOfTheaft] as number;
      result[i][indexOfTheaft] = totalOfEvidence + totalOfTheaft;
      result[i].splice(indexOfEvidence, 1);
    }
  }

  return result;
};

const renameLabels = (result: FormattedData) => {
  const labels = result[0].map((item) => {
    if (item == null) {
      return "Other**";
    } else if (item == "Firearms") {
      return "Guns";
    } else if (item == "Anything to threaten or harm anyone") {
      return "Threatening conduct";
    } else if (item == "Articles for use in criminal damage") {
      return "Criminal damage";
    } else if (item == "Goods on which duty has not been paid etc.") {
      return "Duty not paid";
    }

    return item;
  });

  result[0] = labels;

  return result;
};
