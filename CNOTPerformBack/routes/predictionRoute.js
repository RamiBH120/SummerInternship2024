const express = require('express');
const Prediction = require('../models/prediction');
const nodeMailer = require('../shared/nodemailer');
const identifiantMail = require('../shared/identifiantmail');

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        if(req.body.identifiantcnot){
                        
            const predictions = await Prediction.find({identifiantcnot: req.body.identifiantcnot});
            if(predictions.length != 0){
            const updatedPredictionHistory = predictions[0].predictionhistory;
            updatedPredictionHistory.push(req.body.prediction);
            await Prediction.findOneAndUpdate(
                { identifiantcnot: req.body.identifiantcnot },
                {predictionhistory:updatedPredictionHistory}
              );
              res.status(201).json({"message":"prédiction enregistrée"});
            }
            else {
                res.status(400).json({"message":"identifiant introuvable !!"});
            }
            } else {

                const predictions = await Prediction.find({cin: req.body.cin});
                if(predictions.length === 0){
                    const generateAthleteId = (fullName, cin) => {
                        // Séparer le nom complet en prénom et nom
                        const nameParts = fullName.split(" ");
                        const firstName = nameParts[0]; // Premier prénom
                        const lastName = nameParts.slice(1).join(" "); // Le reste est le nom de famille
                    
                        // Prendre les initiales ou les premières lettres du prénom et nom
                        const initials = firstName[0].toUpperCase() + lastName[0].toUpperCase();
    
                        return `${initials}-${cin}`;
                    }
                    const identifiant = generateAthleteId(req.body.fullname, req.body.cin);
                    const mailbody = identifiantMail({ athleteName: req.body.fullname, identifiant });                    
                    nodeMailer(process.env.EMAIL,process.env.PASSWORD,req.body.email, 'Identifiant CnotPerform', mailbody,null,null)
                    const body = req.body;
                    const newPrediction = new Prediction({identifiantcnot:identifiant,...body});
                    await newPrediction.save();
                    res.status(201).json({"message":"prédiction enregistrée et identifiant créé"});
            }else {
                res.status(400).json({"message":"cin existant veuillez utiliser votre identifiant !!"});
            }
        }
      

    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // 2. Get a prediction by ID
  router.get('/:id', async (req, res) => {
    try {
      const prediction = await Prediction.findOne({ id: req.params.id });
      if (!prediction) {
        return res.status(404).json({ message: 'Prediction not found' });
      }
      res.status(200).json(prediction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // 3. Update a prediction by ID
  router.put('/:id', async (req, res) => {
    try {
      const updatedPrediction = await Prediction.findOneAndUpdate(
        { id: req.params.id },
        req.body
      );
      if (!updatedPrediction) {
        return res.status(404).json({ message: 'Prediction not found' });
      }
      res.status(200).json(updatedPrediction);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // 4. Delete a prediction by ID
  router.delete('/:id', async (req, res) => {
    try {
      const deletedPrediction = await Prediction.findOneAndDelete({ id: req.params.id });
      if (!deletedPrediction) {
        return res.status(404).json({ message: 'Prediction not found' });
      }
      res.status(200).json({ message: 'Prediction deleted successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  
  // 5. Get all predictions (optional)
  router.get('/', async (req, res) => {
    try {
      const predictions = await Prediction.find();
      res.status(200).json(predictions);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });

  router.get('/findbycnotid/:cnotid', async (req, res) => {
    try {
        const prediction = await Prediction.find({identifiantcnot: req.params.cnotid});
        res.status(200).json(prediction);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
  });
  router.get('/findbycin/:cin', async (req, res) => {
    try {
        const prediction = await Prediction.find({cin: req.params.cin});
        res.status(200).json(prediction);
      } catch (err) {
        res.status(400).json({ error: err.message });
      }
  });

module.exports = router;