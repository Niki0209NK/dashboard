import { useEffect, useState } from "react";
import { Box, Button, Chip } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

import {
  ExercisesStore,
  TaskSheetsStore,
  TaskSheetType,
  ExerciseStatus,
  deleteExercise,
} from "../../data/DataStore";

const Exercises = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const location = useLocation();

  const sheetIdFromState = location.state?.sheetId || null;
  const [selectedSheet] = useState(
  sheetIdFromState
    ? TaskSheetsStore.find((t) => t.id === sheetIdFromState)
    : null
);


  const [tasksForSheet, setTasksForSheet] = useState([]);

  useEffect(() => {
    if (!selectedSheet) return;
    setTasksForSheet(
      ExercisesStore.filter((e) => e.taskSheetId === selectedSheet.id)
    );
  }, [selectedSheet]);

  const rows = selectedSheet ? tasksForSheet : ExercisesStore;

  const getSheet = (id) => TaskSheetsStore.find((t) => t.id === id);

  const columns = [
    { field: "id", headerName: "ID", flex: 0.6 },
    { field: "title", headerName: "Titel", flex: 1.2 },

    {
      field: "status",
      headerName: "Status",
      flex: 0.6,
      renderCell: (p) => (
        <Chip
          label={
            p.row.status === ExerciseStatus.COMPLETED ? "Completed" : "Open"
          }
          color={
            p.row.status === ExerciseStatus.COMPLETED ? "success" : "warning"
          }
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
        return sheet?.type === TaskSheetType.KLAUSUR
          ? "Klausur"
          : "Aufgabe";
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
              sx={{
                backgroundColor: colors.blueAccent[500],
                color: "white",
                fontWeight: "bold",
              }}
            />
          )}
          {p.row.subTags?.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ ml: 0.5 }} />
          ))}
        </>
      ),
    },

    {
      field: "open",
      headerName: "Lösungen",
      flex: 0.6,
      renderCell: (p) => (
        <Button
          variant="contained"
          size="small"
          disabled={!p.row.solutionIds.length}
          onClick={() =>
            navigate(`/exercises/${p.row.id}/solutions`, {
              state: { sheetId: p.row.taskSheetId },
            })
          }
        >
          Öffnen
        </Button>
      ),
    },

    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (p) => (
        <Button
          color="error"
          size="small"
          onClick={() => {
            deleteExercise(p.row.id);
            setTasksForSheet((prev) =>
              prev.filter((e) => e.id !== p.row.id)
            );
          }}
        >
          Löschen
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="Aufgaben"
        subtitle={selectedSheet ? selectedSheet.title : "Alle Übungen"}
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
          getRowId={(r) => r.id}
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

export default Exercises;
