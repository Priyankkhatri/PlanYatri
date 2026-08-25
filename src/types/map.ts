export interface MapCoordinate {
  lat: number;
  lng: number;
}

export interface MapMarker {
  id: string;
  title: string;
  position: MapCoordinate;
  category?: string;
}
