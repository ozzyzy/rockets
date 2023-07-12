import { useEffect, useState } from "react";
import { prepareData } from "./task_1";

export const RocketsList = ({ filterParams }) => {
	const [missions, loading] = useProcessedMissions(filterParams);

	if (loading) {
		return <div>Loading...</div>;
	}

	if (missions.length === 0 && !loading) {
		return <div>No data</div>;
	}

	return (
		<div>
			{missions.map((mission) => (
				<div key={mission.flight_number}>
					{`#${mission.flight_number} ${mission.mission_name} (${mission.payloads_count})`}
				</div>
			))}
		</div>
	);
};

function useProcessedMissions(filterParams) {
	const [fetchedData, setFetchedData] = useState([]);
	const [missions, setMissions] = useState([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchMissions = async () => {
			try {
				const response = await fetch('https://api.spacexdata.com/v3/launches/past');
				const data = await response.json();
				setFetchedData(data);
				setLoading(false);
			} catch (error) {
				console.log('Error fetching missions:', error);
				setLoading(false);
			}
		};
		fetchMissions();
	}, []);

	useEffect(() => {
		if (fetchedData) {
			const processedMissions = prepareData(filterParams)(fetchedData);
			setMissions(processedMissions);
		}
	}, [fetchedData, filterParams]);

	return [missions, loading];
}
