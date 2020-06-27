import React, { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/appContext";
import { useHistory } from "react-router-dom";

const ItemCard = ({ nature, item }) => {
	const { store, actions } = useContext(Context);
	const [faved, setFaved] = useState(false);
	const history = useHistory();
	useEffect(() => {
		let faved = false;
		for (let fav of store.favorites) {
			if (fav.globalId == item.globalId) {
				faved = true;
				break;
			}
		}
		setFaved(faved);
	}, [store.favorites]);
	return (
		<div className="card mx-2" style={{ minWidth: 314 + "px", width: 314 + "px" }}>
			<img src="https://via.placeholder.com/400x200" className="card-img-top" alt="..." />
			<div className="card-body">
				<h5 className="card-title mb-3">{item.name}</h5>
				{nature == "people" ? (
					<React.Fragment>
						<p className="card-text mb-0">{`gender: ${item.gender}`}</p>
						<p className="card-text mb-0">{`hair color: ${item.hair_color}`}</p>
						<p className="card-text">{`eye color: ${item.eye_color}`}</p>
					</React.Fragment>
				) : nature == "planets" ? (
					<React.Fragment>
						<p className="card-text mb-0">{`population: ${item.population}`}</p>
						<p className="card-text">{`terrain: ${item.terrain}`}</p>
					</React.Fragment>
				) : (
					<React.Fragment>
						<p className="card-text mb-0">{`crew: ${item.crew}`}</p>
						<p className="card-text mb-0">{`passengers: ${item.passengers}`}</p>
						<p className="card-text mb-0">{`class: ${item.vehicle_class}`}</p>
						<p className="card-text">{`cargo: ${item.cargo_capacity}`}</p>
					</React.Fragment>
				)}
				<div className="d-flex flex-nowrap justify-content-between">
					<button onClick={e => history.push(`/single/${item.globalId}`)} className="btn btn-primary">
						{"learn more"}
					</button>
					<button
						className="btn btn-outline-warning"
						onClick={e => {
							if (faved) {
								actions.removeFavorite(item.globalId);
							} else {
								actions.addFavorite(item);
							}
						}}>
						{!faved ? <i className="far fa-heart" /> : <i className="fas fa-heart" />}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ItemCard;

ItemCard.propTypes = {
	nature: PropTypes.string,
	item: PropTypes.object
};
