import API from "../config/axiosConfig";

export const uploadFile = async (file, id, type) => {
    return await API.post(`files/${id}/${type}`, file);
  };