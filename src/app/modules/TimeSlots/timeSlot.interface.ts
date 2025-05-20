export type TTimeSlotFilters = {
  searchTerm?: string;
  start_time?: string;
  end_time?: string;
};

export type TTimeSlotFilterableFields =
  | "searchTerm"
  | "start_time"
  | "end_time";
