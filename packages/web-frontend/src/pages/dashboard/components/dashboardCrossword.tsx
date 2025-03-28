import { Box, Tab, Tabs } from "@mui/material";
import type { GetUserCrosswords } from "@verbaquest/shared";
import { useEffect, useState } from "react";
import backendEndpoints from "../../../context/api/api";
import { useTranslation } from "../../../context/translationProvider";
import CrosswordList from "./crosswordList";

const DashboardContent = () => {
	const [value, setValue] = useState(0);
	const [crosswordData, setCrosswordData] = useState<
		[GetUserCrosswords[], GetUserCrosswords[]] | null
	>(null);
	const { translate } = useTranslation();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await backendEndpoints.getUserCrosswords();
				setCrosswordData(data);
			} catch (error) {
				console.error("Error fetching crossword data:", error);
			}
		};
		fetchData();
	}, []);

	if (!crosswordData) {
		return <Box>Loading...</Box>;
	}

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tabs
					value={value}
					onChange={handleChange}
					aria-label="basic tabs example"
				>
					<Tab label={translate("latest_crosswords")} {...a11yProps(0)} />
					<Tab
						label={translate("favorite_crosswords")}
						{...a11yProps(1)}
						disabled={!crosswordData[1].length}
					/>
				</Tabs>
			</Box>
			<TabPanel value={value} index={0}>
				<CrosswordList
					crosswords={crosswordData[0]}
					emptyMessage={translate("no_latest_crosswords")}
				/>
			</TabPanel>
			<TabPanel value={value} index={1}>
				<CrosswordList
					crosswords={crosswordData[1]}
					emptyMessage={translate("no_favorite_crosswords")}
				/>
			</TabPanel>
		</Box>
	);
};

export default DashboardContent;

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

function TabPanel(props: {
	children?: React.ReactNode;
	index: number;
	value: number;
}) {
	const { children, value, index, ...other } = props;

	return value === index ? (
		<Box
			sx={{ p: 3 }}
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{children}
		</Box>
	) : null;
}
