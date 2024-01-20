import React from 'react';
import {
  Box,
  Stack,
  Text,
  useColorModeValue,
  Divider,
  Link,
  Card,
  Flex,
  Avatar,
  Heading,
} from '@chakra-ui/react';
import { ExternalLinkIcon } from '@chakra-ui/icons';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function About() {
  const bgColor = useColorModeValue('gray.100', 'whiteAlpha.50');

  return (
    <Box m={3}>
      <Stack bg={bgColor} borderWidth="1px" borderRadius="lg" p="5px">
        <Text as="b" fontSize="3xl" p="5px">
          Project Name
        </Text>
        <Divider />
        <Text fontSize="l" p="5px">
          TREKTRACKR (Trip Location Planner)
        </Text>
        <Text as="b" fontSize="2xl" p="5px" pt="30px">
          Description
        </Text>
        <Divider />
        <Text fontSize="l" p="5px">
          Location planner App that allows users to manage itineraries when
          visiting new cities.
        </Text>
        <Text as="b" fontSize="2xl" p="5px" pt="30px">
          Data
        </Text>
        <Divider />
        <Text fontSize="l" p="5px">
          Itinerary
        </Text>
        <Stack ml="5px" mr="5px" bg="gray.500" borderWidth="2px">
          <Stack w="200px">
            <Text color="black" fontSize="l" p="5px">
              &#123;
              <br /> "id": <Text as="mark">Number</Text>,<br /> "name":{' '}
              <Text as="mark">String</Text>, <br />
              "address": <Text as="mark">String</Text>, "latitude":{' '}
              <Text as="mark">Number</Text>, "longitude":
              <Text as="mark">Number</Text>,
              <br /> &#125;
            </Text>
          </Stack>
        </Stack>
        <Text fontSize="l" p="5px">
          Activities
        </Text>
        <Stack ml="5px" mr="5px" bg="gray.500" borderWidth="2px">
          <Stack w="200px">
            <Text color="black" fontSize="l" p="5px">
              &#123;
              <br /> "activityId": <Text as="mark">Number</Text>,
              "activity_name": <Text as="mark">String</Text>,
              <br /> &#125;
            </Text>
          </Stack>
        </Stack>
        <Text as="b" fontSize="2xl" p="5px" pt="30px">
          API'S
        </Text>
        <Divider />
        <Link fontSize="l" p="5px" href="https://docs.mapbox.com/" isExternal>
          Mapbox <ExternalLinkIcon mx="2px" />
        </Link>
        <Text as="b" fontSize="2xl" p="5px" pt="30px">
          External Library
        </Text>
        <Divider />
        <Link fontSize="l" p="5px" href="https://chakra-ui.com/" isExternal>
          Chakra UI <ExternalLinkIcon mx="2px" />
        </Link>
        <Text as="b" fontSize="2xl" p="5px" pt="30px">
          Github
        </Text>
        <Divider />
        <Link
          fontSize="l"
          p="5px"
          href="https://github.com/Blitu82/TrekTrackr"
          isExternal
        >
          Frontend <ExternalLinkIcon mx="2px" />
        </Link>
        <Link
          fontSize="l"
          p="5px"
          href="https://github.com/Blitu82/json-server-backend"
          isExternal
        >
          Backend <ExternalLinkIcon mx="2px" />
        </Link>
        <Text as="b" fontSize="2xl" p="5px" pt="30px">
          Contributors
        </Text>
        <Divider />
        <Stack>
          <Card maxW="sm">
            <Flex spacing="4">
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar
                  name="Estanislau Mendes"
                  src="https://media.licdn.com/dms/image/C5603AQHS8dOb3WusBg/profile-displayphoto-shrink_800_800/0/1635409428761?e=2147483647&v=beta&t=nZSJmNlDr-VHnpliq7NPRHuyhZ-wbWYzVQEKkm7qWaw"
                />

                <Box>
                  <Heading size="sm">Estanislau Mendes</Heading>
                  <Text>Web Developer</Text>
                </Box>
                <Flex flex="1" justify="flex-end" gap="4" pr="5px">
                  <Link href="https://www.linkedin.com/in/estanislau-mendes">
                    <FaLinkedin />
                  </Link>
                  <Link href="https://github.com/estanislaumendes">
                    <FaGithub />
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </Card>
          <Card maxW="sm">
            <Flex spacing="4">
              <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                <Avatar
                  name="Pablo Garcia"
                  src="https://media.licdn.com/dms/image/D4D03AQFjj8ruYe8YUA/profile-displayphoto-shrink_400_400/0/1683530598602?e=1710979200&v=beta&t=inYr-5y-tYRm0JbZMuIMEmf4VxSgXEqILU9hub7ArSU"
                />

                <Box>
                  <Heading size="sm">Pablo Garcia</Heading>
                  <Text>Web Developer</Text>
                </Box>
                <Flex flex="1" justify="flex-end" gap="4" pr="5px">
                  <Link href="https://www.linkedin.com/in/garpablo/">
                    <FaLinkedin />
                  </Link>
                  <Link href="https://github.com/Blitu82">
                    <FaGithub />
                  </Link>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
}

export default About;
