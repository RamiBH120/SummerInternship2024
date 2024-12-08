const User = require("../models/user");
const crypto = require('crypto');
const Waitlist = require("../models/waitlist");
const jwt = require('jsonwebtoken');
const {createTransport, getTestMessageUrl} = require("nodemailer");
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const nodemailer = require('nodemailer');
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);


const sendSms = async (to, message) => {
  try {
    const prefixedNumber = to.toString().startsWith('+216') ? to.toString() : '+216' + to.toString().slice(-8);
    


    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: prefixedNumber
    });
    console.log('SMS sent:', response.sid);
    return response;
  } catch (error) {
    console.error('Error sending SMS:', error);
    throw new Error('Failed to send SMS');
  }
};




const addUserToWaitlist = async (userData) => {
    try {
       
        const newUser = new Waitlist(userData);
        await newUser.save();
        console.log('Utilisateur ajouté à la liste d\'attente avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'ajout de l\'utilisateur à la liste d\'attente :', error);
    }
};
const addAdmin = async (req, res, next) => {
    try {
        const { name, email, password ,role,tel} = req.body;
        if (!name|| !email || !password || typeof name !== 'string'  || typeof email !== 'string' || typeof password !== 'string' ) {
            return res.status(400).json({ success: false, error: 'Prénom, nom, email et mot de passe requis' });
        }
        
         const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé' });
        }

       /* if (!Object.values(Role).includes(role)) { 
            throw new Error('Invalid role provided.');
        }*/
       
       
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const  newUser = new User({
            name,
            email,
            password: hashedPassword,
            role:"MC",
            tel
           
        });

       
        await newUser.save();

    
        return res.status(201).json({success: true, message: 'Utilisateur inscrit avec succès'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, error: "Erreur lors de l'ajout de l'utilisateur"});
    }
};


const signup = async (req, res, next) => {
    try {
        const { name, email, password ,role,tel} = req.body;
        if (!name|| !email || !password || typeof name !== 'string'  || typeof email !== 'string' || typeof password !== 'string' ) {
            return res.status(400).json({ success: false, error: 'Prénom, nom, email et mot de passe requis' });
        }
        
         const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ success: false, error: 'Cet email est déjà utilisé' });
        }

       /* if (!Object.values(Role).includes(role)) { 
            throw new Error('Invalid role provided.');
        }*/
       
       
        const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

        const  newUser = new User({
            name,
            email,
            password: hashedPassword,
            role:"F",
            tel
           
        });

       
        await newUser.save();

    
        return res.status(201).json({success: true, message: 'Utilisateur inscrit avec succès'});
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, error: "Erreur lors de l'ajout de l'utilisateur"});
    }
};


