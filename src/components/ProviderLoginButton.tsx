interface ProviderLoginButton {
  onClick: () => void;
  buttonClassName: string;
  imgSrc: string;
  alt: string;
  spanClassName?: string;
  text: string;
}

export default function ProviderLoginButton({
  onClick,
  alt,
  buttonClassName,
  imgSrc,
  spanClassName = "",
  text,
}: ProviderLoginButton) {
  return (
    <button className={buttonClassName} onClick={onClick}>
      <img className="w-6 h-6" src={imgSrc} loading="lazy" alt={alt} />
      <span className={spanClassName}>{text}</span>
    </button>
  );
}
