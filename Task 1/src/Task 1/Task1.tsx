import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { useState } from 'react';
const InputSchema = Yup.object().shape({
    startTime: Yup.string().required("Vui lòng chọn giờ bắt đầu"),
    endTime: Yup.string().required("Vui lòng chọn giờ kết thúc"),
    file: Yup.mixed().required("Vui lòng upload file báo cáo"),
  });
export default function Task1() {
  const [result, setResult] = useState<number | null>();
  type rowType = [ 
    number, string,
    string, string,
    string, string,
    number, number,
    number, string,
    string, string,
    string, string,
    string, string,
    string
  ];
  const handleFileUpload = (file: File | null, startTime: string, endTime: string) => {
      // console.log("submit");
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent<FileReader>) => {
          // console.log("test");
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const data = new Uint8Array(arrayBuffer);
          const workBook = XLSX.read(data, {type: 'array'});
          const workSheet = workBook.Sheets[workBook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json<rowType[]>(workSheet, {header:1});
          // console.table(jsonData);

          const filterData = jsonData.slice(8).map((row) => ({
            time: row[2],
            total: Number(row[8]) 
          }));
          // console.table(filterData);

          const arbitraryDay = '2024-10-09';
          const filterTotal = filterData.filter((row) => {
            const transactionTime = new Date(`${arbitraryDay}T${row.time}`);
            // console.log(transactionTime);
            const start = new Date(`${arbitraryDay}T${startTime}`);
            // console.log(start);
            const end = new Date(`${arbitraryDay}T${endTime}`);
            // console.log(end);
            return transactionTime >= start && transactionTime <= end;
          });

          let sum = 0;
          filterTotal.forEach((row) => (sum += row.total));
          setResult(sum);
          // console.log(sum);
      }
      if (file) fileReader.readAsArrayBuffer(file);
  }

  return (
    <div className="max-w-xl mx-auto p-4 shadow-md rounded-md bg-[#fff] select-none">
        <h2 className="text-2xl font-bold mb-6 text-[#333]">Tính tổng Thành tiền</h2>
        <Formik
        initialValues={{
          startTime: '',
          endTime: '',
          file: null,
        }}
        validationSchema={InputSchema}
        onSubmit={(values) => {
          handleFileUpload(values.file, values.startTime, values.endTime);
        }}
        >
        {({ setFieldValue }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="startTime" className="block text-[#333] cursor-pointer">Giờ bắt đầu</label>
              <Field
                id="startTime"
                name="startTime"
                type="time"
                className="w-full p-2 border rounded outline-none cursor-pointer"
              />
              <ErrorMessage name="startTime" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="endTime" className="block text-[#333] cursor-pointer">Giờ kết thúc</label>
              <Field
                id="endTime"
                name="endTime"
                type="time"
                className="w-full p-2 border rounded outline-none cursor-pointer"
              />
              <ErrorMessage name="endTime" component="div" className="text-red-500" />
            </div>

            <div className="mb-4">
              <label htmlFor="file" className="block text-[#333] cursor-pointer">Upload file báo cáo (.xlsx)</label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".xlsx"
                multiple={false}
                onChange={(event) => {
                  setFieldValue("file", event.target.files?.[0]);
                }}
                className="w-full outline-none p-2 border rounded cursor-pointer"
              />
              <ErrorMessage name="file" component="div" className="text-red-500" />
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Tính tổng
            </button>
          </Form>
        )}
      </Formik>
        {
          result && (
            <div className="mt-6">
              <div className="w-[100%] h-[2px] bg-[#f0f0f0]"></div>
              <h3 className="text-xl font-bold text-[#333] mt-2">Tổng Thành tiền:</h3>
              <p className="text-2xl text-[#333]">{result.toString()} VNĐ</p>
            </div>
          )
        }
    </div>
  )
}

