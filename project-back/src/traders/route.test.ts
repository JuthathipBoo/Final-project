// import { trader } from "./route";

test("Test Add Traders", async () => {
  const Response = await fetch("http://localhost:8750/traders/addTrader", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      dealer_name: "John Doe",
      national_id: "1234567890",
      company_name: "ABC Company",
      email: "xK6bV@example.com",
      phone_number: "1234567890",
      start_date: "2023-01-01",
    }),
  });
  expect(Response.status).toBe(200);
});
