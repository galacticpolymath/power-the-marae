import React, { FC } from 'react';
import { Dialog } from '@radix-ui/react-dialog';
import { DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';

type GradientDialogProps = {
  open?: boolean;
  onOpenChange?: () => void;
  title?: string;
  children?: React.ReactNode;
  variant?: 'primary' | 'error';
};

const GradientDialog: FC<GradientDialogProps> = ({ open, onOpenChange, title, variant, children }) => {
  return (
    <Dialog open={open || false} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-[60vw] border-none px-6 pt-8 pb-6"
        style={{
          background:
            variant !== 'error'
              ? 'linear-gradient(135deg, rgba(0,122,255,1) 0%, rgba(129,39,255,1) 100%)'
              : 'linear-gradient(135deg, rgba(217,64,93,1) 0%, rgba(129,39,255,1) 100%)',
        }}
      >
        <Card className="border-black border-2 pt-2">
          <DialogHeader>
            <DialogTitle className="pl-4 pb-1">{title}</DialogTitle>
          </DialogHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default GradientDialog;
