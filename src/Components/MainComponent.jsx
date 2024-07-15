import axios from "axios";
import React, { useEffect, useState } from "react";

export default function MainComponent() {
  const [Search, setSearch] = useState("");
  const [CombinedData, setCombinedData] = useState([]);

  async function fetchData() {
    try {
      const customersResponse = await axios.get(
        `http://localhost:8000/customers`
      );
      const transactionsResponse = await axios.get(
        `http://localhost:8000/transactions`
      );

      const customers = customersResponse?.data || [];
      const transactions = transactionsResponse?.data || [];

      const customerMap = {};
      customers.forEach((customer) => {
        customerMap[customer.id] = customer.name;
      });

      const combinedData = transactions.map((transaction) => ({
        id: transaction.id,
        name: customerMap[transaction.customer_id],
        customer_id: transaction.customer_id,
        date: transaction.date,
        amount: transaction.amount,
      }));

      setCombinedData(combinedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = CombinedData.filter((item) => {
    const lowerCaseSearch = Search.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(lowerCaseSearch);
    const dateMatch = item.date.toLowerCase().includes(lowerCaseSearch);
    const amountMatch = item.amount
      .toString()
      .toLowerCase()
      .includes(lowerCaseSearch);

    return nameMatch || dateMatch || amountMatch;
  });

  return (
    <div className="container p-5">
      <form className="d-flex justify-content-center w-100">
        <input
          type="search"
          name="search"
          onChange={(event) => setSearch(event.target.value)}
          value={Search}
          placeholder=" Search by Name / Date Or Amount"
          className="w-75 rounded-4 p-3"
        />
      </form>
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Transaction ID</th>
            <th scope="col">Name</th>
            <th scope="col">Customer ID</th>
            <th scope="col">Date</th>
            <th scope="col">Amount</th>
            {Search && <th scope="col">Sub/Day</th>}
          </tr>
        </thead>
        <tbody>
          {(Search ? filteredData : CombinedData).map((item) => {
            const sameDayTransactions = CombinedData.filter(
              (trans) =>
                trans.customer_id === item.customer_id &&
                trans.date === item.date
            );
            const subtotal =
              sameDayTransactions.length > 1
                ? sameDayTransactions.reduce((acc, t) => acc + t.amount, 0)
                : null;

            return (
              <tr key={item.id}>
                <th scope="row">{item.id}</th>
                <td>{item.name}</td>
                <td>{item.customer_id}</td>
                <td>{item.date}</td>
                <td>{item.amount}</td>
                {Search && <td>{subtotal}</td>}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
