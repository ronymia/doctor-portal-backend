export type IPatientFilterRequest = {
  searchTerm?: string;
  email?: string;
};

export type TPatientFilterableFields = keyof IPatientFilterRequest;
