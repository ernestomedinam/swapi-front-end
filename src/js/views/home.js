import React, { useContext } from "react";
import "../../styles/home.scss";
import { Context } from "../store/appContext";
import ItemCard from "../component/ItemCard";

export const Home = () => {
	const { store, actions } = useContext(Context);
	return (
		<div className="container">
			{store.endpoints.map((endpoint, index) => {
				return (
					<React.Fragment key={index}>
						<h2 className="display-3 mt-4">{`${endpoint.charAt(0).toUpperCase()}${endpoint.slice(1)}`}</h2>
						<div className="horizontal-deck">
							{store[endpoint].length > 0 && (
								<React.Fragment>
									{store[endpoint].map(item => {
										return <ItemCard key={item.globalId} nature={endpoint} item={item} />;
									})}
								</React.Fragment>
							)}
						</div>
						<hr className="my-4" />
					</React.Fragment>
				);
			})}
		</div>
	);
};
