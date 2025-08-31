const categorizeDebris = (item) => {
  const lowerItem = item.toLowerCase();
  if (lowerItem.includes("plastic")) {
    return "Plastic";
  }
  if (lowerItem.includes("rope") || lowerItem.includes("net")) {
    return "Fishing Gear";
  }
  if (lowerItem.includes("tire") || lowerItem.includes("rubber")) {
    return "Rubber";
  }
  if (lowerItem.includes("") || lowerItem.includes("net")) {
    return "Rubber";
  }
  return "Other";
};

module.exports = { categorizeDebris };
