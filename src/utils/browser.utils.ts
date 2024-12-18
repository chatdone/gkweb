const isSafariAndIOS = () => {
  const isSafari = !!navigator.userAgent.match(/Version\/[\d\\.]+.*Safari/);
  const isIOS =
    //@ts-ignore
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  return { isSafari, isIOS };
};

export { isSafariAndIOS };
