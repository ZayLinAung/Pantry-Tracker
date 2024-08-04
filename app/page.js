"use client";

import Image from "next/image";
import {
  Box,
  Container,
  Button,
  Typography,
  List,
  ListItem,
  Avatar,
  IconButton,
  ListItemAvatar,
  ListItemText,
  Paper,
  ListItemIcon,
  TextField,
  InputAdornment,
  ListItemButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { useState, useEffect } from "react";
import SearchIcon from "@mui/icons-material/Search";

import { firestore } from "@/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
  where,
  startAt,
  orderBy,
  addDoc,
  endAt
} from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [itemName, setItemName] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const updateInventory = async (item) => {
    var snapshot;

    // snapshot = query(collection(firestore, "pantry"));
    if (item === "") {
      snapshot = query(collection(firestore, "pantry"));
    } else {
      snapshot = query(
        collection(firestore, "pantry"),
        orderBy("Name"),
        startAt(item.toLowerCase()),
        endAt(item.toLowerCase() + '\uf8ff')
      );
      console.log(snapshot);
    }

    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  const addItem = async (item) => {
    const pantryRef = collection(firestore, "pantry");
    const q = query(pantryRef, where("Name", "==", item));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Document with this name exists
      const docRef = querySnapshot.docs[0].ref;
      const { Count } = querySnapshot.docs[0].data();
      await updateDoc(docRef, { Count: Count + 1 });
    } else {
      console.log('lee lr')
      // Document doesn't exist, create a new one with auto-generated ID
      await addDoc(pantryRef, { Name: item, Count: 1 });
    }

    await updateInventory(searchValue);
  };

  const removeItem = async (item) => {
    const pantryRef = collection(firestore, "pantry");
    const q = query(pantryRef, where("Name", "==", item));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const { Count } = doc.data();

      // If Count is more than 1, decrement it
      await updateDoc(doc.ref, { Count: Count - 1 });
    } else {
      console.log("Item not found in pantry");
    }

    await updateInventory(searchValue);
  };

  useEffect(() => {
    updateInventory(searchValue);
  }, []);

  return (
    <Container
      sx={{
        display: "flex",
        gap: "100px",
        alignItems: "start",
        p: 12,
      }}
    >
      <Box
        sx={{
          border: "3px solid #ADBBDA",
          borderRadius: "10px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <Box
          sx={{
            bgcolor: "#3D52A0",
            borderRadius: "7px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            p: "15px",
          }}
        >
          <ShoppingCartIcon sx={{ color: "white" }} />
          <Typography variant="h5" sx={{ color: "white" }}>
            My Cart
          </Typography>
        </Box>

        <List
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            p: "30px",
            maxHeight: "480px",
            overflow: "auto",
          }}
        >
          {inventory.map((i) =>
            i["Count"] > 0 ? (
              <Paper sx={{ bgcolor: "#7091E6" }} elevation={12}>
                <ListItem alignItems="center">
                  <ListItemText sx={{ textAlign: "center", color: "white" }}>
                    {i["Name"]}
                  </ListItemText>
                  <ListItemText sx={{ textAlign: "center", color: "white" }}>
                    x {i["Count"]}
                  </ListItemText>
                  <ListItemIcon>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{ color: "white" }}
                      onClick={() => {
                        addItem(i["Name"]);
                      }}
                    >
                      <AddShoppingCartIcon />
                    </IconButton>
                  </ListItemIcon>
                  <ListItemIcon>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      sx={{ color: "white" }}
                      onClick={() => {
                        removeItem(i["Name"]);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemIcon>
                </ListItem>
              </Paper>
            ) : null
          )}
        </List>
      </Box>

      {/* Section2 */}
      <Box
        sx={{
          flex: 2,
          border: "3px solid #ADBBDA",
          borderRadius: "10px",
          height: "600px",
        }}
      >
        <Box
          sx={{
            bgcolor: "#3D52A0",
            borderRadius: "7px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            p: "15px",
          }}
        >
          <ShoppingCartIcon sx={{ color: "white" }} />
          <Typography variant="h5" sx={{ color: "white" }}>
            Pantry items
          </Typography>
        </Box>

        {/* Search Bar */}
        <Container
          sx={{
            p: "30px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <TextField
              sx={{ width: "500px" }}
              variant="outlined"
              fullWidth
              placeholder="Search..."
              onChange={(e) => {
                setSearchValue(e.target.value);
                updateInventory(e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>

        <Box sx={{ height: 420, overflow: "auto" }}>
          <Grid
            container
            sx={{ p: "15px" }}
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {inventory.map((i) => (
              <Grid item xs={4}>
                <Paper
                  elevation={5}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 2,
                  }}
                >
                  <Typography variant="h6">{i["Name"]}</Typography>
                  <Box
                    component="img"
                    src={i["Image"]}
                    sx={{ width: "100%", height: "150px", mb: 2 }}
                  />
                  <Button
                    variant="outlined"
                    onClick={() => {
                      addItem(i["Name"]);
                    }}
                  >
                    Add
                  </Button>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
