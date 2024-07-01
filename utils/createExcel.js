import * as XLSX from "xlsx";

const createExcel = async (data, worksheetName, path) => {
  const workSheet = XLSX.utils.json_to_sheet(data);
  const workBook = XLSX.utils.book_new();
  await XLSX.utils.book_append_sheet(workBook, workSheet, worksheetName);
  await XLSX.write(workBook, { bookType: "xlsx", type: "buffer" });
  await XLSX.write(workBook, { bookType: "xlsx", type: "binary" });
  await XLSX.writeFile(workBook, path);
};

export { createExcel };