const signin = async (req, res, next) => {
    try {
      const { email, password, name } = req.body;
  
      if (!email || !password || !name) {
        return res.status(400).json({ success: false, error: 'Email, Mot de passe, et Nom obligatoires!' });
      }
  
      let user = await User.findOne({ email });
  
      // If the user is not found in the User collection
      if (!user) {
        return res.status(401).json({ success: false, error: 'Email inexistant' });
      }
  
      // If the user is found, check the name
      if (user.name !== name) {
        return res.status(401).json({ success: false, error: 'Nom incorrect.' });
      }
  
      // If the name matches, check the hashed password
      const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
      if (hashedPassword !== user.password) {
        return res.status(401).json({ success: false, error: 'Mot de passe incorrect.' });
      }
  
      if (user.blocked) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        user.unblockCode = code;
        user.resetCodeExpiry = Date.now() + 3600000; // 1 hour expiry
        await user.save();
  
        const director = await User.findOne({ name: 'Directeur', role: 'MC' });
        if (director) {
          try {
            await sendSms(director.tel, `Utilisateur ${user.name} est bloqué. Code de déblocage: ${code}`);
          } catch (error) {
            return res.status(500).json({ success: false, error: 'Failed to send SMS' });
          }
        }
  
        return res.status(401).json({ success: false, error: 'Votre compte est bloqué. Un code de déblocage a été envoyé au Directeur.' });
      }
  
      // Generate the JWT token if the password matches and the account is not blocked
      const token = jwt.sign({
        userId: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
        tel:user.tel
      }, "secret", { expiresIn: '1d' });
  
      // Return the user and token
      return res.status(200).json({ success: true, user, token });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };



  const unBlockUserAccount = async (req, res) => {
    const { email, unblockCode } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(400).json({ success: false, error: "Utilisateur non trouvé." });
      }
  
      if (user.unblockCode === unblockCode && Date.now() < user.resetCodeExpiry) {
        user.blocked = false;
        user.unblockCode = null;
        user.resetCodeExpiry = null;
        await user.save();
  
        const token = jwt.sign({
          userId: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
          tel: user.tel,
        }, "secret", { expiresIn: '1d' });
  
        return res.status(200).json({ success: true, user, token });
      } else {
        return res.status(400).json({ success: false, error: "Code de déblocage incorrect ou expiré." });
      }
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  };
  
  


  /*const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, error: 'Email does not exist.' });
    }

    if (user.blocked) {
      return res.status(401).json({ success: false, error: 'Your account is blocked.' });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    if (hashedPassword !== user.password) {
      return res.status(401).json({ success: false, error: 'Password is incorrect.' });
    }

    const twoFactorAuth = user.twoFactorAuth && user.twoFactorAuth.enabled;


    // If 2FA is not enabled, redirect to QR code page for setup
    if (user.twoFactorAuth && !user.twoFactorAuth.enabled) {
      return res.json({
        success: true,
        twoFactorSetupRequired: true,
        //twoFactorEnabled:false,
        userId: user._id,
        message: "2FA is not enabled. Please set up using the QR code."
      });
    }

   
      return res.json({
        success: true,
       // token: token,
       
        message: 'Successfully authenticated.'
      });
  
    }
   
   

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};*/





const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        res.status(200).json({users});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

const deleteUser = async (req, res, next) => {
    let id = req.params.id;
    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}


const getUserbyId = async (req, res, next) => {
    let id = req.params.id;
    try {
        const user = await User.findById(id);
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}


const getWaitList = async (req, res, next) => {
    try {
        const waitlist = await Waitlist.find();
        res.status(200).json({waitlist});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updateData = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(updatedUser);
    } catch (error) {
      res.status(400).json({ message: `Something wrong for edit profile: ${error.message}` });
    }
  };

const confirmUser = async (req, res) => {
    try {
        const { userId } = req.params;

        // Trouver l'utilisateur dans la waitlist, pas dans la collection User
        const userInWaitlist = await Waitlist.findById(userId);

        if (!userInWaitlist) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé dans la waitlist." });
        }

      
        const newUser = new User({
            firstName: userInWaitlist.firstName,
            lastName: userInWaitlist.lastName,
            email: userInWaitlist.email,
            password: userInWaitlist.password, 
            address:userInWaitlist.address,
            role: userInWaitlist.role,
            certificate: userInWaitlist.certificate,
            federation:userInWaitlist.federation,
            status:true, 
            createdAt: new Date() 
        });

        await newUser.save();

        
        await Waitlist.findByIdAndDelete(userId);

        return res.status(200).json({ success: true, message: "Utilisateur confirmé et transféré avec succès." });

    } catch (error) {
        console.error("Erreur lors de la confirmation et du transfert de l'utilisateur :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur.", error: error.message });
    }
};


