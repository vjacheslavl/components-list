import React, { SyntheticEvent } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TextField from "@material-ui/core/TextField";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import { apiRoute } from "../utils";
import { Firmware } from "../../server/domain/Firmware";
import { Put, Get } from "../Services";
import {
  FormControlLabel,
  Grid,
  styled,
  TablePagination,
} from "@material-ui/core";
import { FormGroup } from "@material-ui/core";
import { getComparator, stableSort } from "../sorting";
import LoginForm from "../Components/login";

const COLUMNS = {
  QA: "isQaDone",
  BETA: "isBeta",
  RELEASED: "isReleased",
  PRODUCTION: "isProduction",
  DESCRIPTION: "description",
};

const headCells = [
  { id: "name", numeric: false, disablePadding: false, label: "Name" },
  {
    id: "version",
    numeric: false,
    disablePadding: false,
    label: "Version (revision)",
  },
  {
    id: "jenkinsLink",
    numeric: false,
    disablePadding: false,
    label: "Jenkins link",
  },
  {
    id: "dateTimeAdded",
    numeric: false,
    disablePadding: false,
    label: "Created on",
  },
  { id: COLUMNS.QA, numeric: false, disablePadding: true, label: "QA" },
  { id: COLUMNS.BETA, numeric: false, disablePadding: true, label: "Beta" },
  {
    id: COLUMNS.RELEASED,
    numeric: false,
    disablePadding: true,
    label: "Released",
  },
  {
    id: COLUMNS.PRODUCTION,
    numeric: false,
    disablePadding: false,
    label: "Production",
  },
  {
    id: COLUMNS.DESCRIPTION,
    numeric: false,
    disablePadding: false,
    label: "Description",
  },
];

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
};

const useStyles = makeStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  root: {
    width: "100%",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
  title: {
    flex: "1 1 100%",
  },
  filter: {
    width: "80%",
  },
  login: {
    width: "20%",
    alignItems: "right",
  },
  logo: {
    width: "20px",
    marginRight: "3px",
  },
}));

