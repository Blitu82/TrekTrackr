import { Box, Stack, Text, Flex, IconButton, Badge } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Editable,
  EditableInput,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
} from '@chakra-ui/react';

import Overlay from '../components/Overlay';

function Itineraries({ geoJson, activity, onDelete, onEdit, addActivity }) {
  const getLocationActivities = locationId => {
    // Filter activities for the current location
    return activity.filter(act => act.itineraryId === locationId);
  };

  // function handleDelete(id) {
  //   const updatedGeoJson = {
  //     type: 'FeatureCollection',
  //     features: geoJson.features.filter(
  //       location => location.properties.id !== id
  //     ),
  //   };
  //   setGeoJson(updatedGeoJson);
  // }

  // const handleEdit = id => {
  //   // To be edited
  //   console.log(`Edit item with ID: ${id}`);
  // };

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
                <Stack direction="row" pt="5px">
                  {getLocationActivities(location.properties.id).map(act => (
                    <Badge variant="solid" colorScheme="green" key={act.id}>
                      {`#${act.title}`}
                    </Badge>
                  ))}
                </Stack>
              </Box>
              <Box flex="none">
                <Stack direction="row" spacing="4">
                  <Overlay
                    location={location}
                    activity={getLocationActivities(location.properties.id)}
                    addActivity={addActivity}
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
