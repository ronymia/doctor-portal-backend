export type TAppointmentFilters = {
  searchTerm?: string;
  specialization?: string;
  status?: string;
};

export type TAppointmentFilterableFields = keyof TAppointmentFilters;