const refuseUser = async (req, res) => {
    try {
        const { userId } = req.params;

       
        const userInWaitlist = await Waitlist.findById(userId);

        if (!userInWaitlist) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé dans la liste d'attente." });
        }

       
        await Waitlist.findByIdAndDelete(userId);

        return res.status(200).json({ success: true, message: "Inscription refusée avec succès et utilisateur retiré de la liste d'attente." });

    } catch (error) {
        console.error("Erreur lors du refus de l'inscription :", error);
        return res.status(500).json({ success: false, message: "Erreur serveur.", error: error.message });
    }
};
const getUserByEmail = async (req, res, next) => {
    const email = req.params.email; // Assuming email is passed as a URL parameter
    try {
        // First, try to find the user in the main user collection
        const user = await User.findOne({ email: email });

        // If not found in the main user collection, check the waitlist
        if (!user) {
            userW = await Waitlist.findOne({ email: email });

            // If found in the waitlist, return a message indicating the account is pending
            if (userW) {
                return res.status(200).json({ message: "Account is pending, please wait for approval." });
            } else {
                // If not found in both, the user does not exist
                return res.status(404).json({ message: "Email does not exist, please create an account." });
            }
        } else {
            // If user is found in the main user collection, return that user
            res.status(200).json({ user });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const getUserWaiting = async (req, res, next) => {
    let id = req.params.id;
    try {
        const user = await Waitlist.findById(id);
        res.status(200).json({user});
    } catch (error) {
        res.status(500).json({message: error.message});
    }

}


const getUserProfile = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1]; // Récupérer le token depuis l'en-tête Authorization
  
        if (!token) {
            return res.status(401).json({success: false, error: 'Token manquant dans l\'en-tête Authorization'});
        }
  
        const decoded = jwt.verify(token,"secret"); // Vérifier et décoder le token
  
        // Trouver l'utilisateur dans la base de données en utilisant l'ID du token décodé
        const user = await User.findById(decoded.userId);
  
        if (!user) {
            return res.status(404).json({success: false, error: 'Utilisateur non trouvé'});
        }
  
        // Retourner les données du profil de l'utilisateur
        return res.status(200).json({success: true, user});
    } catch (error) {
        console.error(error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({success: false, error: 'Token invalide'});
        }
        return res.status(500).json({
            success: false,
            error: 'Erreur lors de la récupération des données du profil utilisateur'
        });
    }
  };

  const updateUserImage = async (req, res) => {

    try {
           const { userId } = req.params; 
           const imagePath = req.file.path; 
   
          
           const updatedUser = await User.findByIdAndUpdate(userId, { image: imagePath }, { new: true });
   
           res.status(200).json({ success: true, message: "Image de profil mise à jour avec succès", user: updatedUser });
       } catch (error) {
           console.error(error);
           res.status(500).json({ success: false, message: "Erreur lors de la mise à jour de l'image de profil" });
       }
   };
   
   const updatePassword = async (req, res) => {
    const { userId } = req.params; // L'ID de l'utilisateur dont le mot de passe doit être mis à jour
    const { oldPassword, newPassword } = req.body; // L'ancien et le nouveau mot de passe fournis par l'utilisateur

    if (!oldPassword || !newPassword) {
        return res.status(400).json({ success: false, message: "L'ancien et le nouveau mot de passe sont requis." });
    }

    try {
        // Rechercher l'utilisateur par son ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "Utilisateur non trouvé." });
        }

        // Vérifier que l'ancien mot de passe est correct
        const isMatch = crypto.createHash('sha256').update(oldPassword).digest('hex') === user.password;

        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Le ancien mot de passe n'est pas correct" });
        }

        // Hacher le nouveau mot de passe avant de l'enregistrer
        const hashedNewPassword = crypto.createHash('sha256').update(newPassword).digest('hex');
        user.password = hashedNewPassword;

        // Enregistrer l'utilisateur avec le nouveau mot de passe haché
        await user.save();

        res.status(200).json({ success: true, message: "Password is updated." });
    } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe :", error);
        res.status(500).json({ success: false, message: "Erreur lors de la mise à jour du mot de passe." });
    }

};





