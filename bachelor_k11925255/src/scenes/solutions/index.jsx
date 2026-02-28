import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";

import {
  SolutionsStore,
  ExercisesStore,
  StudentsStore,
} from "../../data/DataStore";

const Solutions = () => {
  const { exerciseId } = useParams();
  const navigate = useNavigate();
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

  // Exercise laden
  const exercise = ExercisesStore.find((e) => e.id === exerciseId);

  if (!exercise) {
    return (
      <Box m="20px">
        <Header title="Fehler" subtitle="Aufgabe nicht gefunden" />
        <Button variant="contained" onClick={() => navigate(-1)}>
          Zurück
        </Button>
      </Box>
    );
  }

  // Solutions für diese Exercise
  const rows = SolutionsStore.filter(
    (s) => s.exerciseId === exerciseId
  ).map((s) => {
    const student = StudentsStore.find(
      (st) => st.id === s.studentId
    );

    return {
      ...s,
      studentName: student
        ? `${student.vorname} ${student.nachname}`
        : s.studentId,
    };
  });

  const columns = [
    {
      field: "studentName",
      headerName: "Student",
      flex: 1,
    },
    {
      field: "answer",
      headerName: "Antwort",
      flex: 2,
    },
    {
      field: "syntax",
      headerName: "Syntax",
      flex: 0.5,
      valueGetter: (p) => p.row.analysis?.Syntaxfehler ?? "–",
    },
    {
      field: "logic",
      headerName: "Logik",
      flex: 0.5,
      valueGetter: (p) => p.row.analysis?.Logikfehler ?? "–",
    },
    {
      field: "runtime",
      headerName: "Runtime",
      flex: 0.5,
      valueGetter: (p) => p.row.analysis?.Laufzeitfehler ?? "–",
    },
  ];

  return (
    <Box m="20px">
            <Header
        title="Lösungen"
        subtitle={exercise.title}
      />
    

      <Box mb="20px">
        <Button variant="contained" color="primary" onClick={() => navigate(-1)}
	>
          Zurück
        </Button>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": { backgroundColor: colors.blueAccent[700], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[700] },
          "& .MuiButton-root": { textTransform: "none" },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": { color: `${colors.grey[100]} !important` },
        }}
      >
        <DataGrid
          rows={rows}
        getRowId={(r) => r.id}
        columns={columns}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10]}
          components={{ Toolbar: GridToolbar }}
          localeText={{
          toolbarColumns: "Spalten",          
          toolbarFilters: "Filter",    
          toolbarDensity: "Ansicht",            
          toolbarExport: "Exportieren",        
          }}
        />
      </Box>
    </Box>
  );
};

export default Solutions;
