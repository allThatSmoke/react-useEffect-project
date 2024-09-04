import { useEffect } from 'react';

import ProgressBar from './ProgressBar';

export default function DeleteConfirmation({ onConfirm, onCancel }) {
  
  // modal closes automatically aft 3 sec
  useEffect(() => {
    // need to get rid of timer when DeleteConfirmation
    // disappears
    console.log('TIMER SET');
  
    const timer = setTimeout(() => {
      onConfirm();
    }, 3000);

    // clean up function runs when component dismounts
    // does not run when useEffect runs the first time
    // only runs on subsequent executions of UseEffect hook
    // and when component dismounts
    return () =>{
      console.log('Cleaning up timer')
      clearTimeout(timer);
    } // add prop or state to dependencies
  }, [onConfirm])
  // when adding fx as dependency, can create a loop
  // fx should re-ex if dep changes
  // in JS fx are objects -- fx obj recreated every time
  // App fx executes
  
  return (
    <div id="delete-confirmation">
      <h2>Are you sure?</h2>
      <p>Do you really want to remove this place?</p>
      <div id="confirmation-actions">
        <button onClick={onCancel} className="button-text">
          No
        </button>
        <button onClick={onConfirm} className="button">
          Yes
        </button>
      </div>
      <ProgressBar />
    </div>
  );
}
