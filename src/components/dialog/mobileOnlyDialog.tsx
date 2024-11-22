import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'; // Adjust import path as needed

const MobileScreenDialog: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(true);

  // Check for mobile screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768); // You can adjust the breakpoint as needed
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  if (!isMobile || !isDialogOpen) {
    return null; // Don't render dialog if not on mobile or dismissed
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mobile Device Detected</DialogTitle>
          <DialogDescription>
            This site works best on a larger screen. For the best experience, please use a tablet or desktop device.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-4">
          <Button onClick={() => setIsDialogOpen(false)}>Dismiss</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MobileScreenDialog;
