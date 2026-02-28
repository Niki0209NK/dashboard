import { Box, Button, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@mui/material";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import {
  ExercisesStore,
  TaskSheetsStore,
  SolutionsStore,
  ExerciseStatus,
} from "../../data/DataStore";

const StudentSolutions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const { studentId } = useParams();

  // Alle Lösungen des Studenten
  const studentSolutions = SolutionsStore.filter(
    (sol) => sol.studentId === studentId
  ).map((sol) => {
    const exercise = ExercisesStore.find((e) => e.id === sol.exerciseId);
    return {
      ...sol,
      taskTitle: exercise?.title ?? "–",
      mainTag: exercise?.mainTag,
      subTags: exercise?.subTags ?? [],
      taskSheetId: exercise?.taskSheetId,
      status: exercise?.status ?? ExerciseStatus.OPEN,
    };
  });

  const getSheet = (id) => TaskSheetsStore.find((t) => t.id === id);

  const rows = studentSolutions.map((sol) => ({
    id: sol.id,
    title: sol.taskTitle,
    status: sol.status,
    taskSheetId: sol.taskSheetId,
    type: getSheet(sol.taskSheetId)?.type,
    mainTag: sol.mainTag,
    subTags: sol.subTags,
    answer: sol.answer,
  }));

  const columns = [
    { field: "id", headerName: "ID", flex: 0.6 },
    { field: "title", headerName: "Titel", flex: 1.2 },
    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (p) => (
        <Chip
          label={p.row.status === ExerciseStatus.COMPLETED ? "Completed" : "Open"}
          color={p.row.status === ExerciseStatus.COMPLETED ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "taskSheet",
      headerName: "Aufgabenblatt",
      flex: 1,
      valueGetter: (p) => getSheet(p.row.taskSheetId)?.title ?? "–",
    },
    {
      field: "type",
      headerName: "Typ",
      flex: 0.6,
      valueGetter: (p) => {
        const sheet = getSheet(p.row.taskSheetId);
        return sheet?.type === "K" ? "Klausur" : "Aufgabe";
      },
    },
    {
      field: "tags",
      headerName: "Tags",
      flex: 1.5,
      renderCell: (p) => (
        <>
          {p.row.mainTag && (
            <Chip
              label={p.row.mainTag}
              size="small"
              sx={{ backgroundColor: colors.blueAccent[500], color: "white", fontWeight: "bold" }}
            />
          )}
          {p.row.subTags?.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ ml: 0.5 }} />
          ))}
        </>
      ),
    },
    {
      field: "answer",
      headerName: "Antwort",
      flex: 2,
      renderCell: (p) => <span>{p.row.answer}</span>,
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Studentenlösungen"
        subtitle={`Alle Lösungen von ${studentId}`}
      />

      <Box mb="20px">
        <Button variant="contained" color="primary" onClick={() => navigate("/students")}>
          Zurück zur Studentenliste
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
          columns={columns}
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

export default StudentSolutions;
