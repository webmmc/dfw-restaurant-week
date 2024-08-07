import styles from "../components/styles/restaurant-filter.module.scss";

export default function Table({ tableHeaders, tableBody }) {
  function renderTableHead() {
    if (tableHeaders) {
      return (
        <thead className="bg-gray-50" style={{ backgroundColor: 'lightgray' }}>
          <tr>
            {tableHeaders.map((head, index) => (
              <th
                className={`text-left border-r py-6 ${
                  head.position === "first"
                    ? "pl-4 pr-3 text-sm font-semibold text-gray-900 sm:pl-6"
                    : head.position === "common"
                    ? "px-3 text-sm font-semibold text-gray-900"
                    : "relative pl-3 pr-4 sm:pr-6"
                }`}
                key={index}
                scope="col"
              >
                {head.name}
              </th>
            ))}
          </tr>
        </thead>
      );
    }
  }

  const renderTableBody = () => {
    if (tableBody && tableBody.length > 0) {
      return (
        <tbody className="divide-y divide-gray-200 bg-white">
          {tableBody.map((record) => (
            <tr key={record.key}>
              {Object.keys(record)
                .filter((item) => item !== "key")
                .map((item, index, array) => (
                  <td
                    className={`py-4 font-bold border-r whitespace-nowrap text-base ${
                      index === 0
                        ? "pl-4 pr-3 font-bold text-black-700 sm:pl-6"
                        : index === array.length - 1
                        ? "relative pl-3 pr-4 font-bold text-black-700 sm:pr-6"
                        : "px-3 text-black-700"
                    }`}
                    key={item}
                  >
                    {record[item] && record[item] !== "N/A"
                      ? record[item]
                      : record[item] === false
                      ? null
                      : "-"}
                  </td>
                ))}
            </tr>
          ))}
        </tbody>
      );
    }
    return null;
  };

  const renderNotFound = () => {
    if (tableBody && tableBody.length <= 0) {
      return (
        <div className="py-20 text-center text-gray-500 w-full">
          <p>No Records found</p>
        </div>
      );
    }
  };

  const renderMobileTable = () => {
    if (tableBody && tableBody.length > 0) {
      return (
        <div className="border border-gray-300 divide-y divide-gray-200 bg-white rounded-lg">
          {tableBody.map((record) => (
            <div key={record.key} className="py-4 text-center">
              {Object.keys(record)
                .filter((item) => item !== "key")
                .map((item, index, array) => (
                  <div key={item} className="px-4 py-2 flex flex-col items-center">
                    <span className="block text-black-700 font-bold">
                      {record[item] && record[item] !== "N/A"
                        ? record[item]
                        : record[item] === false
                        ? null
                        : "-"}
                    </span>
                    {(index < array.length - 1) && item !== "logo" && (
                      <hr className="my-2 w-3/6" />
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div className="mx-auto max-w-[1500px] flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className={`min-w-full divide-y divide-gray-200 hidden lg:table ${styles.printTable}`}>
                {renderTableHead()}
                {renderTableBody()}
              </table>
              <div className={`lg:hidden ${styles.printHidden}`}>
                {renderMobileTable()}
              </div>
            </div>
            {renderNotFound()}
          </div>
        </div>
      </div>
    </div>
  );
}
