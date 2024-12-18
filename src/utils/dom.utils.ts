const buildForm = (params: { [key: string]: string }, url: string) => {
  const form = document.createElement('form');
  form.setAttribute('method', 'post');
  form.setAttribute('action', url);
  form.setAttribute('target', '_self');

  Object.entries(params).forEach(([key, value]) => {
    const input = document.createElement('input');
    input.setAttribute('type', 'hidden');
    input.setAttribute('name', key);
    input.setAttribute('value', value);
    form.appendChild(input);
  });

  return form;
};

const downloadFile = ({
  url,
  fileName,
}: {
  url: string;
  fileName?: string;
}) => {
  const link = document.createElement('a');
  link.setAttribute('href', url);

  fileName && link.setAttribute('download', fileName);

  document.body.append(link);

  link.click();

  link.remove();
};

export { buildForm, downloadFile };
