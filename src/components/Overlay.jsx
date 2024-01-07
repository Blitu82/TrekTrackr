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

// From https://chakra-ui.com/docs/components/modal/usage
function Overlay({ location, activity }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedActivity, setSelectedActivity] = useState('');

  const handleActivityChange = event => {
    setSelectedActivity(event.target.value);
    console.log('Location Id:', location.properties.id);
    console.log('Add Activity:', event.target.value);
  };

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
              </Badge>
            ))}
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="blue" onClick={handleActivityChange}>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default Overlay;
