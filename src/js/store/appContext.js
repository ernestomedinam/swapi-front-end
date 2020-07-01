import React, { useState, useEffect } from "react";
import getState from "./flux.js";

// Don't change, here is where we initialize our context, by default it's just going to be null.
export const Context = React.createContext(null);

// This function injects the global store to any view/component where you want to use it, we will inject the context to layout.js, you can see it here:
// https://github.com/4GeeksAcademy/react-hello-webapp/blob/master/src/js/layout.js#L35
const injectContext = PassedComponent => {
	const StoreWrapper = props => {
		//this will be passed as the contenxt value
		const [state, setState] = useState(
			getState({
				getStore: () => state.store,
				getActions: () => state.actions,
				setStore: updatedStore =>
					setState({
						store: Object.assign(state.store, updatedStore),
						actions: { ...state.actions }
					})
			})
		);
		useEffect(() => {
			// if (localStorage.getItem("store")) {
			// 	for (let endpoint of state.store.endpoints) {
			// 		state.actions.localItems(endpoint);
			// 	}
			// }
			console.log(`this is local ${JSON.parse(localStorage.getItem("people"))}`);
			for (let endpoint of state.store.endpoints) {
				if (
					localStorage.getItem(endpoint) != null &&
					new Date().getTime() - JSON.parse(localStorage.getItem(`${endpoint}Timestamp`)) < 1000000
				) {
					state.actions.localItems(endpoint);
				} else {
					state.actions.fetchItems(endpoint);
				}
			}
			return () => {
				// console.log("running store cleanup");
				// localStorage.setItem("store", state.store);
			};
		}, []);
		// The initial value for the context is not null anymore, but the current state of this component,
		// the context will now have a getStore, getActions and setStore functions available, because they were declared
		// on the state of this component
		return (
			<Context.Provider value={state}>
				<PassedComponent {...props} />
			</Context.Provider>
		);
	};
	return StoreWrapper;
};

export default injectContext;
