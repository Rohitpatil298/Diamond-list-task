import React from "react";

const BrokerDetails = ({ brokers, selectedBroker, handleBrokerChange }) => {
  return (
    <section className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow-md mb-6">
      <div className="py-4 px-4 mx-auto max-w-2xl">
        <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-white">
          Broker Details
        </h2>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Broker
          </label>
          <select
            name="selectedBroker"
            value={selectedBroker}
            onChange={handleBrokerChange}
            className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Select Broker</option>
            {brokers.map((broker) => (
              <option key={broker.id} value={broker.id}>
                {broker.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default BrokerDetails;
