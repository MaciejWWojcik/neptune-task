import Controls from "@/components/Controls";
import FileUpload, { DataChunk } from "@/components/FileUpload";
import WindowStats from "@/components/WindowStats";
import { downSample } from "@/utils/downsampling";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import styles from "./../styles/index.module.css";

// Import Plotly dynamically to avoid SSR issues
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

// Configuration for the entire animation
const CONFIG = {
	windowStart: 0, // S variable
	windowSize: 1000, // N variable
	animationIncrement: 10, // P variable
	animationTime: 500, // T variable
	chunkSize: 1_000_000, // 1M points per chunk
	downSampleTargetPoints: 5000, // 5K points per screen
	plotColor: "rgb(0,112,243)", // color of the plot and error bounds
};

/**
 * Main page component
 *
 * It handles the file upload, chunking, downsampling, and animation of the data.
 */
export default function Home() {
	const [chunks, setChunks] = useState<Map<number, DataChunk>>(new Map());
	const [totalPoints, setTotalPoints] = useState<number>(0);

	const [isAnimating, setIsAnimating] = useState(false);
	const [windowStart, setWindowStart] = useState(CONFIG.windowStart);
	const [windowSize, setWindowSize] = useState(CONFIG.windowSize);
	const [animationTime, setAnimationTime] = useState(CONFIG.animationTime);
	const [animationIncrement, setAnimationIncrement] = useState(
		CONFIG.animationIncrement
	);

	// Calculate visible data window
	const visibleData = useMemo(() => {
		const startChunkIndex = Math.floor(windowStart / CONFIG.chunkSize);
		const endChunkIndex = Math.floor(
			(windowStart + windowSize) / CONFIG.chunkSize
		);

		const xData = new Array<number>(windowSize);
		const yData = new Array<number>(windowSize);
		let dataIndex = 0;

		// Iterate through all chunks that overlap with our window
		for (
			let chunkIndex = startChunkIndex;
			chunkIndex <= endChunkIndex;
			chunkIndex++
		) {
			const chunk = chunks.get(chunkIndex);

			if (!chunk) continue;

			// Calculate the overlap between this chunk and our visible window
			const chunkStart = Math.max(0, windowStart - chunk.startIndex);
			const chunkEnd = Math.min(
				chunk.data.length,
				windowStart + windowSize - chunk.startIndex
			);

			// Copy the overlapping data
			for (let i = chunkStart; i < chunkEnd; i++) {
				xData[dataIndex] = chunk.data[i][0];
				yData[dataIndex] = chunk.data[i][1];
				dataIndex++;
			}
		}

		// Trim arrays to actual size if we didn't fill them completely
		const rawData = {
			x: xData.slice(0, dataIndex),
			y: yData.slice(0, dataIndex),
		};

		// DownSample the data to reduce the number of points plotted
		const downSampledData = downSample(
			rawData.x,
			rawData.y,
			CONFIG.downSampleTargetPoints
		);

		return {
			rawX: rawData.x,
			rawY: rawData.y,
			...downSampledData,
		};
	}, [chunks, windowStart, windowSize]);

	// Animation logic
	useEffect(() => {
		let animationFrameId: number; // used to cancel the animation
		let lastTime = 0; // used to track time between frames

		if (isAnimating) {
			const animate = (currentTime: number) => {
				// If enough time has passed, move the window
				if (currentTime - lastTime >= animationTime) {
					setWindowStart((prev) => {
						const next = prev + animationIncrement;
						// If the next window would go past the end of the data, stop the animation
						return next + windowSize >= totalPoints ? totalPoints : next;
					});
					lastTime = currentTime;
				}
				animationFrameId = requestAnimationFrame(animate);
			};
			animationFrameId = requestAnimationFrame(animate);
		}

		return () => {
			if (animationFrameId) {
				cancelAnimationFrame(animationFrameId);
			}
		};
	}, [isAnimating, windowSize, animationIncrement, animationTime, totalPoints]);

	return (
		<div className={styles.container}>
			<div className={styles.controls}>
				<FileUpload
					setChunks={setChunks}
					setTotalPoints={setTotalPoints}
					chunkSize={CONFIG.chunkSize}
				/>
				<button
					className={styles.button}
					onClick={() => setIsAnimating(!isAnimating)}
				>
					{isAnimating ? "Stop" : "Start"}
				</button>
				<Controls
					windowStart={windowStart}
					setWindowStart={setWindowStart}
					windowSize={windowSize}
					setWindowSize={setWindowSize}
					animationTime={animationTime}
					setAnimationTime={setAnimationTime}
					animationIncrement={animationIncrement}
					setAnimationIncrement={setAnimationIncrement}
				/>
			</div>

			<div className={styles.plotContainer}>
				<Plot
					data={[
						// Fill area between error bounds
						{
							x: visibleData.x,
							y: visibleData.lowerError,
							type: "scattergl",
							fill: "tonexty",
							line: { color: CONFIG.plotColor, width: 0 },
						},
						{
							x: visibleData.x,
							y: visibleData.upperError,
							type: "scattergl",
							fill: "tonexty",
							line: { color: CONFIG.plotColor, width: 0 },
						},
						// Actual data as line
						{
							x: visibleData.x,
							y: visibleData.y,
							line: { color: CONFIG.plotColor, width: 1.5 },
							showlegend: false,
							type: "scattergl",
							mode: "lines",
						},
					]}
					layout={{
						xaxis: {
							range: [windowStart, windowStart + windowSize],
						},
						yaxis: {
							linewidth: 1,
						},
						autosize: true,
					}}
					config={{
						displayModeBar: false,
					}}
					useResizeHandler={true}
					style={{ width: "100%", height: "100%" }}
				/>
			</div>
			<WindowStats data={visibleData} />
		</div>
	);
}
