import { Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

export const MistakeCounter = ({ mistakes }: { mistakes: number }) => {
  return (
    <motion.div
      key={mistakes}
      animate={!!mistakes && { x: [0, -10, 10, -10, 10, -10, 10, -10, 0] }}
    >
      <Text color="yellow.400" fontSize="xl" fontWeight="bold" as="samp">
        Mistakes: {mistakes}
      </Text>
    </motion.div>
  );
};
