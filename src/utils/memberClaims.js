export function isMemberClaimed(person) {
  return person?.isClaimed === true || Boolean(person?.claimedAt);
}

export function isRoomPersonSelectable(person) {
  return Boolean(person?.id) && !isMemberClaimed(person);
}
