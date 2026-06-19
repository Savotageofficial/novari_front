import { Link } from "react-router"

interface LogoLockupProps {
  className?: string
  starClassName?: string
  wordmarkClassName?: string
}

const logoSrc = '/assets/Novari Logo.webp'
const textSrc = '/assets/Novari Wordmark.webp'

export function LogoLockup({
  className = '',
  starClassName = 'h-7',
  wordmarkClassName = 'text-wordmark',
}: LogoLockupProps) {
  return (
    <Link to="/" className={`flex flex-row gap-3 ${className}`}>
      <img
        src={logoSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`w-auto object-contain ${starClassName}`}
      />
      <img
        src={textSrc}
        alt=""
        aria-hidden="true"
        draggable={false}
        className={`w-20 md:w-40 object-contain ${wordmarkClassName}`}
      />
    </Link>
  )
}