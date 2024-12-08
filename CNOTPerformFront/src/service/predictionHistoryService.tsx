import API from "../config/axiosConfig";

export const getPredictionByCnotid = async (id:string) => {
    id = id || '';
    return await API.get(`predictions/findbycnotid/${id}`);
  };

export const getPredictionByCin = async (cin:string) => {
    cin = cin || '';
    return await API.get(`predictions/findbycin/${cin}`);
  };

export const addPrediction = async (event:any) => {
    return await API.post('predictions', event);
  };