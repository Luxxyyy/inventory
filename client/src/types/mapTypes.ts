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
}

export interface Purok extends Coordinates {
  id?: number;
  purok: string;
}
