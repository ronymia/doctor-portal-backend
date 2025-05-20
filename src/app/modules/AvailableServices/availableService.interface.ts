export type TAvailableServiceFilters = {
  searchTerm?: string;
  start_time?: string;
  end_time?: string;
};

export type TAvailableServiceFilterableFields =
  | "searchTerm"
  | "start_time"
  | "end_time";
