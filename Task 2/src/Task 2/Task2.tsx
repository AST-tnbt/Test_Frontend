import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from "react-toastify";

const inputSchema = Yup.object().shape({
    time: Yup.date().required("Vui lòng chọn thời gian"),
    quantity: Yup.number().min(0, "Số lượng phải lớn hơn 0").required("Vui lòng nhập số lượng").typeError("Giá trị phải là một số"),
    column: Yup.string().required("Vui lòng chọn trụ"),
    revenue: Yup.number().required("Vui lòng nhập doanh thu").typeError("Giá trị phải là một số"),
    price: Yup.number().required("Vui lòng nhập đơn giá").typeError("Giá trị phải là một số")
})

const columns = ["Trụ 1", "Trụ 2", "Trụ 3", "Trụ 4", "Trụ 5"];

export default function Task2() {
    const [chooseColumn, setChooseColumn] = useState(false);

    const getCurrentDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            const columnField = document.getElementById('columnField');
            const dropdown = document.getElementById('dropdown'); 

            if (columnField && dropdown && !columnField.contains(target) && !dropdown.contains(target)) {
                setChooseColumn(false);
            };
        }
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleSubmit = () => {
        // console.log("success");
        toast.success('Cập nhật thành công!', {
            position: "top-right",
            autoClose: 3000, 
          });
    }

  return (
    <div className="w-[32rem] mx-auto rounded-md bg-[#fff] select-none">
        <Formik
            initialValues={{
                time: getCurrentDateTime(),
                quantity: "",
                column:"",
                revenue: "",
                price: ""
            }}    
            validationSchema={inputSchema}
            onSubmit={handleSubmit}
        >
            {({setFieldValue}) => (
                <Form >
                    <div className="p-4 shadow-md">
                        <div className="flex justify-between">
                            <div className="flex items-center cursor-pointer">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                                </svg>
                                <span className="text-base ml-1.5">
                                    Đóng
                                </span>
                            </div>
                            <button type="submit" className="text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg">Cập nhật</button>
                        </div>
                        <h2 className="text-3xl text-[#333] font-bold mt-2">Nhập giao dịch</h2>
                    </div>
                    <div className="p-4">
                        <div className="p-2 w-full border rounded-lg mt-2">
                            <label htmlFor="time" className="block text-sm font-medium text-gray-500 cursor-pointer">Thời gian</label>
                            <Field
                                id="time"
                                name="time"
                                type="datetime-local"
                                className="outline-none w-full cursor-pointer text-base text-[#333] font-medium"
                                step="1"
                            />
                        </div>
                        <ErrorMessage name="time" component="div" className="text-red-500"/>
                        <div className="p-2 w-full border rounded-lg mt-4">
                            <label htmlFor="quantity" className="block text-sm font-medium text-gray-500 cursor-pointer">Số lượng</label>
                            <Field
                                id="quantity"
                                name="quantity"
                                type="text"
                                className="outline-none w-full cursor-text text-base text-[#333] font-medium"
                            />
                        </div>
                        <ErrorMessage name="quantity" component="div" className="text-red-500"/>
                        <div className="p-2 w-full border rounded-lg mt-4">
                            <label htmlFor="column" className="block text-sm font-medium text-gray-500 cursor-pointer">Trụ</label>
                            {/* <Field
                                id="column"
                                as="select"
                                name="column"
                                className="outline-none w-full cursor-pointer text-base text-[#333] font-medium bg-white"
                            >
                                <option value="" disabled hidden></option>
                                {columns.map((column, index) =>(<option className="bg-white cursor-pointer" key={index} value={column}>{column}</option>))}
                            </Field> */}

                            <div id="columnField" className="flex cursor-pointer">
                                <Field
                                    id="column"
                                    type="text"
                                    readOnly={true}
                                    name="column"
                                    className="outline-none w-full cursor-pointer text-base text-[#333] font-medium bg-white"
                                    onClick={() => setChooseColumn(!chooseColumn)}
                                />
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6"
                                    onClick={() => setChooseColumn(!chooseColumn)}
                                >
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>

                            {/* After researching, I realized that there is no accessible options container (wrapper) element 
                            in the Dom in order to change it's style. So I create my own dropdown by ul tag */}

                            <ul className={`${chooseColumn ? "block" : "hidden"} text-[#333] absolute bg-white shadow-lg rounded-lg z-10 max-h-[160px] overflow-y-auto`}
                                id="dropdown"
                                style={{width: "29rem"}}
                                // div tag wrapping form has width = 32rem, 
                                // div tag wrapping all fields has p-4 = 1rem, 
                                // div tag wrapping this field has p-2 = 0.5rem
                                // => I set width of this dropdown to 29rem (32-2-1, equal to the width of "Trụ" field)
                            >
                                {columns.map((column, index) =>(
                                    <li key={index} 
                                        className="cursor-pointer py-2 px-4 hover:bg-gray-100"
                                        onClick={() => {
                                            setFieldValue("column", column);
                                            setChooseColumn(false);
                                        }}
                                    >
                                        {column}
                                    </li>
                                ))} 
                            </ul>
                        </div>
                        <ErrorMessage name="column" component="div" className="text-red-500"/>
                        <div className="p-2 w-full border rounded-lg mt-4">
                            <label htmlFor="revenue" className="block text-sm font-medium text-gray-500 cursor-pointer">Doanh thu</label>
                            <Field
                                id="revenue"
                                name="revenue"
                                type="text"
                                className="outline-none w-full cursor-text text-base text-[#333] font-medium"
                            />
                        </div>
                        <ErrorMessage name="revenue" component="div" className="text-red-500"/>
                        <div className="p-2 w-full border rounded-lg mt-4">
                            <label htmlFor="price" className="block text-sm font-medium text-gray-500 cursor-pointer">Đơn giá</label>
                            <Field
                                id="price"
                                name="price"
                                type="text"
                                className="outline-none w-full cursor-text text-base text-[#333] font-medium"
                            />
                        </div>
                        <ErrorMessage name="price" component="div" className="text-red-500"/>
                    </div>
                </Form>
            )}
        </Formik>
        <ToastContainer />
    </div>
  )
}
