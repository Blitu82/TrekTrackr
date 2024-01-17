import { Flex, Heading, Switch } from '@chakra-ui/react';
import { Image, Stack } from '@chakra-ui/react';
import imgUrl from '../assets/logo_example.png';
import { Button, useColorMode } from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      direction="row"
      as="nav"
      align="center"
      justify="space-between"
      bg="#222"
      p="15px"
    >
      <Stack direction="row">
        <Image boxSize="40px" src={imgUrl} alt="logo"></Image>
        <Heading as="h1" color="white">
          TrekTrackr
        </Heading>
      </Stack>

      <Stack direction="row" align="center" spacing="20px">
        <Button colorScheme="yellow" size="lg">
          <NavLink to="/about">About</NavLink>
        </Button>
        <Switch
          onChange={toggleColorMode}
          colorScheme="yellow"
          size="lg"
        ></Switch>
      </Stack>
    </Flex>
  );
}

export default Navbar;
