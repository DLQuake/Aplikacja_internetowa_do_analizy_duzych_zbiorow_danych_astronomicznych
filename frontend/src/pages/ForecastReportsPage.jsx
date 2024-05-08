import React, { useEffect } from "react";
import Layout from "./Layout";
import ForecastReports from "../components/ForecastReports";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getMe } from "../features/authSlice";

const ForecastReportsPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isError } = useSelector((state) => state.auth);

	useEffect(() => {
		dispatch(getMe());
	}, [dispatch]);

	useEffect(() => {
		if (isError) {
			navigate("/");
		}
	}, [isError, navigate]);

	return (
		<Layout>
			<ForecastReports />
		</Layout>
	);
};

export default ForecastReportsPage;