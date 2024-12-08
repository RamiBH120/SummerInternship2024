import React, { useEffect, useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { getBourses } from '../../service/bourseService';

function SommeModal({ modal, toggle, federation, nomFederation }) {

    const [totalMontant, setTotalMontant] = useState(0);

    const fetchBourses = async (federation) => {
        try {
            const response = await getBourses(null, null, null, federation, 'acceptee');

            const total = response.data.reduce((acc, bourse) => {
                const montant = Number(bourse.montant) || 0; // S'assurer que le montant est un nombre
                return acc + montant;
            }, 0);

            setTotalMontant(total); 
        } catch (error) {
            console.error("Erreur lors de la récupération des bourses :", error);
        }
    };

    useEffect(() => {
        if (modal) { 
            fetchBourses(federation);
        }
    }, [modal, federation]); 

    return (
        <div>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>La somme déja accordée à {nomFederation}</ModalHeader>
                <ModalBody>
                    <div>Vous avez l'accordée: <span className='fw-bold'>{totalMontant} TND</span></div>
                    
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

export default SommeModal;
