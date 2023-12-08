import { motion } from 'framer-motion';
import { chakra } from '@chakra-ui/react';

const MotionBox = motion(chakra.div);

export function Cursor() {
  return (
    <MotionBox
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.0, ease: 'easeInOut' }}
      display="inline-block"
      height="30px"
      marginTop="2px"
      width="3px"
      backgroundColor="#ecc94b"
    />
  );
}
