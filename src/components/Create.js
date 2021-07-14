import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "@material-ui/core/Button";
import Container from "@material-ui/core/Container";
import { Grid, TextField, Checkbox } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import DeleteIcon from "@material-ui/icons/Delete";
import AddIcon from "@material-ui/icons/Add";
import ReplayIcon from "@material-ui/icons/Replay";
import request from "./utils";
import { InputLabel } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import { useSnackbar } from "notistack";
import { SnackbarProvider } from "notistack";
import { Warning } from "@material-ui/icons";
import Paper from "@material-ui/core/Paper";

function Create(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 180,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 180,
      editable: false,
    },
    {
      field: "desc",
      headerName: "Description",
      width: 180,
      editable: false,
    },
    {
      field: "isActive",
      headerName: "Online",
      width: 180,
      editable: false,
    },
  ];

  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState(["f", "h"]);
  const [toggle, setToggle] = useState(false);
  const [id, setId] = useState("");
  const [users, setUsers] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalId, setModalId] = useState(0);
  const [deleteList, setDeleteList] = useState([]);
  const [showActiveUsers, setShowActiveUsers] = useState(true);
  const [showInActiveUsers, setshowInActiveUsers] = useState(true);
  const [loading, setLoading] = useState(true);

  const getUser = () => toast("user retrieved!");
  const getUserFailed = () => toast("user retrieval failed!");
  const deleteAll = () => toast("deleted selected users!");

  let body = {
    name: name,
    desc: desc,
    isActive: toggle,
    id: id,
  };

  const openModal = (id) => {
    console.log(id);
    setModalId(id);
    setModal(true);
  };

  const closeModal = () => {
    setModal(false);
  };

  const getUsers = () => {
    request("/users", "GET")
      .then((res) => {
        return res.json();
      })
      .then((r) => {
        setUsers(r);
        console.log(r);
        enqueueSnackbar("all user retrieved", { variant: "info" });
      });
  };
  useEffect(async () => {
    await request("/data", "GET").then((res) => {
      res.json().then((r) => setCategory(r));
      getUsers();
    });
    setLoading(!loading);
  }, []);
  const checkValidity = () => {
    if ((id == null) | (id == undefined) | (id == "")) {
      enqueueSnackbar("Please enter id to continue!", { variant: "warning" });
      return false;
    }
    if ((name == null) | (name == undefined) | (name == "")) {
      enqueueSnackbar("Please enter name to continue!", { variant: "warning" });
      return false;
    }
    if ((desc == null) | (desc == undefined) | (desc == "")) {
      enqueueSnackbar("Please enter desc to continue!", { variant: "warning" });
      return false;
    }
    return true;
  };
  const handleAdd = () => {
    if (checkValidity()) {
      request("/users", "POST", body)
        .then((res) =>
          res != {}
            ? enqueueSnackbar("user added successfully!", {
                variant: "success",
              })
            : ""
        )
        .then(getUsers())
        .catch((err) =>
          enqueueSnackbar("Error occurred while adding user!", {
            variant: "error",
          })
        );
    }
  };

  const handleDelete = (id = id) => {
    if ((id != null) & (id.length > 0)) {
      request(`/users/${id}`, "DELETE", {})
        .then((res) => {
          res.status == 180
            ? alert("user deleted successfully")
            : alert("user does not exist!");
        })
        .then(getUsers())
        .catch((err) => alert("Error occurred while deleting user!", err));
    } else {
      alert("Enter id to continue!");
    }
  };

  const batchDelete = async () => {
    await deleteList.forEach(async (x) => {
      await setTimeout(() => {
        request(`/users/${x}`, "DELETE").then((r) => {
          console.log(r);
        });
      }, 500);
    });
    console.log(deleteList);
    setDeleteList([]);
    console.log(deleteList);
    getUsers();
    console.log("get ussersaf");
  };
  const handleDeleteAll = () => {
    console.log("delete all clicked");
  };
  const handleRetrieve = () => {
    if ((id != null) & (id.length > 0)) {
      request(`/users/${id}`, "GET")
        .then((res) => {
          if (res.status == 200) {
            res.json().then((r) => {
              console.log("dgdgdfgdf", r);
              setName(r.name);
              setDesc(r.desc);
              setToggle(r.isActive);
              enqueueSnackbar("User retrieved successfully!", {
                variant: "success",
              });
            });
          } else {
            enqueueSnackbar("An error occurred while retrieving!", {
              variant: "error",
            });
          }
        })
        .catch((err) =>
          enqueueSnackbar("Error occurred while deleting user!", {
            variant: "info",
          })
        );
    } else {
      enqueueSnackbar("Enter id to continue!", { variant: "warning" });
    }
  };

  return (
    <Container
      maxWidth={"md"}
      style={{ paddingTop: "5vh", paddingBottom: "5vh" }}
    >
      <Paper elevation={24}>
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
              value={id}
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
              value={name}
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
              value={desc}
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
                checked={toggle}
                onChange={() => {
                  setToggle(!toggle);
                }}
              ></Checkbox>
            </InputLabel>
          </Grid>
        </Grid>
        <Grid
          style={{ paddingTop: "5vh" }}
          container
          direction="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleAdd();
              }}
            >
              <AddIcon />
              add
            </Button>
          </Grid>
          <Grid item>
            <InputLabel for="showActiveUsers">
              Show Active Users
              <Checkbox
                id="showActiveUsers"
                color="primary"
                checked={showActiveUsers}
                onClick={() => {
                  setShowActiveUsers(!showActiveUsers);
                  console.log(showActiveUsers);
                }}
              >
                showactive
              </Checkbox>
            </InputLabel>
          </Grid>
          <Grid item>
            <InputLabel for="showInActiveUsers">
              Show InActive Users
              <Checkbox
                id="showInActiveUsers"
                color="primary"
                checked={showInActiveUsers}
                onClick={() => {
                  setshowInActiveUsers(!showInActiveUsers);
                  console.log(showInActiveUsers);
                }}
              >
                showactive
              </Checkbox>
            </InputLabel>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                handleRetrieve();
              }}
            >
              <ReplayIcon />
              Retrieve
            </Button>
          </Grid>
        </Grid>
        <div style={{ width: "100%", paddingTop: "5vh" }}>
          <DataGrid
            rows={users
              .filter((item) =>
                item.name.includes(name.toString())
                  ? true
                  : name.includes(item.name)
                  ? true
                  : false
              )
              .filter((item) => {
                if (showActiveUsers && item.isActive == true) {
                  return true;
                }
                if (showInActiveUsers && item.isActive == false) {
                  return true;
                }
              })
              .map(x=>x)
            }
            columns={columns}
            pageSize={5}
            checkboxSelection
            disableSelectionOnClick
            autoHeight={true}
            onColumnHeaderClick={(header) => {
              console.log(header);
              if (header.field === "__check__") {
                handleDeleteAll();
              }
            }}
            onRowSelected={(row) => {
              let rowId = row.data.id.toString();
              let temp = deleteList;
              if (deleteList.includes(rowId)) {
                let temp = deleteList.filter((r) => r !== rowId);
                setDeleteList(temp);
                console.log(temp);
              } else {
                temp.push(row.data.id);
                setDeleteList(temp);
                console.log(temp);
              }
            }}
          />
        </div>
        <Grid
          container
          style={{ paddingTop: "5vh", paddingBottom: "5vh" }}
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            {deleteList ? (
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  batchDelete();
                }}
              >
                <DeleteIcon />
                Delete
              </Button>
            ) : null}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
export default function IntegrationNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <Create />
    </SnackbarProvider>
  );
}
// export default Create;
