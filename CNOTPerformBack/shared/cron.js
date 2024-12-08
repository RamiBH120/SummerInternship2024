const nodeCron = require('node-cron');
const fetchemails = require('./imap');
const mailaccount = require('../models/mailaccount');

const cronFetchEmail = () => {
    nodeCron.schedule('* * * * *',async () => {
        let i = 0;
        const accounts = await mailaccount.find();
        accounts.forEach(account => {
            fetchemails(account.mailaddress, account.password);  
        });
    })
}

module.exports = cronFetchEmail;