export default function PrintTable({ tableHeaders, tableBody}: any) {
  function renderTableHead() {
    if (tableHeaders) {
      return (
        <thead className="bg-gray-50" style={{backgroundColor:'lightgray'}} >
          <tr>
            {tableHeaders.map((head: any, index: any) => (
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
          {tableBody.map((record: any) => (
            <tr key={record.id}>
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
    if (tableBody && tableBody.length <= 0 ) {
      return (
        <div className="py-20 text-center text-gray-500 w-full">
          <p>No Records found</p>
        </div>
      );
    }
  };

  return (
    <div>
      <div className="mx-auto max-w-[1500px] flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-00">
                {renderTableHead()}
                {renderTableBody()}
              </table>
            </div>
            {renderNotFound()}
          </div>
        </div>
      </div>
    </div>
  );
}
