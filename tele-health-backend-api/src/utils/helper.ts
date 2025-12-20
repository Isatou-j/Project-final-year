export const getRandomRecentDate = (): Date => {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  return new Date(
    thirtyDaysAgo.getTime() +
      Math.random() * (now.getTime() - thirtyDaysAgo.getTime()),
  );
};


export const getFutureDate = (monthsAhead: number = 12): Date => {
  const now = new Date();
  return new Date(
    now.getFullYear(),
    now.getMonth() + monthsAhead,
    now.getDate(),
  );
};

export const getRelativeExpiry = (expiryDate: Date) => {
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) {
    return `${diffMins} minutes`;
  } else if (diffHours < 24) {
    return `${diffHours} hours`;
  } else {
    return `${diffDays} days`;
  }
};
