import API from "../config/axiosConfig";

export const getBourses = async (page?:number, groupe?:string, domaine?:string, federation?:string, status?:string) => {
  return await API.get(`bourses`,{
    params: {
      page: page,
      groupe: groupe,
      domaine: domaine,
      federation:federation,
      status:status
    }
  });
};

export const getBoursebyId = async (id:string) => {
    id = id || '';
    return await API.get(`bourses/${id}`);
  };
export const getBourseByProgramme = async (programme:string) => {
    programme = programme || '';
    return await API.get(`bourses/getboursebygroupe/${programme}`);
  };
export const getBourseByFederation = async (id:string) => {
  id = id || '';
    return await API.get(`bourses/getboursebyfederation/${id}`);
  };
  export const addBourse = async (event:any) => {
    return await API.post('bourses', event);
  };
  export const editBourse = async (id:string, event:any) => {
    return await API.put(`bourses/${id}`, event);
  };
  export const deleteBourse = async (id:string) => {
    return await API.delete(`bourses/${id}`);
  };

  export const acceptee = async (id:string, montant: number) => {
    return await API.put(`bourses/acceptee/${id}/${montant}`);
  };

  export const refusee = async (id:string) => {
    return await API.put(`bourses/refusee/${id}`);
  };

  export const attente = async (id:string) => {
    return await API.put(`bourses/attente/${id}`);
  };

  export const enCours = async (id:string) => {
    return await API.put(`bourses/encours/${id}`);
  };
  