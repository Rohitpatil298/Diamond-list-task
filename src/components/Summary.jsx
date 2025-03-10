const Summary = ({ summary, targetRef }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">Summary</h2>
      <div ref={targetRef} className="p-4 bg-gray-50 shadow rounded">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Summary</th>
              <th className="border border-gray-300 px-4 py-2">Total</th>
              <th className="border border-gray-300 px-4 py-2">Selected</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Qty</td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.totalQty}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.selectedQty}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Cts</td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.totalCts}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.selectedCts}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Avg Dis</td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.avgDis.toFixed(2)}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.selectedAvgDis.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2">Total Amount</td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.totalAmount}
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {summary.selectedAmount}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Summary;