const getUsersWithRoleF = async (req, res) => {
  try {
      const users = await User.find({ role: 'F' });

      // Function to remove the "F.T" prefix and trim the remaining name
      const extractSortableName = (name) => {
          return name.replace(/^F\s*\.?\s*T\s*/i, '').trim().toLowerCase();
      };

      // Sort users alphabetically by the part of the name after "F.T"
      users.sort((a, b) => {
          const nameA = extractSortableName(a.name);
          const nameB = extractSortableName(b.name);

          return nameA.localeCompare(nameB);
      });

      res.status(200).json({ success: true, users });
  } catch (error) {
      console.error('Error retrieving users with role F:', error);
      res.status(500).json({ success: false, message: 'Server error while fetching users with role F', error: error.message });
  }
};



 
const getUsersWithRoleMC = async (req, res) => {
    try {
        const users = await User.find({ role: 'MC' }).select('name image');
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error retrieving users with role MC:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching users with role MC', error: error.message });
    }
};

const getUsersNameF = async (req, res) => {
  try {
      const users = await User.find({ role: 'F' }).select('name image');

      // Sort users alphabetically by the part of the name after "F.T"
      users.sort((a, b) => {
          const extractSortableName = (name) => {
              // Remove the "F.T" prefix, trim whitespace, and return the remaining part of the name
              return name.replace(/^F\s*\.?\s*T\s*/i, '').trim().toLowerCase();
          };

          const nameA = extractSortableName(a.name);
          const nameB = extractSortableName(b.name);

          return nameA.localeCompare(nameB); // Alphabetical order
      });

      res.status(200).json({ success: true, users });
  } catch (error) {
      console.error('Error retrieving users with role F:', error);
      res.status(500).json({ success: false, message: 'Server error while fetching users with role F', error: error.message });
  }
};


const blockUser = async (req, res) => {
    const userId = req.params.id;
    try {
      // Attempt to find the user by their _id
      const user = await User.findById(userId);
  
      if (!user) {
        // If the user wasn't found (already deleted or never existed), return a status indicating failure
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
  
      user.blocked = true;
      // Save the updated user data
      await user.save();
  
      // If the user was successfully blocked, return a status indicating success
      return res
        .status(200)
        .json({ success: true, message: "User blocked successfully." });
    } catch (error) {
      console.error("Error blocking user:", error);
  
      // If an error occurred during the process, return a status indicating failure along with the error message
      return res.status(500).json({
        success: false,
        message: "Error blocking user.",
        error: error.message,
      });
    }
  };
  
  const unBlockUser = async (req, res) => {
    const userId = req.params.id;
    try {
      // Attempt to find the user by their _id
      const user = await User.findById(userId);
  
      if (!user) {
        // If the user wasn't found (already deleted or never existed), return a status indicating failure
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }
  
      user.blocked = false;
      // Save the updated user data
      await user.save();
  
      // If the user was successfully unblocked, return a status indicating success
      return res
        .status(200)
        .json({ success: true, message: "User unblocked successfully." });
    } catch (error) {
      console.error("Error unblocking user:", error);
  
      // If an error occurred during the process, return a status indicating failure along with the error message
      return res.status(500).json({
        success: false,
        message: "Error unblocking user.",
        error: error.message,
      });
    }
  };


  const getUsersByName = async (req, res) => {
    const name = req.params.name;
    try {
      const users = await User.find({ name: { $regex: name, $options: 'i' } });
      res.status(200).json({ success: true, users });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  };
  
module.exports = {
    getUsersByName,
   getAllUsers,
   getUserbyId,
   deleteUser,
   addUserToWaitlist,
   signin,
   signup,
   getWaitList,
   updateUser,
   confirmUser,
   refuseUser,
   getUserByEmail,
   getUserWaiting,
   getUserProfile,
   updateUserImage,
   updatePassword,
   getUsersWithRoleMC,
   getUsersWithRoleF,
 getUsersNameF,
   addAdmin,
   blockUser,
   unBlockUser,
   unBlockUserAccount
   
};