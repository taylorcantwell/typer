import { motion } from 'framer-motion';

export const Cursor = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
      style={{
        display: 'inline-block',
        height: 30,
        marginTop: 2,
        width: 3,
        backgroundColor: '#ecc94b',
      }}
    />
  );
};
