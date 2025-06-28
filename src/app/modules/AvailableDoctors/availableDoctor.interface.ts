export type TAvailableDoctorFilterRequest = {
  searchTerm?: string;
  specializationId?: string;
  availableDate?: Date;
};
export type TAvailableDoctorFilterableFields =
  keyof TAvailableDoctorFilterRequest;
