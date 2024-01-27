import { NavLink } from 'react-router-dom';
import imgUrl from '../assets/logo_example.png';
import {
  Flex,
  Heading,
  Switch,
  Image,
  Stack,
  Button,
  useColorMode,
} from '@chakra-ui/react';

function Navbar() {
  const { toggleColorMode } = useColorMode();
  return (
    <Flex
      direction="row"
      as="nav"
      align="center"
      justify="space-between"
      bg="#222"
      p={[0, 3, 15]}
    >
      <Stack direction="row" git="10px">
        <NavLink to="/">
          <Image
            boxSize="40px"
            src={imgUrl}
            size={['sm', 'md', 'lg']}
            alt="logo"
          ></Image>
        </NavLink>
        <NavLink to="/">
          <Heading as="h1" color="white">
            TrekTrackr
          </Heading>
        </NavLink>
      </Stack>

      <Stack direction="row" align="center" spacing="20px">
        <Button colorScheme="yellow" size={['sm', 'md', 'lg']}>
          <NavLink to="/about">About</NavLink>
        </Button>
        <Switch
          onChange={toggleColorMode}
          colorScheme="yellow"
          size={['sm', 'md', 'lg']}
        ></Switch>
      </Stack>
    </Flex>
  );
}

export default Navbar;
