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
import { useSnackbar } from "notistack";
import { SnackbarProvider } from "notistack";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import Modal from "@material-ui/core/Modal";

const CustomModal = React.lazy((r) => import("./CustomModal"));

function Create(props) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const columns = [
    {
      field: "id",
      headerName: "ID",
      type: "number",
      width: 150,
      editable: false,
    },
    {
      field: "name",
      headerName: "Name",
      width: 150,
      editable: false,
    },
    {
      field: "desc",
      headerName: "Description",
      width: 150,
      editable: false,
    },
    {
      field: "isActive",
      headerName: "Online",
      width: 150,
      editable: false,
    },
    {
      field: "1",
      headerName: "Edit",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = () => {
          console.log(params);
          openModal(params.id);
        };
        return (
          <Button onClick={onClick}>
            <EditIcon color="primary" />
          </Button>
        );
      },
    },
    {
      field: "",
      headerName: "Delete",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        const onClick = () => {
          console.log(params);
          let temp = [...deleteList];
          let rowId = params.id;
          if (deleteList.includes(rowId)) {
            let temp = deleteList.filter((r) => r !== rowId);
            setDeleteList(temp);
            console.log(temp);
          } else {
            temp.push(rowId);
            setDeleteList(temp);
            console.log(temp);
          }
        };
        const color = deleteList.includes(params.id) ? "secondary" : "primary";
        return (
          <Button onClick={onClick}>
            <DeleteIcon color={color} />
          </Button>
        );
      },
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
  const [pageLoading, setPageLoading] = useState(true);

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
    setPageLoading(true);
    setLoading(true);
    await request("/data", "GET").then((res) => {
      res.json().then((r) => setCategory(r));
      getUsers();
    });
    setLoading(false);
    setPageLoading(false);
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

  const handleDelete = (id=id) => {
    if ((id != null) & (id.length > 0)) {
      request(`/users/${id}`, "DELETE", {})
        .then((res) => {
          res.status == 200
            ? enqueueSnackbar("user deleted successfully")
            : enqueueSnackbar("user does not exist!");
        })
        .then(()=>{getUsers();closeModal()})
        .catch((err) => enqueueSnackbar("Error occurred while deleting user!", err));
    } else {
      enqueueSnackbar("Enter id to continue!");
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
  const handleRowSelection = (row) => {
    let rowId = row.data.id.toString();
    let temp = [...deleteList];
    if (deleteList.includes(rowId)) {
      let temp = deleteList.filter((r) => r !== rowId);
      setDeleteList(temp);
      console.log(temp);
    } else {
      temp.push(row.data.id);
      setDeleteList(temp);
      console.log(temp);
    }
  };

  return (
    <Container
      maxWidth={"md"}
      style={{
        paddingTop: "5vh",
        paddingBottom: "5vh",
        alignSelf: "flex-start",
      }}
    >
      {users != null && users.length > 0
        ? users
            .filter((x) => x.id == modalId)
            .map((x) => (
              <Modal
                open={modal}
                onClose={() => {
                  closeModal();
                }}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
              >
                <CustomModal
                  closeModal={closeModal}
                  modalId={modalId}
                  user={x}
                  getUsers={getUsers}
                  handleDelete={handleDelete}
                />
              </Modal>
            ))
        : null}

      <>
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
                .map((x) => x)}
              columns={columns}
              pageSize={5}
              disableSelectionOnClick
              autoHeight={true}
              onColumnHeaderClick={(header) => {
                console.log(header);
                if (header.field === "__check__") {
                  handleDeleteAll();
                }
              }}
              onRowSelected={(row) => {
                handleRowSelection(row);
              }}
              loading={loading}
              LoadingOverlay={<CircularProgress color="inherit" />}
              // filterModel={}
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
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  batchDelete();
                }}
              >
                <DeleteIcon />
                {/* Delete{" " + deleteList} */}
                Delete Selected {" "+deleteList.length}
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </>
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
