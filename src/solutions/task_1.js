export const prepareData = (filterParams) => {
	return function (missions) {
		if (!missions || !filterParams) return [];

		const { year, customerName } = filterParams;
		const filteredMissions = missions.filter((mission) => {
			return (
				mission.launch_year === year.toString() &&
				mission.rocket.second_stage.payloads.some((payload) =>
					payload.customers.some((customer) =>
						customer.includes(customerName)
					)
				)
			);
		});

		filteredMissions.sort((a, b) => {
			const date1 = new Date(a.launch_date_utc);
			const date2 = new Date(b.launch_date_utc);
			if (date1 > date2) return -1;
			if (date1 < date2) return 1;
			return 0;
		});

		filteredMissions.sort(
			(a, b) =>
				b.rocket.second_stage.payloads.length -
				a.rocket.second_stage.payloads.length
		);

		return filteredMissions.map((mission) => {
			return {
				flight_number: mission.flight_number,
				mission_name: mission.mission_name,
				payloads_count: mission.rocket.second_stage.payloads.length,
			};
		});
	};
};
