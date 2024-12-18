import useInjectScript from './useInjectScript';

const useDropbox = () => {
  useInjectScript({
    url: 'https://www.dropbox.com/static/api/2/dropins.js',
    attributes: {
      id: 'dropboxjs',
      'data-app-key': 'b69j8k8d5t77avh', // TODO: replace with actual production app
    },
  });

  const openPicker = (options: Dropbox.ChooserOptions) => {
    if (!window.Dropbox) {
      return;
    }

    window.Dropbox.choose(options);
  };

  return { openPicker };
};

export default useDropbox;
