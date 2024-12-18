import axios from 'axios';
import { useState, useEffect, useRef } from 'react';

import useInjectScript from './useInjectScript';

import Configs from '@/configs';

type PickerConfig = {
  viewId?: google.picker.ViewId;
  viewMode?: google.picker.DocsViewMode;
  setIncludeFolders?: boolean;
  setSelectFolderEnabled?: boolean;
  supportSharedDrives?: boolean;
  multi?: boolean;
  mimeTypes?: string[];
  locale?: string;
  additionalViews?: google.picker.ViewId[];
};

type Props = {
  onFilePicked: (result: google.picker.ResponseObject) => void;
  onCancel?: () => void;
};

const useGoogleDrivePicker = (props: Props) => {
  const { onFilePicked, onCancel } = props;

  const [pickerApiLoaded, setPickerApiLoaded] = useState(false);

  const oauthTokenRef = useRef<string>();
  const pickerRef = useRef<google.picker.Picker>();
  const pickerConfigRef = useRef<PickerConfig>();

  const { loaded: gapiLoaded } = useInjectScript({
    url: 'https://apis.google.com/js/api.js',
  });
  const { loaded } = useInjectScript({
    url: 'https://accounts.google.com/gsi/client',
  });

  useEffect(() => {
    const loadApis = () => {
      gapi.load('picker', { callback: handlePickerApiLoaded });
    };

    if (gapiLoaded) {
      loadApis();
    }
  }, [gapiLoaded]);

  const handlePickerApiLoaded = () => {
    setPickerApiLoaded(true);
  };

  const handleAuth = () => {
    if (!loaded) {
      return;
    }

    const client = google.accounts.oauth2.initTokenClient({
      client_id: Configs.env.GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/drive',
      callback: (res) => {
        if (res && res.access_token) {
          oauthTokenRef.current = res.access_token;
          createPicker();
        }
      },
    });
    client.requestAccessToken();
  };

  const openPicker = (config?: PickerConfig) => {
    pickerConfigRef.current = config;

    if (!oauthTokenRef.current) {
      handleAuth();
      return;
    }

    createPicker();
  };

  const createPicker = () => {
    if (!pickerApiLoaded || !oauthTokenRef.current) {
      return;
    }

    const {
      viewId,
      viewMode,
      multi,
      supportSharedDrives,
      mimeTypes,
      locale = 'en-US',
      setIncludeFolders,
      setSelectFolderEnabled,
      additionalViews,
    } = pickerConfigRef.current || {};

    const view = new google.picker.DocsView(viewId);

    viewMode && view.setMode(viewMode);

    if (setIncludeFolders) {
      view.setIncludeFolders(true);
    }

    if (setSelectFolderEnabled) {
      view.setSelectFolderEnabled(true);
    }

    if (mimeTypes && mimeTypes.length > 0) {
      view.setMimeTypes(mimeTypes.join(','));
    }

    const picker = new google.picker.PickerBuilder()
      .setAppId(Configs.env.GOOGLE_APP_ID)
      .setOAuthToken(oauthTokenRef.current)
      .setDeveloperKey(Configs.env.GOOGLE_API_KEY)
      .setLocale(locale)
      .setCallback(handlePickerCallback)
      .addView(view);

    additionalViews?.forEach((view) => {
      const innerView = new google.picker.DocsView(view);

      picker.addView(innerView);
    });

    if (multi) {
      picker.enableFeature(google.picker.Feature.MULTISELECT_ENABLED);
    }

    if (supportSharedDrives) {
      picker.enableFeature(google.picker.Feature.SUPPORT_DRIVES);
    }

    const buildPicker = picker.build();
    buildPicker.setVisible(true);

    pickerRef.current = buildPicker;
  };

  const handlePickerCallback = (result: google.picker.ResponseObject) => {
    if (result.action === google.picker.Action.PICKED) {
      onFilePicked(result);

      pickerRef.current?.setVisible(false);
      pickerRef.current?.dispose();
      pickerRef.current = undefined;
    } else if (result.action === google.picker.Action.CANCEL) {
      pickerRef.current?.setVisible(false);
      pickerRef.current?.dispose();
      pickerRef.current = undefined;

      onCancel?.();
    }
  };

  const handleMakeDocumentShareable = async (
    document: google.picker.DocumentObject,
  ) => {
    if (!oauthTokenRef.current) {
      return;
    }

    await axios.post(
      `https://www.googleapis.com/drive/v3/files/${document.id}/permissions`,
      {
        role: 'reader',
        type: 'anyone',
      },
      {
        headers: {
          Authorization: `Bearer ${oauthTokenRef.current}`,
        },
      },
    );
  };

  return {
    openPicker,
    loaded: pickerApiLoaded,
    isLoggedIn: !!oauthTokenRef.current,
    handleMakeDocumentShareable,
  };
};

export default useGoogleDrivePicker;
