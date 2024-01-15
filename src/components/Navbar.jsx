import { Heading } from '@chakra-ui/react';
import { Image, Stack } from '@chakra-ui/react';

function Navbar() {
  return (
    <Stack direction="row" as="nav" bg="#222" p="15px">
      <Image boxSize="40px" src="public\logo_example.png" alt="logo"></Image>
      <Heading as="h1" color="white">
        TrekTrackr
      </Heading>
    </Stack>
  );
}

export default Navbar;
