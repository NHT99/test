import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  HStack,
  Image,
  Text,
  Badge,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

const tokenImageMap = {
  "RATOM": "rATOM",
  "STATOM": "stATOM",
  "STEVMOS": "stEVMOS",
  "STLUNA": "stLUNA",
  "STOSMO": "stOSMO",

};

const TokenSelector = ({
  value,
  onTokenChange,
  prices,
  disabled = false
}) => {
  const allTokens = Object.keys(prices || {}).sort();

  const hasValidPrice = (token) => prices?.[token] && !isNaN(prices[token]) && prices[token] > 0;

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(price);
  };

  return (
    <Menu>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon style={{ marginLeft: '18px' }} />}
        w="full"
        textAlign="left"
        h="60px"
        variant="outline"
        borderRadius="2xl"
        borderWidth="2px"
        _hover={{
          bg: 'gray.50',
          borderColor: '#dd6e2f',
          transform: 'translateY(-1px)'
        }}
        transition="all 0.2s"
      >
        {value ? (
          <HStack>
            <Image
              src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenImageMap[value] || value}.svg`}
              alt={value}
              boxSize="24px"
            />
            <Text>{value}</Text>
          </HStack>
        ) : (
          'Select Token'
        )}
      </MenuButton>
      <MenuList
        maxH="300px"
        overflowY="auto"
        borderRadius="2xl"
        shadow="xl"
        borderWidth="2px"
        p={2}
        sx={{
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {allTokens.map((token) => {
          const isValidPrice = hasValidPrice(token);

          return (
            <MenuItem
              key={token}
              borderRadius="xl"
              mx={1}
              my={1}
              transition="all 0.2s"
              onClick={() => isValidPrice && onTokenChange?.(token)}
              opacity={isValidPrice ? 1 : 0.5}
              _hover={{
                bg: isValidPrice ? 'gray.100' : 'transparent',
                cursor: isValidPrice ? 'pointer' : 'not-allowed'
              }}
            >
              <HStack w="full">
                <Image
                  src={`https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/${tokenImageMap[token] || token}.svg`}
                  alt={token}
                  boxSize="24px"
                  fallbackSrc="https://via.placeholder.com/24"
                />
                <Text>{token}</Text>
                <Badge
                  ml="auto"
                  colorScheme={isValidPrice ? "green" : "gray"}
                  borderRadius="lg"
                >
                  {formatPrice(prices?.[token])}
                </Badge>
              </HStack>
            </MenuItem>
          );
        })}
      </MenuList>
    </Menu>
  );
};

export default TokenSelector; 