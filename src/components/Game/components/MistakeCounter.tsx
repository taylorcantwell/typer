import { Flex, Text } from '@chakra-ui/react';
import { motion } from 'framer-motion';

type MistakeCounterProps = {
  mistakes: number;
};

export function MistakeCounter(props: MistakeCounterProps) {
  return (
    <motion.div
      key={props.mistakes}
      animate={
        !!props.mistakes && { x: [0, -10, 10, -10, 10, -10, 10, -10, 0] }
      }
    >
      <Text color="yellow.400" fontSize="xl" fontWeight="bold" as="samp">
        Mistakes: {props.mistakes}
      </Text>
    </motion.div>
  );
}
