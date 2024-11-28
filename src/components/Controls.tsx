import styles from "./../styles/controls.module.css";

interface ControlsProps {
	windowStart: number;
	setWindowStart: (value: number) => void;
	windowSize: number;
	setWindowSize: (value: number) => void;
	animationTime: number;
	setAnimationTime: (value: number) => void;
	animationIncrement: number;
	setAnimationIncrement: (value: number) => void;
}
/**
 * Controls for the animation
 * @param {number} windowStart - The start of the window (S variable)
 * @param {function} setWindowStart - The function to set the start of the window
 * @param {number} windowSize - The size of the window (N variable)
 * @param {function} setWindowSize - The function to set the size of the window
 * @param {number} animationTime - The time of the animation (T variable)
 * @param {function} setAnimationTime - The function to set the time of the animation
 * @param {number} animationIncrement - The increment of the animation (P variable)
 * @param {function} setAnimationIncrement - The function to set the increment of the animation
 */
export default function Controls({
	windowStart,
	setWindowStart,
	windowSize,
	setWindowSize,
	animationTime,
	setAnimationTime,
	animationIncrement,
	setAnimationIncrement,
}: ControlsProps) {
	const control = (
		label: string,
		value: number,
		setValue: (value: number) => void
	) => (
		<div className={styles.control}>
			<label>{label}:</label>
			<input
				className={styles.input}
				type="number"
				value={value}
				onChange={(e) => setValue(+e.target.value)}
			/>
		</div>
	);

	return (
		<section className={styles.container}>
			{control("S (datapoint index)", windowStart, setWindowStart)}
			{control("N (size of the window)", windowSize, setWindowSize)}
			{control("T (animation time)", animationTime, setAnimationTime)}
			{control(
				"P (animation increment)",
				animationIncrement,
				setAnimationIncrement
			)}
		</section>
	);
}
