export const networkCapacityToHuman = (capacity: number) => {
  if (capacity < 1000) {
    return `${capacity} bps`;
  }
  if (capacity < 1000000) {
    return `${(capacity / 1000).toFixed(2)} kbps`;
  }
  if (capacity < 1000000000) {
    return `${(capacity / 1000000).toFixed(2)} Mbps`;
  }
  return `${(capacity / 1000000000).toFixed(2)} Gbps`;
}
