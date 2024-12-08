const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const Message = require('../models/message');
const User = require('../models/user');
const moment = require('moment');






require('moment/locale/fr'); // Import French locale



// Set up storage engine


// Initialize upload variable
/*const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 }, // Increased to 10MB to support larger files
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('file');
*/
// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|webm|mp3|wav/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Files of this type are not allowed!');
  }
}

// Upload endpoint
router.post('/uploaddd', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.status(400).json({ error: err });
    } else {
      if (req.file == undefined) {
        res.status(400).json({ error: 'No file selected!' });
      } else {
        res.json({ url: `/uploads/${req.file.filename}` });
      }
    }
  });
});

// Endpoint to fetch messages between two users
router.get('/messages/:userId/:contactId', async (req, res) => {
  try {
    const { userId, contactId } = req.params;
    const query = {
      $or: [
        { sender: userId, receiver: contactId },
        { sender: contactId, receiver: userId }
      ]
    };
    const messages = await Message.find(query);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


function formatShortTimeDiff(timestamp) {
  const now = moment();
  const diffInSeconds = now.diff(moment(timestamp), 'seconds');
  const diffInMinutes = now.diff(moment(timestamp), 'minutes');
  const diffInHours = now.diff(moment(timestamp), 'hours');
  const diffInDays = now.diff(moment(timestamp), 'days');
  const diffInMonths = now.diff(moment(timestamp), 'months');
  const diffInYears = now.diff(moment(timestamp), 'years');

  if (diffInSeconds < 60) {
    return `${diffInSeconds} sec`;
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return `${diffInHours} h`;
  } else if (diffInDays < 30) {
    return `${diffInDays} j`;
  } else if (diffInMonths < 12) {
    return `${diffInMonths} mois`;
  } else {
    return `${diffInYears} an`;
  }
}

router.get('/contacts/:userId', async (req, res) => {
  try {
    const { userId } = req.params;


    // Fetch all contacts (users with role 'F')
    const contacts = await User.find({ role: 'F' });

    // Fetch the last message for each contact
    const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: contact._id },
          { sender: contact._id, receiver: userId }
        ]
      }).sort({ timestamp: -1 });

      // Calculate time difference
      const timeDiff = lastMessage ? formatShortTimeDiff(lastMessage.timestamp) : "Aucun message";
      const lastMessageText = lastMessage 
        ? lastMessage.sender == userId 
          ? `Vous: ${lastMessage.message}` 
          : `${contact.name}: ${lastMessage.message}`
        : '';

      return {
        _id: contact._id,
        name: contact.name,
        image: contact.image,
        lastMessageTimeDiff: timeDiff,
        lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null,
        lastMessageText: lastMessageText
      };
    }));

    // Sort contacts by the last message timestamp
    const sortedContacts = contactsWithLastMessage.sort((a, b) => {
      if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
        return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
      } else if (a.lastMessageTimestamp) {
        return -1;
      } else if (b.lastMessageTimestamp) {
        return 1;
      } else {
        return 0;
      }
    });

    res.json(sortedContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});


router.get('/contactsMC/:userId', async (req, res) => {
  try {
    const { userId } = req.params;


    // Fetch all contacts (users with role 'F')
    const contacts = await User.find({ role: 'MC' });

    // Fetch the last message for each contact
    const contactsWithLastMessage = await Promise.all(contacts.map(async (contact) => {
      const lastMessage = await Message.findOne({
        $or: [
          { sender: userId, receiver: contact._id },
          { sender: contact._id, receiver: userId }
        ]
      }).sort({ timestamp: -1 });

      // Calculate time difference
      const timeDiff = lastMessage ? formatShortTimeDiff(lastMessage.timestamp) : "Aucun message";
      const lastMessageText = lastMessage 
        ? lastMessage.sender == userId 
          ? `Vous: ${lastMessage.message}` 
          : `${contact.name}: ${lastMessage.message}`
        : '';

      return {
        _id: contact._id,
        name: contact.name,
        image: contact.image,
        lastMessageTimeDiff: timeDiff,
        lastMessageTimestamp: lastMessage ? lastMessage.timestamp : null,
        lastMessageText: lastMessageText
      };
    }));

    // Sort contacts by the last message timestamp
    const sortedContacts = contactsWithLastMessage.sort((a, b) => {
      if (a.lastMessageTimestamp && b.lastMessageTimestamp) {
        return new Date(b.lastMessageTimestamp) - new Date(a.lastMessageTimestamp);
      } else if (a.lastMessageTimestamp) {
        return -1;
      } else if (b.lastMessageTimestamp) {
        return 1;
      } else {
        return 0;
      }
    });

    res.json(sortedContacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});



module.exports = router;
