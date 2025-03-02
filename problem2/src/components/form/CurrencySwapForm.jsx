import { useState, useEffect } from 'react';
import {
  Box,
  VStack,
  Heading,
  IconButton,
  Button,
  Flex,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import SwapBox from './SwapBox';
import ExchangeRate from './ExchangeRate';

const CurrencySwapForm = () => {
  // States
  const [fromToken, setFromToken] = useState(null);
  const [toToken, setToToken] = useState(null);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingPrices, setLoadingPrices] = useState(true);
  
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const gradientBg = useColorModeValue(
    'linear(to-br, blue.50, purple.50)',
    'linear(to-br, blue.900, purple.900)'
  );

  const getValidTokens = (pricesData) => {
    return Object.entries(pricesData)
      .filter(([_, price]) => price && !isNaN(price) && price > 0)
      .map(([token]) => token)
      .sort();
  };


  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch('https://interview.switcheo.com/prices.json');
        const data = await response.json();
        
        const pricesMap = data.reduce((acc, item) => {
          acc[item.currency] = item.price;
          return acc;
        }, {});
        setPrices(pricesMap);

        const validTokens = getValidTokens(pricesMap);
        if (validTokens.length >= 2) {
          setFromToken(validTokens[0]);
          setToToken(validTokens[1]);
        }
      } catch (error) {
        toast({
          title: 'Error fetching prices',
          status: 'error',
          duration: 3000,
        });
      } finally {
        setLoadingPrices(false);
      }
    };
    fetchPrices();
  }, []);

  // Calculate exchange rate and to amount
  useEffect(() => {
    if (fromAmount && prices[fromToken] && prices[toToken]) {
      const rate = prices[toToken] / prices[fromToken];
      setToAmount((parseFloat(fromAmount) * rate).toFixed(6));
    } else {
      setToAmount('');
    }
  }, [fromAmount, fromToken, toToken, prices]);

  const handleSwap = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleSubmit = async () => {
    if (!fromAmount || isNaN(fromAmount) || parseFloat(fromAmount) <= 0) {
      toast({
        title: 'Invalid amount',
        status: 'error',
        duration: 3000,
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast({
        title: 'Swap successful!',
        status: 'success',
        duration: 3000,
      });
      setFromAmount('');
      setToAmount('');
    } catch (error) {
      toast({
        title: 'Swap failed',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      w="full"
      maxW="600px"
      p={8}
      borderRadius="3xl"
      boxShadow="2xl"
      bg={bgColor}
      border="2px"
      borderColor={borderColor}
      mx={4}
      position="relative"
      _before={{
        content: '""',
        position: 'absolute',
        top: '-2px',
        left: '-2px',
        right: '-2px',
        bottom: '-2px',
        background: gradientBg,
        borderRadius: '3xl',
        zIndex: -1,
        filter: 'blur(20px)',
        opacity: 0.5,
      }}
    >
      <VStack spacing={8}>
        <Heading 
          size="lg" 
          mb={2}
          bgGradient="linear(to-r, blue.500, purple.500)"
          bgClip="text"
          letterSpacing="tight"
        >
          Swap Currencies
        </Heading>

        <SwapBox 
          label="From" 
          value={fromToken}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onTokenChange={setFromToken}
          prices={prices}
        />

        <Box position="relative" w="full">
          <Flex justify="center" my={-4} position="relative" zIndex={2}>
            <IconButton
              icon={<RepeatIcon />}
              onClick={handleSwap}
              isRound
              bg={bgColor}
              size="lg"
              shadow="xl"
              borderWidth="2px"
              borderColor={borderColor}
              _hover={{ 
                transform: 'rotate(180deg) scale(1.1)',
                bg: '#dd6e2f',
                color: 'white',
                borderColor: '#dd6e2f'
              }}
              transition="all 0.3s ease"
              aria-label="Switch tokens"
            />
          </Flex>
        </Box>

        <SwapBox 
          label="To" 
          value={toToken}
          amount={toAmount}
          onTokenChange={setToToken}
          prices={prices}
          readOnly
        />

        <ExchangeRate 
          fromToken={fromToken} 
          toToken={toToken} 
          rate={prices[fromToken] && prices[toToken] 
            ? (prices[toToken] / prices[fromToken]).toFixed(6) 
            : null
          }
          loading={loadingPrices}
        />

        <Button
          onClick={handleSubmit}
          isLoading={loading}
          isDisabled={!fromAmount || loadingPrices || loading}
          as={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          colorScheme="blue"
          size="lg"
          w="full"
          borderRadius="2xl"
          h="60px"
          fontSize="lg"
          fontWeight="bold"
          bgGradient="linear(to-r, #dd6e2f, #82277e)"
          position="relative"
          overflow="hidden"
          _before={{
            content: '""',
            position: 'absolute',
            top: '0',
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(120deg, transparent 0%, transparent 25%, rgba(255,255,255,0.2) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.2) 55%, transparent 75%, transparent 100%)',
            animation: 'shine 0s ease-in-out',
            transition: 'all 0.5s',
          }}
          _hover={{
            bgGradient: "linear(to-r, #cd6429, #722372)",
            boxShadow: "xl",
            _before: {
              animation: 'shine 1.5s ease-in-out infinite',
            }
          }}
          _active={{
            bgGradient: "linear(to-r, #bd5a24, #621f63)",
          }}
          sx={{
            '@keyframes shine': {
              '0%': {
                left: '-100%',
              },
              '100%': {
                left: '100%',
              }
            }
          }}
          transition="all 0.2s"
        >
          Swap Now
        </Button>
      </VStack>
    </Box>
  );
};

export default CurrencySwapForm; 