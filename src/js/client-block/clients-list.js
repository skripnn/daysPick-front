import React from "react";
import TableRow from "@material-ui/core/TableRow";
import Hidden from "@material-ui/core/Hidden";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableBody from "@material-ui/core/TableBody";

function ClientRow(props) {

  return (
    <TableRow className="client-list-row" id={props.id}>
      <TableCell scope="row">{props.name}</TableCell>
      <Hidden xsDown>
        <TableCell>{props.phone}</TableCell>
      </Hidden>
    </TableRow>
  )
}

function ClientsTable(props) {
  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <Hidden xsDown>
              <TableCell>Клиент</TableCell>
              <TableCell>Телефон</TableCell>
            </Hidden>
          </TableRow>
        </TableHead>
        <TableBody>
          {props.clients.map((client) => (
            <ClientRow key={client.id} {...client}/>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}


export function ClientsList(props) {
  return (
    <>
      <ClientsTable {...props}/>
    </>
  )
}