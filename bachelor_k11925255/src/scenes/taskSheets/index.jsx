import { useState, useRef } from "react";
import {
  Box,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { tokens } from "../../theme";

import {
  TaskSheetsStore,
  ExercisesStore,
  addTaskSheet,
  deleteTaskSheet,
  uploadSolutionsJSON,
  TaskSheetType,
  ExerciseStatus,
} from "../../data/DataStore";

const TaskSheets = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  /* ================= STATE ================= */
  const [openDialog, setOpenDialog] = useState(false);
  const [newSheetTitle, setNewSheetTitle] = useState("");
  const [newSheetType, setNewSheetType] = useState(TaskSheetType.AUFGABE);
  const [newSheetMaxExercises, setNewSheetMaxExercises] = useState(5);

  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploadSheet, setUploadSheet] = useState(null);
  const [fileToUpload, setFileToUpload] = useState(null);
  const fileInputRef = useRef(null);

  /* ================= COLUMNS ================= */
  const columns = [
    { field: "title", headerName: "Titel", flex: 2 },

    {
      field: "type",
      headerName: "Typ",
      flex: 0.6,
      valueGetter: (p) =>
        p.row.type === TaskSheetType.KLAUSUR ? "Klausur" : "Aufgabe",
    },

    {
      field: "open",
      headerName: "Öffnen",
      flex: 0.6,
      renderCell: (p) => (
        <Button
          variant="contained"
          size="small"
          onClick={() =>
            navigate("/exercises", { state: { sheetId: p.row.id } })
          }
        >
          Öffnen
        </Button>
      ),
    },

    {
      field: "upload",
      headerName: "Upload",
      flex: 1,
      renderCell: (p) => {
        const exercises = ExercisesStore.filter(
          (e) => e.taskSheetId === p.row.id
        );

        const current = exercises.length;
        const max = p.row.maxExercises ?? 5;

        // Upload nur erlauben, wenn alle Aufgaben vorhanden UND mindestens eine OPEN
        const canUpload =
          current === max && exercises.some((e) => e.status !== ExerciseStatus.COMPLETED);

        return (
          <Box display="flex" gap={1} alignItems="center">
            <span>{current}/{max}</span>

            {canUpload && (
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => {
                  setUploadSheet(p.row);
                  setUploadDialogOpen(true);
                }}
              >
                Upload
              </Button>
            )}
          </Box>
        );
      },
    },

    {
      field: "delete",
      headerName: "Delete",
      flex: 0.5,
      renderCell: (p) => (
        <Button
          color="error"
          size="small"
          onClick={() => deleteTaskSheet(p.row.id)}
        >
          Delete
        </Button>
      ),
    },
  ];

  /* ================= UPLOAD ================= */
  const handleFileChange = (e) => setFileToUpload(e.target.files[0]);

  const handleUpload = async () => {
    if (!fileToUpload || !uploadSheet) return;

    try {
      const text = await fileToUpload.text();
      const json = JSON.parse(text);
      await uploadSolutionsJSON(uploadSheet.id, json);

      setFileToUpload(null);
      setUploadSheet(null);
      setUploadDialogOpen(false);

      alert("Datei erfolgreich hochgeladen und analysiert!");
    } catch (err) {
      console.error(err);
      alert("Fehler beim Hochladen oder Analysieren der Datei.");
    }
  };

  /* ================= RENDER ================= */
  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="Aufgabenblätter" subtitle="Alle Aufgabenblätter" />
        <IconButton sx={{ color: "green" }} onClick={() => setOpenDialog(true)}>
          <AddIcon />
        </IconButton>
      </Box>

      <Box
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
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
          rows={TaskSheetsStore}
          getRowId={(row) => row.id}
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

      {/* ================= ADD DIALOG ================= */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Neues Aufgabenblatt hinzufügen</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Titel"
            fullWidth
            value={newSheetTitle}
            onChange={(e) => setNewSheetTitle(e.target.value)}
          />

          <TextField
            select
            margin="dense"
            label="Typ"
            fullWidth
            value={newSheetType}
            onChange={(e) => setNewSheetType(e.target.value)}
          >
            <MenuItem value={TaskSheetType.AUFGABE}>Aufgabe</MenuItem>
            <MenuItem value={TaskSheetType.KLAUSUR}>Klausur</MenuItem>
          </TextField>

          <TextField
            type="number"
            margin="dense"
            label="Anzahl Aufgaben"
            fullWidth
            value={newSheetMaxExercises}
            onChange={(e) => setNewSheetMaxExercises(Number(e.target.value))}
            inputProps={{ min: 1, max: 20 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Abbrechen</Button>
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              if (!newSheetTitle.trim() || newSheetMaxExercises < 1) return;

              addTaskSheet(
                newSheetTitle,
                newSheetType,
                newSheetMaxExercises
              );

              setNewSheetTitle("");
              setNewSheetType(TaskSheetType.AUFGABE);
              setNewSheetMaxExercises(5);
              setOpenDialog(false);
            }}
          >
            Hinzufügen
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= UPLOAD DIALOG ================= */}
      <Dialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
      >
        <DialogTitle>Lösungen hochladen</DialogTitle>
        <DialogContent>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUploadDialogOpen(false)}>Abbrechen</Button>
          <Button
            onClick={handleUpload}
            variant="contained"
            color="secondary"
          >
            Hochladen & Analysieren
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskSheets;
