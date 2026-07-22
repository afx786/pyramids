export function formatBatch(joiningYear, graduatingYear) {
  if (joiningYear && graduatingYear) {
    return `${joiningYear}\u2013${graduatingYear}`;
  }
  return null;
}

export function formatShortBatch(joiningYear, graduatingYear) {
  if (joiningYear && graduatingYear) {
    const short = String(graduatingYear).slice(-2);
    return `${joiningYear}\u2013${short}`;
  }
  return null;
}
