import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const ModalConfirm = (props) => {
	const { isOpen, toggle, confirm, message } = props;

	return (
		<Modal isOpen={isOpen} toggle={toggle} centered>
			<ModalHeader toggle={toggle}>Confirmación</ModalHeader>
			<ModalBody>
				{message}
			</ModalBody>
			<ModalFooter>
				<Button color="primary" onClick={confirm}>Confirmar</Button>{' '}
			</ModalFooter>
		</Modal>
	);
}

export default ModalConfirm;