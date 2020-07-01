const api = "https://swapi.dev/api/";
const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			endpoints: ["people", "vehicles", "planets"],
			peopleResponse: {},
			people: [],
			planetsResponse: {},
			planets: [],
			vehiclesResponse: {},
			vehicles: [],
			favorites: JSON.parse(localStorage.getItem("favorites")) || [],
			single: {},
			searchResults: []
		},
		actions: {
			fetchItem: async (endpoint, id) => {
				const store = getStore();
				let url = `${api}${endpoint}/${id}/`;
				try {
					let response = await fetch(url);
					if (response.ok) {
						let single = await response.json();
						let singleId = single.url.match(/[/][0-9]+[/]/)[0].replace(/[/]/g, "");
						let singleGlobalId = `${endpoint}-${singleId}`;
						setStore({
							...store,
							single: {
								...single,
								id: singleId,
								globalId: singleGlobalId
							}
						});
					} else {
						setStore({
							...store,
							single: { status: response.status }
						});
					}
				} catch (error) {
					setStore({
						...store,
						single: { status: error }
					});
				}
			},
			fetchItems: async (endpoint, page = 1) => {
				const store = getStore();
				let url = `${api}${endpoint}/?page=${page}`;
				try {
					let response = await fetch(url);
					let itemList = store[endpoint];
					if (response.ok) {
						let responseObject = await response.json();
						for (let item of responseObject.results) {
							item.id = item.url.match(/[/][0-9]+[/]/)[0].replace(/[/]/g, "");
							item.globalId = `${endpoint}-${item.id}`;
							itemList.push(item);
						}
						localStorage.setItem(endpoint, JSON.stringify(itemList));
						localStorage.setItem(
							`${endpoint}Response`,
							JSON.stringify({
								count: responseObject.count,
								previous: responseObject.previous,
								next: responseObject.next == null ? null : responseObject.next.split("=")[1]
							})
						);
						localStorage.setItem(`${endpoint}Timestamp`, JSON.stringify(new Date().getTime()));
						setStore({
							...store,
							[endpoint]: itemList,
							[`${endpoint}Response`]: {
								count: responseObject.count,
								previous: responseObject.previous,
								next: responseObject.next == null ? null : responseObject.next.split("=")[1]
							}
						});
					} else {
						setStore({
							...store,
							[endpoint]: [],
							[`${endpoint}Response`]: { status: response.status }
						});
					}
				} catch (error) {
					setStore({
						...store,
						[endpoint]: [],
						[`${endpoint}Response`]: { status: error }
					});
				}
			},
			addFavorite: item => {
				const store = getStore();
				localStorage.setItem("favorites", JSON.stringify([...store.favorites, item]));
				setStore({
					...store,
					favorites: [...store.favorites, item]
				});
			},
			removeFavorite: globalId => {
				const store = getStore();
				let newFavs = store.favorites.filter(item => {
					return item.globalId != globalId;
				});
				localStorage.setItem("favorites", JSON.stringify([...store.favorites, newFavs]));
				setStore({
					...store,
					favorites: newFavs
				});
			},
			clearSingle: () => {
				const store = getStore();
				setStore({
					...store,
					single: {}
				});
			},
			getSearch: async search => {
				const store = getStore();
				let searchResults = [];
				for (let endpoint of store.endpoints) {
					let url = `${api}${endpoint}/?search=${search}`;
					let response = await fetch(url);
					if (response.ok) {
						let responseObject = await response.json();
						if (responseObject.count > 0) {
							for (let item of responseObject.results) {
								let id = item.url.match(/[/][0-9]+[/]/)[0].replace(/[/]/g, "");
								let globalId = `${endpoint}-${id}`;
								searchResults.push({
									...item,
									id: id,
									globalId: globalId
								});
							}
						}
					}
				}
				setStore({
					...store,
					searchResults: searchResults
				});
			},
			clearSearch: () => {
				const store = getStore();
				setStore({
					...store,
					searchResults: []
				});
			},
			localItems: endpoint => {
				const store = getStore();
				setStore({
					...store,
					[endpoint]: JSON.parse(localStorage.getItem(endpoint)),
					[`${endpoint}Response`]: JSON.parse(localStorage.getItem(`${endpoint}Response`))
				});
			}
		}
	};
};

export default getState;
