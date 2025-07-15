import { Button } from "../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription
} from "../components/ui/dialog";

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function LogoutModal({ open, onClose, onConfirm }: LogoutModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deseja sair?</DialogTitle>
          <DialogDescription>
            Você será deslogado do sistema e voltará para a tela de login.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Confirmar Logout
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
