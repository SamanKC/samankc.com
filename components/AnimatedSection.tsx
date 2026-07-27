'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const reducedVariants = {
  hidden: { opacity: 1, y: 0 },
  visible: { opacity: 1, y: 0 },
};

export default function AnimatedSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={shouldReduceMotion ? reducedVariants : variants}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.section>
  );
}
