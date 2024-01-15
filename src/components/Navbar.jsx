import { Heading } from '@chakra-ui/react';
import { Image, Stack } from '@chakra-ui/react';
import imgUrl from '../assets/logo_example.png';

function Navbar() {
  return (
    <Stack direction="row" as="nav" bg="#222" p="15px">
      <Image boxSize="40px" src={imgUrl} alt="logo"></Image>
      <Heading as="h1" color="white">
        TrekTrackr
      </Heading>
    </Stack>
  );
}

export default Navbar;
