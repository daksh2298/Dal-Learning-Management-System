import axios from 'axios';

const axiosInstance=axios.create({
	baseURL:"https://us-central1-dallms-283403.cloudfunctions.net"
})

axiosInstance.interceptors.request.use((config)=>{return config});

export default axiosInstance;

