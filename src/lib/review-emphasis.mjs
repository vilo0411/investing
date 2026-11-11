/** Compare costs only within the same unit and fee-inclusion basis. */
export function policyGroup(policy, today) {
  if (!policy || policy.qualifier !== 'fixed' || policy.maxValue !== null || policy.exchangeFee === 'unknown') return null;
  if (policy.status !== 'published' || !policy.primary || (policy.validFrom && policy.validFrom > today) || (policy.validUntil && policy.validUntil < today)) return null;
  const age = (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${policy.checkedAt}T00:00:00Z`)) / 86400000;
  if (age > 30 || age < 0 || !Number.isFinite(age)) return null;
  return `${policy.metric}:${policy.unit}:${policy.exchangeFee}`;
}

export function policyEmphasis(policy, candidates, today) {
  const group = policyGroup(policy, today);
  const empty = { kind: 'none', strength: 0, label: '', count: 0 };
  if (!group) return empty;
  const peers = candidates.filter((candidate) => policyGroup(candidate, today) === group);
  const values = peers.map((peer) => peer.value);
  const min = Math.min(...values), max = Math.max(...values);
  if (peers.length < 2 || min === max) return empty;
  const strength = (max - policy.value) / (max - min);
  const kind = policy.value === min ? 'low' : policy.value === max ? 'high' : 'middle';
  return { kind, strength, label: kind === 'low' ? 'Thấp nhất nhóm' : kind === 'high' ? 'Cao nhất nhóm' : '', count: peers.length };
}