export default function EnhancedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState("desc");
  const [orderBy, setOrderBy] = React.useState("dateTimeAdded");
  const [textFilter, setTextFilter] = React.useState("");
  const [betaFilter, setBetaFilter] = React.useState(true);
  const [rows, updateRows] = React.useState<Firmware[]>([]);
  const [open, setOpen] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);
  const [page, setPage] = React.useState(0);
  const [descriptionId, setDescriptionId] = React.useState("");
  const [selectedDescription, setSelectedDescription] = React.useState("");
  const [loginOpen, setLoginOpen] = React.useState(false);
  const [userLoggedIn, setUserLoggedIn] = React.useState(false);
  const [loginState, setLoginState] = React.useState({
    login: "",
    password: "",
  });

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleClickOpen = (selectedId, description) => {
    setSelectedDescription(description);
    setDescriptionId(selectedId);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLoginChange = (event: SyntheticEvent) => {
    //@ts-ignore
    loginState[event.target.id] = event.target.value;
    setLoginState(loginState);
  };

  const handleLogin = () => {
    if (loginState.login === "admin" && loginState.password === "1234") {
      setUserLoggedIn(true);
      setLoginOpen(false);
      console.log("User logged in");
    } else {
      console.error("Login failed");
    }
  };

  const closeLogin = () => {
    setLoginOpen(false);
  };

  const handleDescriptionChange = (event) => {
    setSelectedDescription(event.target.value);
  };

  React.useEffect(
    function effectFunction() {
      async function fetchBookList() {
        try {
          var res: Firmware[] = await Get(apiRoute.getRoute("firmwares"));
          if (textFilter != "") {
            const searchFilter = textFilter.toLowerCase();
            res = res.filter(
              (i) =>
                i.name.toLocaleLowerCase().indexOf(searchFilter) !== -1 ||
                i.version.toLocaleLowerCase().indexOf(searchFilter) !== -1 ||
                (i.revision !== undefined &&
                  i.revision.toLocaleLowerCase().indexOf(searchFilter) !== -1)
            );
          }
          if (betaFilter === false) {
            res = res.filter((i) => !i.isBeta);
          }
          updateRows(res);
        } catch (error) {
          console.log(error);
        }
      }
      fetchBookList();
    },
    [textFilter, betaFilter]
  );

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const makeCustomRowStyle = (row: Firmware): React.CSSProperties => {
    if (row.isQaDone) {
      return { backgroundColor: "#E9FFE7" };
    } else {
      return {};
    }
  };
  function changeValue(row: Firmware, field, value) {
    row[field] = value;
    return row;
  }

  const handleCheckboxClick = async (
    index: string,
    value: boolean,
    field: string
  ): Promise<void> => {
    try {
      await Put(apiRoute.getRoute("firmwares"), {
        id: index,
        value: value,
        field: field,
      });

      updateRows(
        rows.map((row) =>
          row._id == index ? changeValue(row, field, value) : row
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleSave = async (): Promise<void> => {
    setOpen(false);
    try {
      await Put(apiRoute.getRoute("firmwares"), {
        id: descriptionId,
        value: selectedDescription,
        field: COLUMNS.DESCRIPTION,
      });
      updateRows(
        rows.map((row) =>
          row._id == descriptionId
            ? changeValue(row, COLUMNS.DESCRIPTION, selectedDescription)
            : row
        )
      );
    } catch (e) {
      console.log(e);
    }
  };

  const handleFilterChange = async (event): Promise<void> => {
    setTextFilter(event.target.value);
    setPage(0);
  };

  const handleBetaFilterChange = async (event, filterValue): Promise<void> => {
    setBetaFilter(!filterValue);
    setPage(0);
  };

  const openLoginDialog = async (event): Promise<void> => {
    setLoginOpen(true);
  };

  const convertDate = (isoDateTime) => {
    return isoDateTime.split("T")[0];
  };

  const Item = styled(Paper)(({ theme }) => ({
    //...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    height: "100%",
    border: "0px",
    boxShadow: "none",
    fontFamily: "Roboto, Helvetica, Arial, sans-serif",
    //color: theme.palette.text.secondary,
  }));

  //<img src={require("./atlaslogo.png")} className={classes.logo} />

  return (
    <Paper className={classes.paper}>
      <Grid className={clsx(classes.root)} container spacing={1}>
        <Grid item xs={3}>
          <Item style={{textAlign: "left"}}>
            Firmware versions registry
          </Item>
        </Grid>
        <Grid item xs={3}>
          <Item>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={betaFilter} />}
                label="show beta versions"
                onChange={(event) => handleBetaFilterChange(event, betaFilter)}
              />
            </FormGroup>
          </Item>
        </Grid>
        <Grid item xs={4}>
          <Item>
            <TextField
              autoFocus={textFilter!=""}
              onChange={(event) => handleFilterChange(event)}
              id="text-filter"
              fullWidth
              value={textFilter}
              label="Filter by text"
              color="primary"
            />
          </Item>
        </Grid>
        <Grid item xs={2}>
          <Item>
            <Button variant="contained" onClick={openLoginDialog}>
              Login
            </Button>
          </Item>
        </Grid>
      </Grid>
      <TableContainer>
        <Table
          className={classes.table}
          aria-labelledby="tableTitle"
          size="small"
          aria-label="enhanced table"
        >
          <EnhancedTableHead
            classes={classes}
            order={order}
            orderBy={orderBy}
            onRequestSort={handleRequestSort}
          />
          <TableBody>
            {stableSort(rows, getComparator(order, orderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row._id}
                    style={makeCustomRowStyle(row)}
                  >
                    <TableCell id={labelId} scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>
                      {row.version}
                      <br />
                      <span style={{ fontSize: "0.5rem" }}>
                        {row.revision ? ` ${row.revision}` : ""}
                      </span>
                    </TableCell>
                    <TableCell>
                      <a href={row.jenkinsLink} target="_blank">
                        Link
                      </a>
                    </TableCell>
                    <TableCell>{convertDate(row.dateTimeAdded)}</TableCell>
                    <TableCell>
                      <Checkbox
                        checked={row.isQaDone}
                        disabled={!userLoggedIn}
                        onClick={() =>
                          handleCheckboxClick(
                            row._id,
                            !row.isQaDone,
                            COLUMNS.QA
                          )
                        }
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={row.isBeta}
                        disabled={!userLoggedIn}
                        onClick={() =>
                          handleCheckboxClick(
                            row._id,
                            !row.isBeta,
                            COLUMNS.BETA
                          )
                        }
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={row.isReleased}
                        disabled={!userLoggedIn}
                        onClick={() =>
                          handleCheckboxClick(
                            row._id,
                            !row.isReleased,
                            COLUMNS.RELEASED
                          )
                        }
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={row.isProduction}
                        disabled={!userLoggedIn}
                        onClick={() =>
                          handleCheckboxClick(
                            row._id,
                            !row.isProduction,
                            COLUMNS.PRODUCTION
                          )
                        }
                        inputProps={{ "aria-label": "primary checkbox" }}
                      />
                    </TableCell>
                    <TableCell
                      onClick={() => handleClickOpen(row._id, row.description)}
                    >
                      <span style={{ fontSize: "0.7rem" }}>
                        {row.description}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[25, 50, 100, 200]}
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Update description</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can add additional information about firmware here
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id={COLUMNS.DESCRIPTION}
            label="Description"
            value={selectedDescription}
            onChange={(event) => handleDescriptionChange(event)}
            multiline
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <LoginForm
        open={loginOpen}
        onClose={closeLogin}
        onLoginChange={handleLoginChange}
        onLogin={handleLogin}
      ></LoginForm>
    </Paper>
  );
}
