export type Coordinates = {
  latitude?: string;
  longitude?: string;
};

export interface Source extends Coordinates {
  id?: number;
  source: string;
  balangay?: string;
  purok?: string;
}

export interface Balangay extends Coordinates {
  id?: number;
  balangay: string;
  source_id?: number;
  date_added?: string;
  source?: string | null;
}

export interface Purok extends Coordinates {
  id?: number;
  purok: string;
  balangay_id?: number;
  source_id?: number;
  date_added?: string;
  balangay_name?: string;
  source_name?: string;
}

export interface Sheet extends Coordinates {
  id?: number;
  sheet_name: string;
  source_id?: number;
  date_added?: string;
  source_name?: string;
}
