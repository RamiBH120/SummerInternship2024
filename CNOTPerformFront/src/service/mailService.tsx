import API from "../config/axiosConfig";

export const getEmails = async (mailAccount: any) => {
  return API.post(`mail/fetchemails`, mailAccount);
};

export const getEmailById = async (id: string) => {
  return API.get(`mail/fetchemail/${id}`);
};

export const bookmarkEmail = async (id: string) => {
  const response = API.put(`mail/bookmark/${id}`);
  const data = (await response).data;

  return response;
};

export const setEmailAccount = async (account: any) => {
  return API.post("mail/setupaccount", account);
};

export const getMailAccount = async (id: string) => {
  return API.get(`mail/getmailadress/${id}`);
};

export const deleteEmail = async (id: string) => {
  return API.get(`mail/getmailadress/${id}`);
};

export const verifPassword = async (mailAccount: string, password: string) => {
  return API.get(`mail/verifpassword/${mailAccount}/${password}`);
};

export const downoadFile = async (fileName: string) => {
  return API.get(`mail/download/${fileName}`);
};

export const verifAccountSet = async (id: string) => {
  return API.get(`mail/verifyaccountset/${id}`);
};

export const send = async (from: string, password:string, to: string, subject: string, body: string) => {
 return API.post(`mail/send`, {from: from, password:password, to: to, subject: subject, body: body})
}