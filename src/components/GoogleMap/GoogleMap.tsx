import { Spin, Typography } from '@arco-design/web-react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { isEqual } from 'lodash-es';
import {
  ReactElement,
  useRef,
  useEffect,
  useState,
  Children,
  ReactNode,
  isValidElement,
  cloneElement,
} from 'react';

import { useGeolocation } from '@/hooks';

import config from '@/configs';

type Props = {
  markers?: google.maps.LatLngLiteral[];
  center?: google.maps.LatLngLiteral;
};

const GoogleMap = (props: Props) => {
  const { markers, center: centerProp } = props;

  const { currentPosition } = useGeolocation();

  const [zoomLevel, setZoomLevel] = useState<number>(6);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 4.5496098,
    lng: 103.4949032,
  });

  useEffect(() => {
    if (currentPosition && !centerProp) {
      setCenter(currentPosition);
      setZoomLevel(18);
    }
  }, [currentPosition, centerProp]);

  useEffect(() => {
    if (centerProp) {
      setCenter(centerProp);
      setZoomLevel(18);
    }
  }, [centerProp]);

  if (!config.env.GOOGLE_API_KEY) {
    return null;
  }

  const renderStatus = (status: Status): ReactElement => {
    if (status === Status.LOADING) {
      return <Spin />;
    }
    if (status === Status.FAILURE) {
      return <Typography.Text>Failed to load Google Maps</Typography.Text>;
    }

    return <div />;
  };

  const handleIdle = (map: google.maps.Map) => {
    const zoomLevel = map.getZoom();
    zoomLevel && setZoomLevel(zoomLevel);

    const center = map.getCenter();
    center && setCenter(center.toJSON());
  };

  return (
    <div style={{ height: '100%' }}>
      <Wrapper
        apiKey={config.env.GOOGLE_API_KEY}
        render={renderStatus}
        libraries={['places']}
      >
        <Map zoom={zoomLevel} center={center} onIdle={handleIdle}>
          {markers?.map((position, index) => (
            <Marker key={index} position={position} />
          ))}
          {centerProp && <Marker position={centerProp} />}
        </Map>
      </Wrapper>
    </div>
  );
};

const Map = (
  props: {
    children?: ReactNode;
    zoom: number;
    center: google.maps.LatLngLiteral;
    onIdle?: (map: google.maps.Map) => void;
  } & google.maps.MapOptions,
) => {
  const { children, onIdle, ...options } = props;

  const [map, setMap] = useState<google.maps.Map>();

  const mapRef = useRef<HTMLDivElement>(null);
  const previousOptions = useRef<unknown>();

  useEffect(() => {
    if (mapRef.current && !map) {
      setMap(
        new window.google.maps.Map(mapRef.current, {
          center: props.center,
        }),
      );
    }
  }, [mapRef, map]);

  useEffect(() => {
    if (map && !isEqual(previousOptions.current, options)) {
      map.setOptions(options);

      previousOptions.current = options;
    }
  }, [map, options]);

  useEffect(() => {
    let idleListener: google.maps.MapsEventListener;

    if (map) {
      if (onIdle) {
        idleListener = map.addListener('idle', () => onIdle(map));
      }
    }

    return () => {
      if (map) {
        if (onIdle && idleListener) {
          google.maps.event.removeListener(idleListener);
        }
      }
    };
  }, [map, onIdle]);

  return (
    <>
      <div style={{ height: '100%' }} ref={mapRef} />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          // @ts-ignore
          return cloneElement(child, { map });
        }
      })}
    </>
  );
};

const Marker = (props: google.maps.MarkerOptions) => {
  const [marker, setMarker] = useState<google.maps.Marker>();

  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  useEffect(() => {
    if (marker) {
      marker.setOptions(props);
    }
  }, [marker, props]);

  return null;
};

export default GoogleMap;
