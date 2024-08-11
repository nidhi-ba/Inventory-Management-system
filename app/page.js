'use client';

import { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField, AppBar, Toolbar, InputAdornment, Fade } from "@mui/material";
import { Search as SearchIcon, Add as AddIcon } from "@mui/icons-material";
import { firestore } from '@/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from 'firebase/firestore';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const updateInventory = async () => {
    try {
      const snapshot = query(collection(firestore, 'inventory'));
      const docs = await getDocs(snapshot);
      const inventoryList = [];
      docs.forEach((doc) => {
        inventoryList.push({ name: doc.id, ...doc.data() });
      });
      setInventory(inventoryList);
    } catch (error) {
      console.error("Error updating inventory:", error);
    }
  };

  const addItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        await setDoc(docRef, { quantity: quantity + 1 });
      } else {
        await setDoc(docRef, { quantity: 1 });
      }
      await updateInventory();
    } catch (error) {
      console.error("Error adding item:", error);
    }
  };

  const removeItem = async (item) => {
    try {
      const docRef = doc(collection(firestore, 'inventory'), item);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const { quantity } = docSnap.data();
        if (quantity === 1) {
          await deleteDoc(docRef);
        } else {
          await setDoc(docRef, { quantity: quantity - 1 });
        }
      }
      await updateInventory();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on searchTerm
  const filteredInventory = inventory.filter(({ name }) =>
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      bgcolor="#000"
      sx={{
        fontFamily: 'cursive',
        backgroundImage: 'url(/path/to/your/background-image.jpg)', // Ensure this path is correct
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Typography variant="h2" color="#fff" textAlign="center" sx={{ fontWeight: 'bold' }}>
        Inventory Management
      </Typography>
      <AppBar position="static" sx={{ bgcolor: '#fff0f5' }}>
        <Toolbar>
          <TextField
            variant="outlined"
            placeholder="Search items"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'black' }} />
                </InputAdornment>
              ),
              sx: { color: 'black', '& .MuiOutlinedInput-root': { borderColor: 'white' } }
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleOpen}
            sx={{
              ml: 2,
              bgcolor: '#ff4081',
              transition: 'background-color 0.3s',
              '&:hover': { bgcolor: '#ff79b0' }
            }}
          >
            Add New Item
          </Button>
        </Toolbar>
      </AppBar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ fontWeight: 'bold' }}>
            Add Item
          </Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              sx={{
                bgcolor: '#ff4081',
                transition: 'background-color 0.3s',
                '&:hover': { bgcolor: '#ff79b0' }
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Box width="1500px" height="850px" border="1px solid #fff" borderRadius="15px" overflow="auto">
        <Fade in timeout={1000}>
          <Box
            width="100%"
            height="150px"
            bgcolor="#f0f0d2"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Typography variant="h2" color="#000" textAlign="center" sx={{ fontWeight: 'bold' }}>
              Items
            </Typography>
          </Box>
        </Fade>
        <Stack width="100%" height="100%" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Fade in timeout={1000} key={name}>
              <Box
                width="100%"
                minHeight="150px"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                bgcolor="#fff"
                paddingX={2}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': { bgcolor: '#fff0f5' },
                }}
              >
                <Typography variant="h4" color="#ff7f50" textAlign="center">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </Typography>
                <Typography variant="h4" color="#ff7f50" textAlign="center">
                  {quantity}
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                  sx={{
                    bgcolor: '#f44336',
                    color: '#fff',
                    transform: 'perspective(1px) translateZ(0)',
                    transition: 'transform 0.3s, background-color 0.3s',
                    '&:hover': {
                      bgcolor: '#e57373',
                      transform: 'perspective(1px) translateZ(0) scale(1.1)',
                    },
                  }}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                  sx={{
                    bgcolor: '#f44336',
                    color: '#fff',
                    transform: 'perspective(1px) translateZ(0)',
                    transition: 'transform 0.3s, background-color 0.3s',
                    '&:hover': {
                      bgcolor: '#e57373',
                      transform: 'perspective(1px) translateZ(0) scale(1.1)',
                    },
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Fade>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
