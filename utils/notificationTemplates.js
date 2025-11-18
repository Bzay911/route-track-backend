export const NotificationTemplates = {
  RIDE_INVITE: (rideName) => ({
    title: 'New Ride Invitation',
    body: `You've been invited to join "${rideName}"`,
  }),
  
  RIDE_ACCEPTED: (userName) => ({
    title: 'Invite Accepted',
    body: `${userName} accepted your ride invitation`,
  }),
  
  RIDE_REJECTED: (userName) => ({
    title: 'Invite Declined',
    body: `${userName} declined your ride invitation`,
  }),
  
  RIDE_STARTING_SOON: (rideName, minutes) => ({
    title: 'Ride Starting Soon',
    body: `"${rideName}" starts in ${minutes} minutes`,
  }),
  
  RIDE_CANCELLED: (rideName) => ({
    title: 'Ride Cancelled',
    body: `"${rideName}" has been cancelled`,
  }),
};