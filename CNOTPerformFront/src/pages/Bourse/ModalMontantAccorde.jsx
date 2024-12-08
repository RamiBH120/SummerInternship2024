import React, { useState } from 'react'
import { Button, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'
import { acceptee } from '../../service/bourseService';

function ModalMontantAccorde({modal, toggle, id}) {
 const [montant, setMontant] = useState(0);

  return (
    <div>
    <Modal isOpen={modal} toggle={toggle}>
      <ModalHeader toggle={toggle}>Entrer Le Montant Accordée à La Bourse</ModalHeader>
      <ModalBody>
        <Label for="montant">
            Montant Accordé
        </Label>
        <Input id="montant" name="montant" type="number" onChange={(event) =>setMontant(event.target.value)}/>
      </ModalBody>
      <ModalFooter>
        <Button color="success" onClick={async() => {
            await acceptee(id, montant);
            toggle();
        }}>
          Accepter
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  </div>
  )
}

export default ModalMontantAccorde