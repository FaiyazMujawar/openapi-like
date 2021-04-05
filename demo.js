const s = "Bearer {{token_auth2}}";
console.log(s.replace(/token.*/, "token"));
