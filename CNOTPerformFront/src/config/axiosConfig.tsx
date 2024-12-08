import axios from "axios";
const url = process.env.REACT_APP_BACKEND_URL;

const API =  axios.create({
    baseURL : `${url}/`
})

export default API;