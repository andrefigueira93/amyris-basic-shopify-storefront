import React from 'react';
import { Box, Flex, Button, Text, Image, Heading } from '@chakra-ui/react';

interface ImageWithTextProps {
  button?: boolean;
  reverse?: boolean;
  image: string;
  heading?: string;
  text: string;
}

const ImageWithText: React.FC<ImageWithTextProps> = ({
  button,
  reverse,
  image,
  heading,
  text,
}) => {
  const reverseSection = reverse ? 'row-reverse' : 'row';

  return (
    <Box>
      <Flex flexDir={['column', reverseSection]} w="100%">
        <Image objectFit="cover" w={['100%', '50%']} src={image} />
        <Box
          w={['100%', '50%']}
          display="flex"
          flexDir="column"
          alignItems="center"
          p="2rem"
        >
          <Heading pb="2rem">{heading && heading}</Heading>
          <Text pb="2rem">{text && text}</Text>
          {button ? (
            <Button
              w="10rem"
              backgroundColor="#FF38BD"
              color="white"
              _hover={{ opacity: '70%' }}
            >
              Buy Now
            </Button>
          ) : null}
        </Box>
      </Flex>
    </Box>
  );
};

export default ImageWithText;
