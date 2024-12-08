import axios from "axios";

//Boxing
export const boxInjuryPrediction = async (values) => {
    const response = await axios.post('http://localhost:5002/predictInjBoxing', values);
    return response;
  };

  export const boxPerformPrediction = async (data) => {
    const response = await axios.post('http://localhost:5003/predictPerfBoxing', data);
    
    return response;
  };

//Natation
  export const natationPerformPrediction = async (data) => {
    const response = await axios.post("http://localhost:5005/predictPerSwim", data);    
    return response;
  };

  export const natationInjuryPrediction = async (values) => {
    const response = await axios.post('http://localhost:5004/predictInjSwim', values);  
    return response;
  };

//Athletisme
export const athletismePerformPrediction = async (data) => {
  const response = await axios.post('http://localhost:5001/predict', data);
  return response;
};

export const athletismeInjuryPrediction = async (data) => {
  const response = await axios.post('http://localhost:5000/predictblessure', data);  
  return response;
};

//Athletisme
export const taekwondoPerformPrediction = async (data) => {
  const response = await axios.post('http://localhost:5007/predictTaekwondoPerformance', data);
  return response;
};

export const taekwondoInjuryPrediction = async (data) => {
  const response = await axios.post('http://localhost:5006/predictInjuryTaekwondo', data);  
  return response;
};