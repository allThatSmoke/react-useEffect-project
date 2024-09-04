import { useState, useEffect } from 'react';

const TIMER = 3000;

export default function ProgressBar() {
	const [remainingTime, setRemainingTime]  = useState(TIMER);

	// defines fx that will be executed at an interval
	useEffect(() => {
		const interval = setInterval( () => {
		  console.log('INTERVAL')
		  setRemainingTime((prevTime) => (prevTime - 10))
		}, 10);
	
		// return cleanup fx
		// will run when Components unmounts
		return () => {
		  clearInterval(interval);
		}
	  }, []);

	  return (
		<progress value={remainingTime} max={TIMER} />
	  )
}