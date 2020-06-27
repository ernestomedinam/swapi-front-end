import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import swIcon from "../../img/swicon.png";
import { Context } from "../store/appContext";

export const Navbar = () => {
	const { store, actions } = useContext(Context);
	const [dropped, setDropped] = useState(false);
	const [search, setSearch] = useState("");
	const [options, setOptions] = useState([]);
	const history = useHistory();
	const searchRef = useRef();
	const dropRef = useRef();
	useEffect(() => {
		if (store.favorites.length == 0) {
			setDropped(false);
		}
	}, [store.favorites.length]);
	useEffect(() => {
		const handleClickOutside = event => {
			if (searchRef.current.contains(event.target)) {
				return;
			}
			setSearch("");
		};
		if (search.length > 2) {
			document.addEventListener("mousedown", handleClickOutside);
			actions.getSearch(search);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
			if (store.searchResults.length > 0) {
				actions.clearSearch();
			}
		}
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [search]);
	useEffect(() => {
		const handleDropUp = event => {
			if (dropRef.current.contains(event.target)) {
				return;
			}
			setDropped(false);
		};
		if (dropped) {
			document.addEventListener("mousedown", handleDropUp);
		} else {
			document.removeEventListener("mousedown", handleDropUp);
		}
		return () => document.removeEventListener("mousedown", handleDropUp);
	}, [dropped]);
	return (
		<nav className="navbar navbar-light bg-light mb-0 mb-md-3">
			<div className="container">
				<Link to="/">
					<span className="navbar-brand mb-0 h1">
						<img src={swIcon} className="nav-icon" alt="sw icon" />
					</span>
				</Link>
				<div ref={searchRef} className="col-6 mx-auto d-none d-md-flex">
					<input
						className="form-control"
						type="text"
						placeholder="search..."
						value={search}
						onChange={e => setSearch(e.target.value)}
						// onBlur={e => setSearch("")}
					/>
					{search.length > 2 && (
						<div className={"search-options"}>
							<ul>
								{store.searchResults.length > 0 ? (
									store.searchResults.map(result => {
										return (
											<li
												className="my-1"
												key={result.globalId}
												onClick={e => {
													setSearch("");
													history.push(`/single/${result.globalId}`);
												}}>
												{result.name}
											</li>
										);
									})
								) : (
									<li>{"no results yet..."}</li>
								)}
							</ul>
						</div>
					)}
				</div>
				<div className="ml-auto ml-md-0" style={{ position: "relative" }}>
					<button
						className="btn btn-primary"
						onClick={e => store.favorites.length > 0 && setDropped(!dropped)}>
						{`favorites! `}
						{store.favorites.length > 0 && (
							<span className="badge badge-pill badge-info">{store.favorites.length}</span>
						)}
					</button>
					<div ref={dropRef} className={dropped ? "sw-favorites" : "d-none"}>
						{store.favorites.length > 0 && (
							<ul>
								{store.favorites.map(fav => {
									return (
										<div
											key={fav.globalId}
											className="row justify-content-between align-items-center p-0 m-0">
											<li className="my-1">
												<Link
													className="text-decoration-none text-dark"
													to={`/single/${fav.globalId}`}
													onClick={e => setDropped(false)}>
													{fav.name}
												</Link>
											</li>
											<i
												className="fas fa-minus-circle text-danger"
												onClick={e => actions.removeFavorite(fav.globalId)}
											/>
										</div>
									);
								})}
							</ul>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};
