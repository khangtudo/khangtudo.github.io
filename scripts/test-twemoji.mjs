// Twemoji Flag renderer
function getFlagSvgUrl(countryCode) {
  // countryCode e.g. "VN", "US", "JP"
  // Convert to regional indicator hex
  const codePoints = [...countryCode.toUpperCase()].map(c => (0x1F1E6 + c.charCodeAt(0) - 65).toString(16));
  return `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/svg/${codePoints.join('-')}.svg`;
}

console.log('VN flag:', getFlagSvgUrl('VN'));
console.log('US flag:', getFlagSvgUrl('US'));
