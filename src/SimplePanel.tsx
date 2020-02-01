import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';

interface Props extends PanelProps<SimpleOptions> {}

import { Map as LeafletMap, GeoJSON, TileLayer } from 'react-leaflet';

import 'leaflet/dist/leaflet.css';
import { LineString } from 'geojson';
import { LatLngBounds } from 'leaflet';

export class SimplePanel extends PureComponent<Props> {
  render() {
    const points: LineString = {
      type: 'LineString',
      coordinates: [],
    };

    let i;
    const positions = this.props.data.series[0].fields[1].values;
    let minLat = 90
    let maxLat = -90
    let minLng = 180
    let maxLng = -180
    for (i = 0; i < positions.length; i++) {
      const point = positions.get(i);
      if (point !== null) {
        minLat = Math.min(minLat, point[1])
        minLng = Math.min(minLng, point[0])
        maxLat = Math.max(maxLat, point[1])
        maxLng = Math.max(maxLng, point[0])
        points.coordinates.push(point);
      }
    }

    const bounds = new LatLngBounds([minLat, minLng], [maxLat, maxLng])
    return (
      <LeafletMap bounds={bounds} style={{width:'100%', height:'100%'}} >
        <TileLayer url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'} minZoom={0} maxZoom={20} />
        <TileLayer url={'https://signalk-stash.chacal.fi/map/v1/{z}/{x}/{y}.png'} minZoom={8} maxZoom={15} />
        <TileLayer
          url={'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'}
          minZoom={16}
          maxNativeZoom={20}
          maxZoom={21}
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
        />
        <TileLayer url={'https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png'} minZoom={16} maxZoom={21} maxNativeZoom={18} />
        <GeoJSON data={points} />
      </LeafletMap>
    );
  }
}
