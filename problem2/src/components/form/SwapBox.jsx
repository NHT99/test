import {
  Box,
  Input,
  Text,
  HStack,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import TokenSelector from './TokenSelector';

const SwapBox = ({ 
  label, 
  value, 
  amount, 
  onAmountChange, 
  onTokenChange, 
  prices, 
  readOnly = false 
}) => {
  const handleAmountChange = (e) => {
    const inputValue = e.target.value;
    const validNumberPattern = /^\d*\.?\d*$/;

    if (validNumberPattern.test(inputValue)) {
      onAmountChange?.(inputValue);
    }
  };

  return (
    <Box w="full" p={4} borderRadius="xl" borderWidth="1px">
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <HStack spacing={4}>
          <InputGroup>
            <Input
              type="number"
              value={amount}
              onChange={readOnly ? undefined : handleAmountChange}
              placeholder="0.0"
              readOnly={readOnly}
              h="60px"
              borderRadius="2xl"
              borderWidth="2px"
              _hover={{
                cursor: readOnly ? 'not-allowed' : 'text',
                borderColor: readOnly ? 'gray.300' : 'blue.500',
              }}
              _focus={{
                borderColor: readOnly ? 'gray.300' : 'blue.500',
              }}
            />
            <InputRightElement width="4.5rem" h="60px">
              <Text fontSize="sm" color="gray.500">
                {value}
              </Text>
            </InputRightElement>
          </InputGroup>
          
          <Box width="150px">
            <TokenSelector
              value={value}
              onTokenChange={onTokenChange}
              prices={prices}
              disabled={readOnly}
            />
          </Box>
        </HStack>
      </FormControl>
    </Box>
  );
};

export default SwapBox; 