module.exports = {
  firebaseConfig: {
    apiKey: process.env.FBAPIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: "node-file-storage.appspot.com",
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.FBAPPID,
  },
};
