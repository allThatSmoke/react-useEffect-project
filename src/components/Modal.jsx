import { useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

function Modal({ open, children, onClose }) {
  const dialog = useRef();

  // runs after createPortal renders
  // ref establish by the time useEffect runs
  useEffect(() => {
    if (open){
      dialog.current.showModal();
    } else {
      dialog.current.close();
    }
    // dependency = prop or state value used inside 
    // effect fx; any value that causes component
    // fx to execute again
  }, [open]) 
  
  return createPortal(
    <dialog className="modal" ref={dialog} onClose={onClose}>
      {children}
    </dialog>,
    document.getElementById('modal')
  );
}

export default Modal;
