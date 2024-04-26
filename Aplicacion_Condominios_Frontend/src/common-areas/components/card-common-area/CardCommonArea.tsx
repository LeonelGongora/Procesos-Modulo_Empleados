import { Link } from "react-router-dom";
import { CommonArea } from "../../interfaces/common-areas";

import "./card-common-area.css";
import {
  Button,
  Card,
  CardBody,
  CardSubtitle,
  CardText,
  CardTitle,
} from "reactstrap";

const baseImageUrl = "http://localhost:8000";

interface CardCommonAreaProps {
  commonArea: CommonArea;
}

export default function CardCommonArea({ commonArea }: CardCommonAreaProps) {
  return (
    <Card
      style={{
        width: "18rem",
      }}
    >
      <img
        className="image-common-area"
        alt="Sample"
        src={`${baseImageUrl}/${commonArea.urlImage}`}
      />

      <CardBody>
        <CardTitle tag="h5">{commonArea.name}</CardTitle>
        <CardSubtitle className="mb-2 text-muted" tag="h6">
          Capacidad: {commonArea.capacity} personas
        </CardSubtitle>
        <CardText>{commonArea.description}</CardText>
        <Button color="info">
          <Link
            className="card-common-area-link"
            to={`/areas-comunes/${commonArea.id}`}
          >
            Ver detalles
          </Link>
        </Button>
      </CardBody>
    </Card>
  );
}
