import { Button } from '@headlessui/react'
import { useToggle } from 'react-use';
import CustomDialog from './CustomDialog';

interface ButtonWithModalProps {
  text: string;
  modalTitle: string;
  onConfirmAction: () => void;
  confirmButtonText: string;
  body?: JSX.Element;
}

export default function ButtonWithModal({ onConfirmAction, text, modalTitle, confirmButtonText }: ButtonWithModalProps) {
  const [isOpen, toggle] = useToggle(false);

  return (
    <>
      <Button className="btn-outlined" onClick={toggle}>
        {text}
      </Button>
      <CustomDialog
        isOpen={isOpen}
        onClose={toggle}
        title={modalTitle}
        Footer={
          <Button className="btn-primary" onClick={onConfirmAction}>
            {confirmButtonText}
          </Button>
        }
      />
    </>
  )
}
