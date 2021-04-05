const parts = ["issues", ""];
const url = parts.reduce((url, part) => {
  console.log(url, part);
  if (!part.trim()) return url;
  if (/[0-9]+/.test(part)) return (url += ":id/");
  return (url += part + "/");
}, "/");

console.log(url);
