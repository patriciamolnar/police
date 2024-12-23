export interface PostcodeData {
  latitude: number;
  longitude: number;
}

export interface PoliceData {
  age_range: string;
  datetime: string;
  gender: string | null;
  involved_person: boolean;
  legislation: string;
  location: PoliceDataLocation[];
  object_of_search: string;
  officer_defined_ethnicity: string | null;
  operation: boolean | null;
  operation_name: string | null;
  outcome: string;
  outcome_linked_to_object_of_search: boolean | null;
  outcome_object: OutcomeObject;
  removal_of_more_than_outer_clothing: boolean | null;
  self_defined_ethnicity: string;
  type: string;
}

interface PoliceDataLocation {
  latitude: string;
  longitude: string;
  street: {
    id: number;
    name: string;
  };
}

interface OutcomeObject {
  id: string; //todo: hardcode types?
  name: string;
}
