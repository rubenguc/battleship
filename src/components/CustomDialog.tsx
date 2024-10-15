import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

interface CustomDialongProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  Body?: JSX.Element;
  Footer?: JSX.Element;
}

export default function CustomDialog({
  isOpen,
  onClose,
  title,
  Body,
  Footer,
}: CustomDialongProps) {
  return (
    <Dialog
      open={isOpen}
      as="div"
      className="relative z-10 focus:outline-none"
      onClose={() => onClose?.()}
    >
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-black/30">
        <div className="flex min-h-full items-center justify-center p-4">
          <DialogPanel
            transition
            className="w-full max-w-md rounded-xl  bg-white p-6 duration-300 ease-out data-[closed]:transform-[scale(95%)] data-[closed]:opacity-0"
          >
            <DialogTitle as="h3" className="text-base/7 font-medium">
              {title}
            </DialogTitle>
            <div className="py-5">{Body}</div>
            <div className="mt-4 flex justify-end">{Footer}</div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
