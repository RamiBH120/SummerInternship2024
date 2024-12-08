import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import { getPredictionByCnotid } from '../../service/predictionHistoryService';
import cnot from "../../../public/assets/images/logo/CNOT_icon.png"
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

function HistoriqueModal({ modal, toggle, id, predictionType }) {
    const [historique, setHistorique] = useState(null);
    const [base64Image, setBase64Image] = useState('');

    const fetchHistorique = async (id) => {
        try {
            const response = await getPredictionByCnotid(id);
            const result = response.data;
            setHistorique(result[0]);
        } catch (error) {
            console.error('Error fetching historique:', error);
        }
    };
    function convertToBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

    useEffect(() => {
        if (id) {
            fetchHistorique(id);
            console.log(predictionType);
            
        }
    }, [id]);

    useEffect(() => {
        fetch(cnot)
          .then(response => response.blob())
          .then(blob => convertToBase64(blob))
          .then(base64 => setBase64Image(base64))
          .catch(error => console.error('Error converting image:', error));
      }, []);

      const generatePdf = (prediction, athleteName) => {
        // Prepare content for PDF
        const docDefinition = {
            content: [
              // Header section
              {
                columns: [
                  {
                    image: 'logo', // Placeholder for logo
                    width: 100,
                    alignment: 'left',
                  },
                  {
                    text: 'Rapport de Prédiction',
                    style: 'header',
                    alignment: 'right',
                    margin: [0, 20, 0, 0],
                  },
                ],
              },
              {
                text: `Nom de l'Athlète : ${athleteName}`,
                style: 'subheader',
                margin: [0, 20, 0, 5],
              },
              {
                text: `Date de Prédiction : ${new Date(prediction?.predictionDate).toLocaleDateString('en-GB')}`,
                style: 'subheader',
                margin: [0, 0, 0, 20],
              },
              {
                text: 'Détails de la Prédiction :',
                style: 'sectionHeader',
                margin: [0, 20, 0, 10],
              },
              // Add table for each prediction
                {
                  text: `${prediction.predictionname}`,
                  style: 'predictionHeader',
                  margin: [0, 10, 0, 5],
                },
                {
                  table: {
                    widths: ['*', '*'],
                    body: [
                      ['Caractéristique', 'Valeur'],
                      ...prediction.values.map((feature) => [
                        feature.feature,
                        feature.value + '%',
                      ]),
                    ],
                  },
                  margin: [0, 0, 0, 20],
                },
                {
                  text: `Résultat : ${prediction.predictionname === 'Prédiction du blessure pour la discipline athlétisme'? ( prediction.result ? 'Blessure probable' : 'Aucune blessure probable')
                    :(prediction.predictionname === 'Prédiction du performance pour la discipline athlétisme' ? (prediction.result ? 'Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.' : 'Désolé, vous ne gagnerez pas de médaille cette fois-ci.')
                    :(prediction.predictionname === 'Prédiction du blessure pour la discipline boxe' ? (prediction.result ? 'Attention, une blessure est probable' : 'Aucun risque de blessure détecté')
                    :(prediction.predictionname === 'Prédiction du perofrmance pour la discipline boxe' ? (prediction.result ? 'Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.' : 'Désolé, vous ne gagnerez pas de médaille cette fois-ci.')
                    :(prediction.predictionname === 'Prédiction du blessure pour la discipline natation' ? (prediction.result ? 'Attention, une blessure est probable' : 'Aucun risque de blessure détecté')
                    :(prediction.predictionname === 'Prédiction du performance pour la discipline natation' ? (prediction.result ? 'Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.' : 'Désolé, vous ne gagnerez pas de médaille cette fois-ci.')
                    :(prediction.predictionname === 'Prédiction du blessure pour la discipline taekwondo' ? (prediction.result ? 'Attention, une blessure est probable' : 'Aucun risque de blessure détecté')
                    :(prediction.predictionname === 'Prédiction du performance pour la discipline taekwondo' ? (prediction.result ? 'Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.' : 'Désolé, vous ne gagnerez pas de médaille cette fois-ci.')

                    :('autre discipline'))))))))}`,
                  style: 'resultText',
                  margin: [0, 5, 0, 20],
                },
              ,
              {
                text: 'Cnot Perform.',
                style: 'footer',
                alignment: 'center',
                margin: [0, 40, 0, 0],
              },
            ],
        
            styles: {
              header: {
                fontSize: 20,
                bold: true,
              },
              subheader: {
                fontSize: 14,
                bold: true,
              },
              sectionHeader: {
                fontSize: 16,
                bold: true,
                decoration: 'underline',
              },
              predictionHeader: {
                fontSize: 14,
                bold: true,
              },
              resultText: {
                fontSize: 12,
                italics: true,
              },
              footer: {
                fontSize: 10,
                italics: true,
              },
            },
        
            images: {
              logo: base64Image,
            },
          };
    
        pdfMake.createPdf(docDefinition).download(`Rapport_Prediction_${athleteName}.pdf`);
    };
    

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle} size="xl">
                <ModalHeader toggle={toggle}>Historique de prédiction</ModalHeader>
                <ModalBody>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Type de prédiction</th>
                                <th>Résultat</th>
                                <th>Télécharger</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historique?.predictionhistory?.length > 0 ? (
                                historique.predictionhistory.filter((prediction) => {return prediction.predictionname == predictionType;}).reverse().map((prediction, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{prediction.predictionname}</td>
                                        <td>{prediction.predictionname === 'Prédiction du blessure pour la discipline athlétisme'? ( prediction.result ? <span>Blessure probable</span> : <span>Aucune blessure probable</span>)
                                        :(prediction.predictionname === 'Prédiction du performance pour la discipline athlétisme' ? (prediction.result ? <span>Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.</span> : <span>Désolé, vous ne gagnerez pas de médaille cette fois-ci.</span>)
                                        :(prediction.predictionname === 'Prédiction du blessure pour la discipline boxe' ? (prediction.result ? <span>Attention, une blessure est probable'</span> : <span>Aucun risque de blessure détecté</span>)
                                        :(prediction.predictionname === 'Prédiction du perofrmance pour la discipline boxe' ? (prediction.result ? <span>Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.</span> : <span>Désolé, vous ne gagnerez pas de médaille cette fois-ci.</span>)
                                        :(prediction.predictionname === 'Prédiction du blessure pour la discipline natation' ? (prediction.result ? <span>Attention, une blessure est probable</span> : <span>Aucun risque de blessure détecté</span>)
                                        :(prediction.predictionname === 'Prédiction du performance pour la discipline natation' ? (prediction.result ? <span>Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.</span> : <span>Désolé, vous ne gagnerez pas de médaille cette fois-ci.</span>)
                                        :(prediction.predictionname === 'Prédiction du blessure pour la discipline taekwondo' ? (prediction.result ? <span>Attention, une blessure est probable</span> : <span>Aucun risque de blessure détecté</span>)
                                        :(prediction.predictionname === 'Prédiction du performance pour la discipline taekwondo' ? (prediction.result ? <span>Félicitations ! Vous gagnerez une médaille grâce à vos performances exceptionnelles.</span> : <span>Désolé, vous ne gagnerez pas de médaille cette fois-ci.</span>)

                                        :(<span>'autre discipline'</span>))))))))}</td>
                                        <td>
                                            <i className="mdi mdi-download me-2 fs-2"  onClick={() => generatePdf(prediction,historique.fullname)}/>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="text-center">
                                        No prediction history found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default HistoriqueModal;
