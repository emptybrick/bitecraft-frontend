import { Link } from "react-router";
import Button from "../Button/Button";

const QuickViewCard = ({ item, onClick, id, target, link, buttonText }) => {
  return (
    <div className="card">
      <div className="card-header has-background-primary-20">
        <div className="card-header-title has-text-white">{item.name}</div>
      </div>
      <div className="card-content">
        <div className="is-6 pl-2 pr-2 card-content-override-details">
          {item.details}
        </div>
        <div className="is-8 pt-3">
          Created by:{" "}
          <span className="has-text-weight-semibold">
            {item.author.username}
          </span>
        </div>
        <div className="buttons is-grouped are-small is-centered mt-4">
          <button
            className="button modal-trigger has-background-info-90"
            id={id}
            data-target={target}
            onClick={onClick}
          >
            Quick View
          </button>
          <Link className="ml-1" to={link}>
            <Button
              className="button has-background-link-70"
              buttonText={buttonText}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default QuickViewCard;
