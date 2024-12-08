// bourseRoute.js
const express = require("express");
const Bourse = require("../models/bourse");
const {
  bourseDomaines,
  bourseGroupes,
  bourseStatus,
} = require("../shared/enum");
const user = require("../models/user");
const router = express.Router();

// Use a reference to the socket.io instance
let io;

// Accept io instance from outside
module.exports = (ioInstance) => {
  io = ioInstance;

  router.get("/", async (req, res) => {
    try{
    let params = {};
    let skip = 0;
    const page = req.query.page;
    const groupe = req.query.groupe;
    const domaine = req.query.domaine;
    const federation = req.query.federation;
    const status = req.query.status;
    if (groupe && groupe != "Groupe") {
      params["groupe"] = groupe.trim();
    }
    if (domaine && domaine != "Domaine") {
      params["domaine"] = domaine;
    }
    if (federation && federation != "Federation") {
      params["Federation_Conserne"] = federation;
    }
    if (status && status != "Status") {
      params["status"] = status;
    }
    if (page != 1) {
      skip = page * 10;
    }

    const bourses = await Bourse.find(params)
      .populate("Federation_Conserne")
      .skip(skip)
      .limit(10);

    res.json(bourses);
  } catch{
    res.status(500).json({ message: 'An error occurred while fetching bourses.' });
  }
  });

  router.post("/", async (req, res) => {
    try{
    const bourse = new Bourse({
      nature: req.body.nature,
      rapportTech: "",
      rapportFinan: "",
      description: req.body.description,
      Federation_Conserne: req.body.federation,
      domaine: bourseDomaines[req.body.domaine],
      groupe: bourseGroupes[req.body.groupe],
      date: req.body.date,
      budgetPrev: req.body.budgetPrev,
    });

    await bourse.save();

    io.emit('newBourse', bourse);

    res.json({ message: "bourse ajoutée avec succées" });
  }catch{
    res.status(500).json({ message: 'An error occurred while adding bourse.' });
  }
  });

  router.get("/:id", async (req, res) => {
    try{
    const bourses = await Bourse.findById(req.params.id);
    res.json(bourses);
    }catch{
      res.status(500).json({ message: 'An error occurred while fetching bourse by id.' });
    }
  });

  router.put("/:id", async (req, res) => {
    try {
      await Bourse.findByIdAndUpdate(req.params.id, {
        titre: req.body.titre,
        montant: req.body.montant,
        liste_documents: req.body.liste_documents,
        Federation_Conserne: req.body.Federation_Conserne,
      });

      res.json({ message: "bourse mis à jour avec succées" });
    } catch {
      res.json({ message: "erreur lors de mise à jour du bourse" });
    }
  });

  router.delete("/:id", async (req, res) => {
    try {
      await Bourse.findByIdAndDelete(req.params.id);
      res.json({ message: "bourse supprimée avec succées" });
    } catch {
      res.json({ message: "erreur lors de suppression du bourse" });
    }
  });

  router.get("/getboursebygroupe/:groupe", async (req, res) => {
    try{
    const bourses = await Bourse.find({
      groupe: bourseGroupes[req.params.groupe],
    });
    res.json(bourses);
    }catch{
      res.status(500).json({ message: 'An error occurred while fetching bourses by groupe.' });
    }
  });

  router.get("/getboursebyfederation/:federation", async (req, res) => {
    try{
    const bourses = await Bourse.find({
      Federation_Conserne: req.params.federation,
    });
    res.json(bourses);
  }catch{
    res.status(500).json({ message: 'An error occurred while fetching bourses by federation.' });
  }
  });

  router.put("/acceptee/:id/:montant", async (req, res) => {
    try{
    const bourse = await Bourse.findByIdAndUpdate(req.params.id, {
      status: bourseStatus.acceptee,
      montant: req.params.montant,
    });
    io.emit('bourseAccepted',bourse);
    res.json(bourse);
  }catch{
    res.status(500).json({ message: 'An error occurred while updating bourse status to acceptee.' });
  }
  });

  router.put("/refusee/:id", async (req, res) => {
    try{
    const bourse = await Bourse.findByIdAndUpdate(req.params.id, {
      status: bourseStatus.refusee,
    });
    io.emit('bourseRefused',bourse);
    res.json(bourse);
  }catch{
    res.status(500).json({ message: 'An error occurred while updating bourse status to refusee.' });
  }
  });

  router.put("/encours/:id", async (req, res) => {
    try{
    const bourse = await Bourse.findByIdAndUpdate(req.params.id, {
      status: bourseStatus.traitement,
    });
    res.json(bourse);
  }catch{
    res.status(500).json({ message: 'An error occurred while updating bourse status to encours.' });
  }
  });

  router.put("/attente/:id", async (req, res) => {
    try{
    const bourse = await Bourse.findByIdAndUpdate(req.params.id, {
      status: bourseStatus.attente,
    });
    res.json(bourse);
  }catch{
    res.status(500).json({ message: 'An error occurred while updating bourse status to attente.' });
  }
  });

  return router;
};
