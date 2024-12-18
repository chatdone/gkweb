//@ts-nocheck

const openHubspot = () => {
  window.HubSpotConversations.widget.open();
};

const resetChatFlow = () => {
  if (!window.HubSpotConversations) {
    return;
  }

  window.history.pushState({}, 'sp_bot', window.location.pathname);

  window.HubSpotConversations.widget.refresh({ openToNewThread: true });
};

const setHubspotToFront = () => {
  const hubspot = document.querySelector('#hubspot-messages-iframe-container');

  hubspot?.classList.add('disabled');
};

const removeHubspotFromFront = () => {
  const hubspot = document.querySelector('#hubspot-messages-iframe-container');

  hubspot?.classList.remove('disabled');
};

export {
  openHubspot,
  resetChatFlow,
  setHubspotToFront,
  removeHubspotFromFront,
};
