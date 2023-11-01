export const secondsToTimeAgo = (seconds: number): string => {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor(((seconds % 86400) % 3600) / 60);
  const secs = Math.floor(((seconds % 86400) % 3600) % 60);

  let timeAgo = '';
  if (days > 0) {
    timeAgo += `${days}d `;
  }
  if (hours > 0) {
    timeAgo += `${hours}h `;
  }
  if (minutes > 0) {
    timeAgo += `${minutes}m `;
  }
  if (secs > 0) {
    timeAgo += `${secs}s`;
  }
  if (timeAgo === '') {
    timeAgo = '0s';
  }
  return timeAgo;
};

export const dateToTimeAgo = (date: Date): string => {
  return secondsToTimeAgo((new Date().getTime() - date.getTime()) / 1000);
};
