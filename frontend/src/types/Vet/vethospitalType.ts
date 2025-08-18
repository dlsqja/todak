export interface HospitalDetail {
  hospitalId: number;
  name: string;
  profile: string;
  location: string;
  contact: string;
}

export interface HospitalUpdateRequest {
  name?: string;
  profile?: string;
  location?: string;
  contact?: string;
}
