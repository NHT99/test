import { ChakraProvider, Flex } from '@chakra-ui/react';
import CurrencySwapForm from './components/form/CurrencySwapForm';

function App() {
  return (
    <ChakraProvider>
      <Flex 
        as="main"
        minH="100vh"
        w="100vw"
        justify="center"
        align="center"
        bg="gray.50"
      >
        <CurrencySwapForm />
      </Flex>
    </ChakraProvider>
  );
}

export default App;
