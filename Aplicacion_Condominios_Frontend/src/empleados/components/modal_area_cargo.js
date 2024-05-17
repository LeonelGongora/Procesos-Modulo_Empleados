import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function Modal_Area_Cargo() {
  const [show, setShow] = useState(false);
  const [charges, setCharges] = useState([]);
  const [chargeValue, setChargeValue] = useState("");
  const [id, setId] = useState(0);
  const [area, setArea] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const addCharge = () => {
    if (chargeValue !== "") {
      setId(id + 1);
      setChargeValue("");
      setCharges([...charges, { id: id, title: chargeValue }]);
    }
  };

  const removeCharge = (id) => {
    const filteredList = charges.filter((item) => item.id !== id);
    setCharges(filteredList);
  };

  const loadArea = (e) => {
    setArea(e.target.value);
  };

  const saveData = () => {
    // Guardar en BD
    handleClose();
    setCharges([]);
    setArea("");
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Añadir Area
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        scrollable
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="">
              <Form.Label>
                <b>Nombre de Area</b>
              </Form.Label>
              <Form.Control 
                type="text"
                value={area}
                onChange={(e) => loadArea(e)} 
                autoFocus 
              />
            </Form.Group>
            <hr />
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>
                <b>Cargos</b>
              </Form.Label>
              <Form.Group>
                {/* Cargos ingresados */}
                {charges.map((each) => {
                  return (
                    <div
                      key={each.id}
                      className="bg-light border rounded d-flex justify-content-between mb-1 p-2"
                    >
                      {each.title}
                      <button
                        type="button"
                        onClick={() => removeCharge(each.id)}
                        variant="primary"
                      >
                        x
                      </button>
                    </div>
                  );
                })}
              </Form.Group>
              <Form.Control
                type="text"
                autoFocus
                placeholder="Agregue un cargo."
                value={chargeValue}
                onChange={(e) => {
                  setChargeValue(e.target.value);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") addCharge();
                }}
              />
            </Form.Group>
            <Button variant="primary" onClick={() => addCharge()}>
              Agregar cargo
            </Button>
          </Form>
          <hr />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => saveData()}>
            Guardar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Modal_Area_Cargo;
