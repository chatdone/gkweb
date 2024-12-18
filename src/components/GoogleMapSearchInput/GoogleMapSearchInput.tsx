import { Input } from '@arco-design/web-react';
import type { RefInputType } from '@arco-design/web-react/es/Input/interface';
import { Wrapper } from '@googlemaps/react-wrapper';
import { useRef, useEffect, useState } from 'react';
import { MdSearch } from 'react-icons/md';

import config from '@/configs';

type Props = {
  value?: google.maps.places.PlaceResult;
  onChange?: (value: google.maps.places.PlaceResult) => void;
};

const GoogleMapSearchInput = (props: Props) => {
  const [stateValue, setValue] = useState(props.value);
  const value = props.value || stateValue || '';

  useEffect(() => {
    if (props.value !== stateValue && props.value === undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  const handleChange = (newValue: google.maps.places.PlaceResult) => {
    if (!('value' in props)) {
      setValue(newValue);
    }

    props.onChange?.(newValue);
  };

  if (!config.env.GOOGLE_API_KEY) {
    return null;
  }

  return (
    <Wrapper apiKey={config.env.GOOGLE_API_KEY} libraries={['places']}>
      <SearchInput onChange={handleChange} />
    </Wrapper>
  );
};

const SearchInput = ({ onChange }: Props) => {
  const inputRef = useRef<RefInputType>(null);
  const isInitRef = useRef<boolean>(false);

  useEffect(() => {
    if (!isInitRef.current && inputRef.current?.dom && window.google) {
      const options: google.maps.places.AutocompleteOptions = {
        fields: ['formatted_address', 'geometry', 'place_id'],
      };

      const searchBox = new window.google.maps.places.Autocomplete(
        inputRef.current.dom,
        options,
      );

      searchBox.addListener('place_changed', () => {
        const place = searchBox.getPlace();

        if (!place.geometry || !place.geometry.location) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          alert('Please select one from the search results');

          return;
        }

        onChange?.(place);
      });

      isInitRef.current = true;
    }
  }, [onChange]);

  return (
    <Input ref={inputRef} placeholder="Search Location" suffix={<MdSearch />} />
  );
};

export default GoogleMapSearchInput;
