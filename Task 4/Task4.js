const axios = require('axios');

let result = new Array();

const getData = async () => {
    try {
        const response = await axios.get("https://test-share.shub.edu.vn/api/intern-test/input");

        const rawData = response.data;
        // console.log(rawData.data);
        // console.log(rawData);
        const data = rawData.data;

        let dataArr = new Array();
        for (let i = 0; i < data.length + 1; i++) {
            if (i === 0) dataArr.push({type1: 0, type2:0});
            else {
                const dataType1 = data[i-1] + dataArr[i - 1].type1;
                const dataType2 = i % 2 === 0 ? dataArr[i -1].type2 - data[i-1] 
                                            : data[i-1] + dataArr[i - 1].type2;
                dataArr.push({type1: dataType1, type2: dataType2});
            }
        }  

        // console.log(dataArr);  
        const query = rawData.query;
        for (let i = 0; i < query.length; i++) {
            let l = query[i].range[0]; 
            let r = query[i].range[1]; 
            // console.log(l, r);
            if (query[i].type === "1") {
                result.push(dataArr[r + 1].type1 - dataArr[l].type1);
            }
            if (query[i].type === "2") {
                result.push(dataArr[r + 1].type2 - dataArr[l].type2);
            }
        }
        await sendData(rawData.token, result);
        // console.log(result);
    } catch (error) {
        console.error(error);
    }
}

const sendData = async (token, data) => {
    const response = await axios.post("https://test-share.shub.edu.vn/api/intern-test/output", 
        data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => console.log(response.data))
        .catch(error => console.error(error));
}

getData();