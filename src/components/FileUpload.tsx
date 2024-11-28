import Papa from "papaparse";
import { Dispatch, SetStateAction, useState } from "react";

export type DataPoint = [number, number];
export type DataChunk = {
	startIndex: number;
	data: DataPoint[];
};

interface FileUploadProps {
	setChunks: Dispatch<SetStateAction<Map<number, DataChunk>>>;
	setTotalPoints: (total: number) => void;
	chunkSize: number;
}

/**
 * File upload component
 * @param {function} setChunks - The function to set the chunks
 * @param {function} setTotalPoints - The function to set the total points
 * @param {number} chunkSize - The size of the chunk (amount of data-points per chunk)
 *
 * It uploads a CSV file and converts it into chunks of data in real-time, updating the chunks and total points state as it goes.
 * Processing is done in chunks and in the Web Worker to avoid memory issues.
 */
export default function FileUpload({
	setChunks,
	setTotalPoints,
	chunkSize,
}: FileUploadProps) {
	const [totalPointsLocal, setTotalPointsLocal] = useState<number>(0);

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		// Reset existing data
		setChunks(new Map());
		let accumulatedData: DataPoint[] = [];
		let totalRows = 0;

		Papa.parse<string[]>(file, {
			chunk: (results) => {
				// Convert and filter valid rows
				const newPoints: DataPoint[] = results.data
					.filter((row: string[]) => row.length >= 2)
					.map((row: string[]) => [+row[0], +row[1]]);

				// Add new points to accumulated data
				accumulatedData = [...accumulatedData, ...newPoints];

				// Process complete chunks
				while (accumulatedData.length >= chunkSize) {
					const chunkIndex = Math.floor(totalRows / chunkSize);
					const chunkData = accumulatedData.slice(0, chunkSize);

					setChunks((prev) => {
						return new Map(prev).set(chunkIndex, {
							startIndex: chunkIndex * chunkSize,
							data: chunkData,
						});
					});

					// Update counters and remove processed data
					totalRows += chunkSize;
					accumulatedData = accumulatedData.slice(chunkSize);
				}

				setTotalPoints(totalRows + accumulatedData.length);
				setTotalPointsLocal(totalRows + accumulatedData.length);
			},
			complete: () => {
				// Handle any remaining data as the final chunk
				if (accumulatedData.length > 0) {
					const finalChunkIndex = Math.floor(totalRows / chunkSize);
					setChunks((prev) => {
						return new Map(prev).set(finalChunkIndex, {
							startIndex: totalRows,
							data: accumulatedData,
						});
					});
				}
			},
			worker: true,
		});
	};

	return (
		<>
			<input type="file" accept=".csv" onChange={handleFileSelect} />
			{totalPointsLocal > 0 && (
				<p>Loaded {totalPointsLocal.toLocaleString()} data points</p>
			)}
		</>
	);
}
