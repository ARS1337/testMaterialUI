import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Grid, TextField, Checkbox } from "@material-ui/core";
import request from "./utils";
import CloseIcon from "@material-ui/icons/Close";
import { InputLabel } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from "@material-ui/icons/Delete";
import { useSnackbar } from "notistack";
import { SnackbarProvider } from "notistack";

function CustomModal({ closeModal, modalId, user, getUsers,handleDelete }) {
  console.log("user is ", user);
  const [Modalname, setName] = useState(user.name);
  const [Modalid, setId] = useState(user.id);
  const [Modaldesc, setDesc] = useState(user.desc);
  const [ModalIsActive, setModalIsActive] = useState(user.isActive);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  console.log("id is ", Modalid);
  const body={
      id:Modalid,
      name:Modalname,
      desc:Modaldesc,
      isActive:ModalIsActive
  }
  const handleUpdate = () => {
     const body={
        id:Modalid,
        name:Modalname,
        desc:Modaldesc,
        isActive:ModalIsActive
    }
    if (Modalid != null) {
      if (Modalname != "" && Modaldesc != "") {
        request(`/users/${Modalid}`, "PATCH", body)
          .then((res) => {
            res.status == 200
              ? enqueueSnackbar("user updated successfully")
              : enqueueSnackbar("user does not exist!");
          }).then(()=>{getUsers();closeModal()})
          .catch((err) => enqueueSnackbar("Error occurred while deleting user!", err));
      } else {
        enqueueSnackbar("enter name and desc to continue!");
      }
    } else {
      console.log(Modalid);
      enqueueSnackbar("Enter id to continue!");
    }
  };
  return (
    <>
      <Container
        maxWidth={"md"}
        style={{
          paddingTop: "5vh",
          paddingBottom: "5vh",
          alignItems:'center',
          justifyContent:"center",
          width: "100vw",
          height: "80vh",
          backgroundColor: "whitesmoke",
        }}
      >
        <Paper
          elevation={24}
          style={{
            padding: "5vw",
          }}
        >
          <Grid
            container
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            style={{
              paddingTop: "5vh",
              paddingBottom: "5vh",
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                closeModal();
              }}
            >
              <ArrowBackIcon />
              Back
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={() => {
                closeModal();
              }}
            >
              <CloseIcon />
              Close
            </Button>
          </Grid>

          <Grid
            container
            direction="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <Grid item>
              <TextField
                variant="outlined"
                placeholder="Id: "
                value={Modalid}
                onChange={(e) => {
                  setId(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                placeholder="Name: "
                value={Modalname}
                onChange={(e) => {
                  setName(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <TextField
                variant="outlined"
                placeholder="desc: "
                value={Modaldesc}
                onChange={(e) => {
                  setDesc(e.target.value);
                  console.log(e.target.value);
                }}
              />
            </Grid>
            <Grid item>
              <InputLabel for="isOnline">
                Online
                <Checkbox
                  color="primary"
                  id="isOnline"
                  checked={ModalIsActive}
                  onChange={() => {
                    setModalIsActive(!ModalIsActive);
                    console.log(ModalIsActive)
                  }}
                ></Checkbox>
              </InputLabel>
            </Grid>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              style={{
                paddingTop: "5vh",
                paddingBottom: "5vh",
              }}
            >
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                    handleUpdate()
                  }}
                >
                  <ArrowUpwardIcon />
                  Update
                </Button>
              </Grid>
              <Grid item>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={() => {
                      handleDelete(Modalid)
                  }}
                >
                  <DeleteIcon />
                  Delete
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}

export default CustomModal;
