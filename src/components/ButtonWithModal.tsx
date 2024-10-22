import { Button } from '@headlessui/react'
import { useToggle } from 'react-use';
import CustomDialog from './CustomDialog';

interface ButtonWithModalProps {
  text: string;
  modalTitle: string;
  onConfirmAction: () => void;
  confirmButtonText: string;
  body?: JSX.Element;
  isDisabled?: boolean
}

export default function ButtonWithModal({ onConfirmAction, text, modalTitle, confirmButtonText, isDisabled = false }: ButtonWithModalProps) {
  const [isOpen, toggle] = useToggle(false);

  const _onConfirmAction = async () => {
    await onConfirmAction();
    toggle()
  }

  return (
    <>
      <Button className="btn-outlined" onClick={toggle} disabled={isDisabled}>
        {text}
      </Button>
      <CustomDialog
        isOpen={isOpen}
        onClose={toggle}
        title={modalTitle}
        Footer={
          <Button data-testid="confirm-button" className="btn-primary" onClick={_onConfirmAction}>
            {confirmButtonText}
          </Button>
        }
      />
    </>
  )
}
