const Imap = require('imap');
const { convert } = require('html-to-text');
const fs = require('fs');
const { simpleParser } = require('mailparser');
const mail = require('../models/mail');
const { mailStatus } = require('./enum');

const fetchemails = (email, password, res) => {
let host = '';
if(email && password){

const domain = email.substring(email.lastIndexOf('@')+1);

if (domain === 'gmail.com') {
    host =  'imap.gmail.com';
}

if (domain === 'outlook.com' || domain === 'hotmail.com' || domain === 'live.com') {
    host = 'imap-mail.outlook.com';
}


let imap = new Imap({
  user: email,
  password: password,
  host: host,
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false
  }
});

imap.once('ready', () => {
    imap.openBox('INBOX', false, () => {
      imap.search(['UNSEEN', ['SINCE', 'Jan 01, 2023']], (err, results) => {
        if (err) {
          console.error('Search error:', err);
          imap.end();
          return;
        }
  
        // Check if there are no results from the search
        if (results.length === 0) {
          if(res){
            res.json('No unseen emails found.');
          }
            imap.end();
          return;
        }
  
        const f = imap.fetch(results, { bodies: '', markSeen: true });
  
        f.on('message', (msg) => {
          const Mail = new mail();
  
          msg.on('body', (stream, info) => {
            simpleParser(stream, async (err, parsed) => {
                console.log(parsed.text);
              if (err) {
                console.error('Parsing error:', err);
                return;
              }
  
              Mail.from = parsed.from.value[0].address;
              Mail.to = parsed.to.value.map(addr => addr.address)[0];
              Mail.date = parsed.date;
              Mail.subject = parsed.subject;
              if(parsed.text){
              Mail.body = parsed.html;
              }
              else{
                Mail.body = convert(parsed.html, {
                  wordwrap: 130 
                });
              }
              // Handle attachments
              if (parsed.attachments && parsed.attachments.length > 0) {
                const date = new Date();
                console.log('Attachments found:', parsed.attachments);
                // You can handle attachments here
                const attachmentFolder = './attachments';
                if (!fs.existsSync(attachmentFolder)) {
                  fs.mkdirSync(attachmentFolder);
                }
                
                // Save each attachment
                parsed.attachments.forEach((attachment) => {
                  const fileName = `${date.getDate()}${date.getMonth() + 1}${date.getFullYear()}${attachment.filename ? `_${attachment.filename}` : ''}`;
                  const filePath = `${attachmentFolder}/${fileName}`;
              
                  fs.writeFile(filePath, attachment.content, (err) => {
                    if (err) {
                      console.error('Error saving attachment:', err);
                    } else {
                      console.log(`Attachment saved: ${fileName}`);
                    }
                  });
                  Mail.attachements.push(filePath);
                });
              }
  
              console.log('Mail:', Mail);
              Mail.unread = true;
              Mail.bookmarked = false;
              Mail.save();
            });
          });
        });
  
        f.once('error', (err) => {
          console.error('Fetch error:', err);
          // Handle fetch error
        });
  
        f.once('end', () => {
            if(res){
            res.json("fetched successfully");
            }
            imap.end();
        });
      });
    });
  });
  
  // Handle connection errors
  imap.once('error', (err) => {
    if(res){
    res.json({"error":'IMAP connection error: '+err});
    }
  });
  
  // Handle connection end
  imap.once('end', () => {
    console.log('Connection ended');
  });
  imap.connect();
}
}

module.exports = fetchemails;