const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjNjMjIxMDdjLTA2NTEtZjMyOC05ZDE2LWM0ZWIxOGFlZDVjMyIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6ImFkbWluQHVuaXYuZnIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9naXZlbm5hbWUiOiJTeXN0ZW0iLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9zdXJuYW1lIjoiQWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBRE1JTiIsImV4cCI6MTc3NjA4NjI0OSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo2MTk1NSIsImF1ZCI6IlNlY3VyZUFwaVVzZXIifQ.2S-mqAaP8XTlFKuUG84QNlOSDc5jIjGRyqUSSJT3yt0';
const url = 'http://localhost:61955/api/Programs';

async function test() {
  const p1 = { name: "TestProg_" + Date.now(), field: "MyUniqueField" };
  console.log("Create 1:", p1);
  let res = await fetch(url, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(p1) });
  console.log("Status 1:", res.status, await res.text());

  const p2 = { name: "TestProg_" + Date.now(), field: "MyUniqueField" };
  console.log("Create 2:", p2);
  res = await fetch(url, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(p2) });
  console.log("Status 2:", res.status, await res.text());

  const p3 = { name: "TestProg_" + Date.now(), field: "MyUniqueField_2" };
  console.log("Create 3:", p3);
  res = await fetch(url, { method: 'POST', headers: { 'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json' }, body: JSON.stringify(p3) });
  console.log("Status 3:", res.status, await res.text());
}
test();
