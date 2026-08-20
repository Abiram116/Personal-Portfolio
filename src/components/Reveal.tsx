import type { ElementType, ReactNode } from 'react';

/**
 * Marks an element for the scroll-reveal system in useSiteMotion.
 *
 * Deliberately does nothing on its own: elements stay visible in CSS, and GSAP
 * sets the hidden state only once it has taken over. If JS never runs, or the
 * visitor prefers reduced motion, the page reads in full with no blank gaps.
 */
type RevealProps = {
  as?: ElementType;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
};

export default function Reveal({ as = 'div', className = '', children, ...rest }: RevealProps) {
  // Polymorphic `as` defeats JSX's per-tag children typing; one cast keeps the
  // call sites simple without loosening anything the callers rely on.
  const Tag = as as ElementType<Record<string, unknown>>;
  return (
    <Tag className={`reveal ${className}`.trim()} {...rest}>
      {children}
    </Tag>
  );
}
