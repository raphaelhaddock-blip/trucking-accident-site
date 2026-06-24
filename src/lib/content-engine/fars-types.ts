/** Shape of a city record in scripts/city-accident-data.json (FARS-derived). */
export interface FarsCity {
  slug: string;
  name: string;
  stateSlug?: string;
  stateName?: string;
  population?: number;
  truckFatalities?: number;
  fatalCrashes?: number;
  dataYear?: number;
  dangerousRoads?: string[];
  sourceUrl?: string;
  lat?: number;
  lng?: number;
  countyName?: string;
}
