export function formatMeetingDate(dateString) {
  const options = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('en-US', options);
}

export function formatMeetingTime(dateString) {
  const options = { hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleTimeString('en-US', options);
}

export function getMeetingDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours > 0 ? `${hours}h ` : ''}${mins}m`;
}

export function isMeetingUpcoming(dateString) {
  return new Date(dateString) > new Date();
}