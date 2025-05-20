export type TUserFilters = {
  searchTerm?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  status?: string;
};

export type TUserFilterableFields =
  | "searchTerm"
  | "email"
  | "phone_number"
  | "role"
  | "status";
