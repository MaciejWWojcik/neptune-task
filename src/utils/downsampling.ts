export function downSample(
	xData: number[],
	yData: number[],
	targetPoints: number
): {
	x: number[];
	y: number[];
	upperError: number[];
	lowerError: number[];
} {
	if (xData.length <= targetPoints) {
		// No downsampling needed
		return {
			x: xData,
			y: yData,
			upperError: [],
			lowerError: [],
		};
	}

	// Calculate the size of each bucket
	const bucketSize = Math.ceil(xData.length / targetPoints);

	const xDownSampled = [];
	const yDownSampled = [];
	const upperError = [];
	const lowerError = [];

	for (let start = 0; start < xData.length; start += bucketSize) {
		const end = start + bucketSize;

		// min & max are the error bounds
		let min = yData[start];
		let max = yData[start];

		// averageX & averageY are the downsampled values
		let averageX = 0;
		let averageY = 0;

		// calculating both errors and downsampled values in one loop for performance reasons
		for (let i = start; i < end; i++) {
			averageX += xData[i];
			averageY += yData[i];
			if (yData[i] > max) max = yData[i];
			if (yData[i] < min) min = yData[i];
		}
		averageX /= bucketSize;
		averageY /= bucketSize;

		xDownSampled.push(averageX);
		yDownSampled.push(averageY);
		upperError.push(max);
		lowerError.push(min);
	}

	return {
		x: xDownSampled,
		y: yDownSampled,
		upperError,
		lowerError,
	};
}
