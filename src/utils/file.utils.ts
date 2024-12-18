import bytes from 'bytes';

const isValidFileSize = (file: File) => {
  const isVideo = file.type.includes('video');
  if (isVideo) {
    const limit = bytes('50MB');

    if (file.size > limit) {
      return Promise.reject(
        'The file exceed the max file size allowed. Max file size allowed for video is 50MB',
      );
    }
  }

  return true;
};

export { isValidFileSize };
