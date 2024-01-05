import { Box, Stack, Text, Flex, IconButton, Badge } from '@chakra-ui/react';
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import {
  Editable,
  EditableInput,
  EditableTextarea,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
} from '@chakra-ui/react';

function Itineraries({ geoJson, activity, onDelete, onEdit }) {
  const getLocationActivities = locationId => {
    // Filter activities for the current location
    return activity.filter(act => act.itineraryId === locationId);
  };

  function EditableControls() {
    const { isEditing, getSubmitButtonProps, getCancelButtonProps } =
      useEditableControls();

    return isEditing ? (
      <Flex justifyContent="center">
        <ButtonGroup size="sm">
          <IconButton
            aria-label="Check Icon"
            icon={<CheckIcon />}
            {...getSubmitButtonProps()}
            // colorScheme="yellow"
            // onClick={() => onEdit(location.properties.id)}
          />
          <IconButton
            aria-label="Delete Icon"
            icon={<DeleteIcon />}
            // colorScheme="yellow"
            {...getCancelButtonProps()}
          />
        </ButtonGroup>
      </Flex>
    ) : null;
  }

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
                      <Editable defaultValue={`#${act.title}`}>
                        <EditablePreview />
                        <EditableInput />
                        <EditableControls />
                      </Editable>
                    </Badge>
                  ))}
                </Stack>
              </Box>
              <Box flex="none">
                <Stack direction="row" spacing="4">
                  <IconButton
                    aria-label="Edit Icon"
                    icon={<EditIcon />}
                    colorScheme="yellow"
                    size="sm"
                    onClick={() => onEdit(location.properties.id)}
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
