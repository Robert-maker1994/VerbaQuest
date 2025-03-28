import CheckCircleOutline from "@mui/icons-material/CheckCircleOutline";
import EditOutlined from "@mui/icons-material/EditOutlined";
import RadioButtonUncheckedOutlined from "@mui/icons-material/RadioButtonUncheckedOutlined";
import { Tooltip } from "@mui/material";

export function CrosswordIcon({
	isCompleted,
}: { isCompleted: boolean | undefined }) {
	if (isCompleted === undefined) {
		return (
			<Tooltip title="Not Attempted">
				<RadioButtonUncheckedOutlined color="info" />
			</Tooltip>
		);
	}

	return isCompleted ? (
		<Tooltip title="Completed">
			<CheckCircleOutline color="success" />
		</Tooltip>
	) : (
		<Tooltip title="Not completed">
			<EditOutlined color="error" />
		</Tooltip>
	);
}
