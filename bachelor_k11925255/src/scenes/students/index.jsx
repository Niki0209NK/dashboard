import { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import { StudentsStore, SolutionsStore } from "../../data/DataStore";

const Students = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const rowsData = StudentsStore.map((student) => {
      const lösungenCount = SolutionsStore.filter(
        (s) => s.studentId === student.id
      ).length;
      return {
        id: student.id, // DataGrid benötigt unique id
        studentId: student.id,
        vorname: student.vorname,
        nachname: student.nachname,
        lösungenCount,
      };
    });
    setRows(rowsData);
  }, []);

  const columns = [
    { field: "vorname", headerName: "Vorname", flex: 1 },
    { field: "nachname", headerName: "Nachname", flex: 1 },
    { field: "studentId", headerName: "Student ID", flex: 1 },
    { field: "lösungenCount", headerName: "Abgegebene Aufgaben", flex: 1 },
    {
      field: "open",
      headerName: "Öffnen",
      flex: 0.5,
      renderCell: (params) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            navigate(`/students/${params.row.studentId}/solutions`, {
              state: {
                vorname: params.row.vorname,
                nachname: params.row.nachname,
              },
            })
          }
        >
          Öffnen
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Studenten"
        subtitle="Liste aller Studenten mit abgegebenen Lösungen"
      />
      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiButton-root": { textTransform: "none" },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          localeText={{
          toolbarColumns: "Spalten",          
          toolbarFilters: "Filter",    
          toolbarDensity: "Ansicht",            
          toolbarExport: "Exportieren",        
          }}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </Box>
    </Box>
  );
};

export default Students;
