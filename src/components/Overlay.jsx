import { useState, useEffect } from 'react';
import { DeleteIcon, EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';
import { Flex, Badge, IconButton } from '@chakra-ui/react';
import {
  FormControl,
  FormLabel,
  Select,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react';

const API_URL = 'https://json-server-backend-trek.adaptable.app';

// From https://chakra-ui.com/docs/components/modal/usage
function Overlay({ location, activity, addActivity }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivity, setSelectedActivity] = useState('');

  const handleActivityChange = event => {
    setSelectedActivity(event.target.value);
    console.log('Location Id:', location.properties.id);
    console.log('Add Activity:', event.target.value);
  };

  const handleAddActivity = () => {
    addActivity(location.properties.id, selectedActivity);
    onClose();
  };

  // const handleDeleteActivity = async activityId => {
  //   try {
  //     const response = await fetch(`${API_URL}/activity/${activityId}`, {
  //       method: 'DELETE',
  //     });

  //     if (!response.ok) {
  //       throw new Error('Failed to delete activity');
  //     }

  //     const updatedActivities = activity.filter(act => act.id !== activityId);

  //     // After deletion, re-fetch the updated activity data
  //     addActivity(location.properties.id, selectedActivity, updatedActivities);
  //   } catch (error) {
  //     console.error('There was a problem deleting the activity:', error);
  //   }
  // };

  // From https://chakra-ui.com/docs/components/editable

  return (
    <>
      <IconButton
        aria-label="Edit Icon"
        icon={<EditIcon />}
        colorScheme="yellow"
        size="sm"
        onClick={() => {
          onOpen();
          // onEdit(location.properties.id);
        }}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{location.properties.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Add Activity</FormLabel>
              <Select
                placeholder="Select an activity"
                mb="20px"
                value={selectedActivity}
                onChange={handleActivityChange}
              >
                <option>cultural</option>
                <option>sport</option>
                <option>culinary</option>
                <option>adventure</option>
                <option>historial tour</option>
                <option>nature walk</option>
                <option>shopping</option>
                <option>photography</option>
                <option>sightseeing</option>
                <option>boat tour</option>
                <option>music concert</option>
                <option>local festivals</option>
                <option>museum visit</option>
                <option>outdoor picnic</option>
                <option>wine tasting</option>
              </Select>
            </FormControl>
            {activity.map(act => (
              <Badge variant="solid" colorScheme="green" key={act.id} m="5px">
                {`#${act.title}`}
                <IconButton
                  aria-label="Close Icon"
                  icon={<DeleteIcon />}
                  // colorScheme="yellow"
                  size="sm"
                  m="5px"
                  // onClick={() => handleDeleteActivity(act.id)}
                />
              </Badge>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleAddActivity}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Overlay;
