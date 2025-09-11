declare module 'supercluster' {
  import { GeoJsonProperties, Geometry, Feature } from 'geojson';

  export interface ClusterProperties extends GeoJsonProperties {
    cluster: true;
    cluster_id: number;
    point_count: number;
    point_count_abbreviated: string | number;
  }

  export interface SuperclusterOptions {
    minZoom?: number;
    maxZoom?: number;
    radius?: number;
    extent?: number;
    nodeSize?: number;
    log?: boolean;
    map?: (props: GeoJsonProperties) => GeoJsonProperties;
    reduce?: (
      accum: GeoJsonProperties,
      props: GeoJsonProperties
    ) => void;
  }

  export default class Supercluster<
    P extends GeoJsonProperties = GeoJsonProperties,
    C extends ClusterProperties = ClusterProperties
  > {
    constructor(options?: SuperclusterOptions);
    load(points: Array<Feature<Geometry, P>>): void;
    getClusters(
      bbox: [number, number, number, number],
      zoom: number
    ): Array<Feature<Geometry, P | C>>;
    getChildren(clusterId: number): Array<Feature<Geometry, P | C>>;
    getLeaves(
      clusterId: number,
      limit?: number,
      offset?: number
    ): Array<Feature<Geometry, P>>;
    getTile(
      zoom: number,
      x: number,
      y: number
    ): {
      features: Array<Feature<Geometry, P | C>>;
    };
    getClusterExpansionZoom(clusterId: number): number;
  }
}
