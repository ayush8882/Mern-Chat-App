import {
  Box,
  Button,
  FormControl,
  IconButton,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import axios from "axios";
import UserListItem from "../UserAvatar/UserListItem";

const UpdateGroupChatModal = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);

  const handleRemove = async(user1) => {
    if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
        toast({
            title: "Only admins can remove someone!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    try {
        setLoading(true);
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        const {data} = await axios.put("/api/chat/remove",{
            chatId:selectedChat._id,
            userId: user1._id,
        }, config);

        user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        fetchMessages()
        setLoading(false);
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
    }
    setGroupChatName("")
  };  

  const handleAddUser = async(user1) => {
    if(selectedChat.users.find((u) => u._id === user1._id)){
        toast({
            title: "User Already in group!",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }
    if(selectedChat.groupAdmin._id !== user._id){
        toast({
            title: "Only Admins can add in the group",
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          return;
    }

    try {
        setLoading(true);
        const config = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
        const {data} = await axios.put('/api/chat/groupadd', {
            chatId:selectedChat._id,
            userId: user1._id,
        }, config);
          setSelectedChat(data)
          setFetchAgain(!fetchAgain)
          setLoading(false)
    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setLoading(false);
    }
  };  

  const handleRename = async() => {
    if(!groupChatName) return;

    try {
        setRenameLoading(true);
        const config  = {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          };
          const {data} = await axios.put("api/chat/rename", {
            chatId: selectedChat._id,
            chatName: groupChatName 
        }, config);

        setSelectedChat(data);
        setFetchAgain(!fetchAgain);
        setRenameLoading(false)

    } catch (error) {
        toast({
            title: "Error Occured!",
            description: error.response.data.message,
            status: "error",
            duration: 5000,
            isClosable: true,
            position: "bottom",
          });
          setRenameLoading(false);
    }
    setGroupChatName("")
  };

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const toast = useToast();
  return (
    <>
      <IconButton
        display={{ base: "flex" }}
        icon={<ViewIcon />}
        onClick={onOpen}
      />
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <Box w="100%" display="flex" flexWrap="wrap" pb={3}>
              {selectedChat.users.map((u) => (
                <UserBadgeItem
                  key={u._id}
                  user={u}
                  handleFunction={() => handleRemove(u)}
                />
              ))}
            </Box>
            <FormControl display={"flex"}>
              <Input
                placeholder="Rename Group"
                mb={3}
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button
                variant="solid"
                colorScheme="whatsapp"
                ml={1}
                isLoading={renameloading}
                onClick={handleRename}
              >
                Update
              </Button>
            </FormControl>
            <FormControl display={"flex"}>
              <Input
                placeholder="Add Heads to group"
                mb={3}
                value={groupChatName}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </FormControl>
            {loading ? (
                <Spinner size={"lg"} />
            ) : (
               searchResults.map((user) => (
                <UserListItem 
                key={user._id}
                user={user}
                handleFunction = {() => handleAddUser(user)}
                />
               ))
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={() => handleRemove(user)}>
              Leave Group
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateGroupChatModal;
