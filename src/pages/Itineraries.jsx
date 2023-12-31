import { Box, Stack, Text, Flex, IconButton, Badge } from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import Overlay from '../components/Overlay';

function Itineraries({
  geoJson,
  activity,
  onDelete,
  postActivity,
  deleteActivity,
}) {
  // Define function that returns the activities associated with each location
  const getLocationActivities = locationId => {
    return activity.filter(act => act.itineraryId === locationId);
  };

  // console.log(geoJson);

  return (
    <Box w="500px" p="10px">
      {geoJson && (
        <Stack spacing="10px">
          {geoJson.features.map(location => (
            <Stack
              key={location.properties.id}
              direction="row"
              bg="gray.100"
              borderWidth="1px"
              borderRadius="lg"
              p="10px"
              spacing="20px"
              shadow="md"
              alignItems="center"
            >
              <Box flex="1">
                <Text as="strong" textAlign="left">
                  {location.properties.name}
                </Text>
                {activity && (
                  <Stack
                    // wrap="wrap"
                    direction="row"
                    pt="5px"
                    maxW="300px"
                    overflowX="auto"
                  >
                    {getLocationActivities(location.properties.id).map(act => (
                      <Badge key={act.id} variant="solid" colorScheme="green">
                        {`#${act.title}`}
                      </Badge>
                    ))}
                  </Stack>
                )}
              </Box>
              <Box flex="none">
                <Stack direction="row" spacing="4">
                  <Overlay
                    location={location}
                    locationActivities={getLocationActivities(
                      location.properties.id
                    )}
                    postActivity={postActivity}
                    deleteActivity={deleteActivity}
                  />
                  <IconButton
                    aria-label="Delete Icon"
                    colorScheme="yellow"
                    icon={<DeleteIcon />}
                    size="sm"
                    onClick={() => onDelete(location.properties.id)}
                  />
                </Stack>
              </Box>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  );
}

export default Itineraries;
