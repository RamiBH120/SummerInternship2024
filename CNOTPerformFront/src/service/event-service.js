import axios from "axios";
const url = process.env.REACT_APP_BACKEND_URL + "/events";

export const getEvents = async (id) => {
  id = id || "";
  return await axios.get(`${url}/${id}`);
};
export const addEvent = async (event) => {
  console.log('Sending event:', event);  
  return await axios.post(`${url}`, event,{
    headers: {
      'Content-Type': 'multipart/form-data', 
    },
  });
};

export const updateEvent = async (id, event) => {
  return await axios.put(`${url}/${id}`, event);
};
export const deleteEvent = async (id) => {
  return await axios.delete(`${url}/${id}`);
};

export const participate = async (event, user) => {
  return await axios.post(`${url}/${event}/participate/${user}`);
};

export const cancelParticipation = async (event, user) => {
  return await axios.delete(`${url}/${event}/cancel/${user}`);
};

export const participatedEvents = async (user) => {
  return await axios.get(`${url}/users/participated/${user}`);
};

export const hasParticipated = async (event, user) => {
  return await axios.get(`${url}/${event}/has-participated/${user}`);
};
