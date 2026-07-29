import React from "react";

const CommonTable = ({
  columns = [],
  data = [],
  currentPage = 1,
  itemsPerPage = 10,
  showSerialNumber = true,
  onRowClick,
}) => {
  const finalColumns = showSerialNumber
    ? [{ header: "S.No", type: "serial", width: "50px" }, ...columns]
    : columns;

  return (
    <div className="rounded-3xl shadow border border-gray-100 overflow-hidden bg-white">
      {/* HEADER */}
      <div
        className="grid bg-blue-600 px-6 py-3 font-semibold text-white text-bold"
        style={{
          // gridTemplateColumns: `repeat(${finalColumns.length}, minmax(0,1fr))`,
          gridTemplateColumns: finalColumns
            .map((col) => col.width || "1fr")
            .join(" "),
        }}
      >
        {finalColumns.map((col, index) => (
          <div
            key={index}
            className={`${col.align === "left" ? "text-left" : "text-center"}`}
          >
            {col.header}
          </div>
        ))}
      </div>

      {/* BODY */}
      {data.length > 0 ? (
        data.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className="grid px-6 py-4 border-t hover:bg-gray-50 cursor-pointer items-center text-sm"
            style={{
              // gridTemplateColumns: `repeat(${finalColumns.length}, minmax(0,1fr))`,
              gridTemplateColumns: finalColumns
                .map((col) => col.width || "1fr")
                .join(" "),
            }}
            onClick={() => onRowClick?.(row)}
          >
            {finalColumns.map((col, colIndex) => (
              <div
                key={colIndex}
                className={`${
                  col.align === "left" ? "text-left" : "text-center"
                }`}
              >
                {/*  SERIAL NUMBER */}
                {col.type === "serial"
                  ? (currentPage - 1) * itemsPerPage + rowIndex + 1
                  : col.render
                    ? col.render(row, rowIndex)
                    : (row[col.accessor] ?? "-")}
              </div>
            ))}
          </div>
        ))
      ) : (
        <div className="text-center py-6 text-gray-500">No data found</div>
      )}
    </div>
  );
};

export default CommonTable;