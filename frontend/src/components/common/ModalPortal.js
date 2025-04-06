import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

const ModalPortal = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="pointer-events-auto">
        {children}
      </div>
    </div>,
    document.body
  );
};

export default ModalPortal; 