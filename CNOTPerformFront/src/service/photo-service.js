import axios from "axios";
const url = process.env.REACT_APP_BACKEND_URL + "/photos";

export const getPhotos = async (id) => {
  id = id || "";
  return await axios.get(`${url}/${id}`);
};

export const getPhotosByEvent = async (id) => {
  return await axios.get(`${url}/${id}/photos`);
};

export const uploadPhotoToEvent = async (id, photo) => {
  return await axios.post(`${url}/upload/${id}`, photo);
};

export const deletePhoto = async (id) => {
  return await axios.delete(`${url}/${id}`);
};
