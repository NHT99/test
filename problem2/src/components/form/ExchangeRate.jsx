import { Box, HStack, Text, Spinner } from '@chakra-ui/react';

const ExchangeRate = ({ fromToken, toToken, rate, loading }) => {
  if (loading) {
    return <Spinner size="sm" />;
  }

  if (!rate) {
    return <Text color="gray.500">Rate not available</Text>;
  }

  return (
    <Box 
      w="full" 
      bg="gray.50" 
      p={6} 
      borderRadius="2xl"
      borderWidth="2px"
      borderColor="gray.100"
      _hover={{ borderColor: 'gray.200' }}
      transition="all 0.2s"
    >
      <HStack w="full" justify="space-between" fontSize="sm">
        <Text color="gray.500">Exchange Rate:</Text>
        <Text 
          fontWeight="semibold"
          bgGradient="linear(to-r, blue.500, purple.500)"
          bgClip="text"
        >
          1 {fromToken} = {rate} {toToken}
        </Text>
      </HStack>
    </Box>
  );
};

export default ExchangeRate; 