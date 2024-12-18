export const Base64URLObject = ({
  base64str,
  contentType,
}: {
  base64str: string;
  contentType: string;
}) => {
  const sliceSize = 512;
  // decode base64 string, remove space for IE compatibility

  const byteCharacters = atob(base64str);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  // create the blob object with content-type "application/pdf"
  const blob = new Blob(byteArrays, { type: contentType });
  const url = URL.createObjectURL(blob);
  return url;
};
