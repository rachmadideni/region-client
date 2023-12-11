import baseAxios from 'axios';

const axios = baseAxios.create({
    baseURL: import.meta.env.REACT_APP_API_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    transformResponse: [
        (response) => {
            let resp;
            try {
                resp = JSON.parse(response)
                return resp.data
            } catch (err) {
                throw Error(`Error parsing response JSON ${JSON.stringify(err)}`)
            }
        }
    ]
});

const axiosVendor = baseAxios.create({
    baseURL: import.meta.env.VITE_REGION_BASE_URL,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json',
    },
    transformResponse: [
        (response) => {
            let resp;
            try {
                resp = JSON.parse(response)
                return {
                    data: resp.data,
                    meta: resp.meta
                } 
            } catch (err) {
                console.log(err)
                return JSON.parse(response)
                // throw Error(`Error parsing response JSON ${JSON.stringify(err)}`)
            }
        }
    ]
})

export {
    axiosVendor
}

export default axios
