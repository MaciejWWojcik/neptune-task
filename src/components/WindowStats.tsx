interface WindowStatsProps {
	data: {
		rawX: number[];
		rawY: number[];
	};
}

function getStats(array: number[]): {
	min: number;
	max: number;
	average: number;
	variance: number;
} {
	let max = -Infinity;
	let min = Infinity;
	let average = 0;
	let variance = 0;

	for (let i = 0; i < array.length; i++) {
		max = array[i] > max ? array[i] : max;
		min = array[i] < min ? array[i] : min;
		average += array[i];
	}
	average /= array.length;

	for (let i = 0; i < array.length; i++) {
		variance += Math.pow(array[i] - average, 2);
	}
	variance /= array.length;

	return { min, max, average, variance };
}

/**
 * Window stats component
 * @param {WindowStatsProps} data - The raw data to get the stats from
 */
export default function WindowStats({ data }: WindowStatsProps) {
	const values = data.rawY;
	const stats = getStats(values);

	return (
		<>
			{data.rawY?.length ? (
				<article style={{ display: "flex", gap: "2rem", padding: "1rem" }}>
					<p>
						Min: <strong>{stats.min}</strong>
					</p>
					<p>
						Max: <strong>{stats.max}</strong>
					</p>
					<p>
						Average: <strong>{stats.average}</strong>
					</p>
					<p>
						Variance: <strong>{stats.variance}</strong>
					</p>
				</article>
			) : null}
		</>
	);
}
