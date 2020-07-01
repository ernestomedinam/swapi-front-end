import React, { useContext } from "react";
import "../../styles/home.scss";
import { Context } from "../store/appContext";
import ItemCard from "../component/ItemCard";
import LoadMore from "../component/LoadMore";

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
							{"next" in store[`${endpoint}Response`] && store[`${endpoint}Response`].next != null && (
								<LoadMore endpoint={endpoint} next={store[`${endpoint}Response`].next} />
							)}
						</div>
						<hr className="my-4" />
					</React.Fragment>
				);
			})}
		</div>
	);
};
