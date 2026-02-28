import { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  MenuItem,
  Select,
  useTheme,
  Chip,
} from "@mui/material";
import { tokens } from "../../theme";

import Header from "../../components/Header";
import LineChart from "../../components/LineChart";
import StatBox from "../../components/StatBox";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import {
  ExercisesStore,
  TaskSheetsStore,
  TaskSheetType,
  ExerciseStatus,
  ExerciseTags,
  SolutionsStore,
  deleteExercise,
} from "../../data/DataStore";

import CheckIcon from "@mui/icons-material/Check";
import PersonIcon from "@mui/icons-material/Person";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  // Dropdown-State
  const [selectedTagA, setSelectedTagA] = useState(ExerciseTags.LOOPS);
  const [selectedTagK, setSelectedTagK] = useState(ExerciseTags.LOOPS); 

  const [allExercises, setAllExercises] = useState([]);

  useEffect(() => {
    setAllExercises(ExercisesStore);
  }, []);

  /* =============================
     STATUS
  ============================= */
  const sheetsA = TaskSheetsStore.filter((s) => s.type === TaskSheetType.AUFGABE);
  const sheetsK = TaskSheetsStore.filter((s) => s.type === TaskSheetType.KLAUSUR);

  const isSheetCompleted = (sheetId) => {
    const exercises = ExercisesStore.filter((e) => e.taskSheetId === sheetId);
    return (
      exercises.length > 0 &&
      exercises.every((e) => e.status === ExerciseStatus.COMPLETED)
    );
  };

  const completedSheetsA = sheetsA.filter((s) => isSheetCompleted(s.id)).length;
  const completedSheetsK = sheetsK.filter((s) => isSheetCompleted(s.id)).length;

  const uniqueStudents = new Set(SolutionsStore.map((s) => s.studentId)).size;

  /* =============================
     LINECHART – AUFGABEN (A)
  ============================= */
  const exercisesA = ExercisesStore.filter((e) => {
    const sheet = TaskSheetsStore.find((s) => s.id === e.taskSheetId);
    return sheet?.type === TaskSheetType.AUFGABE && e.mainTag === selectedTagA;
  });

  const lineDataA = [
    {
      id: "Syntaxfehler",
      data: exercisesA.map((e) => ({
        x: e.title,
        y: e.solutionIds.filter(
          (sid) => SolutionsStore.find((s) => s.id === sid && s.analysis?.Syntaxfehler)
        ).length,
      })),
      color: colors.blueAccent[500],
    },
    {
      id: "Logikfehler",
      data: exercisesA.map((e) => ({
        x: e.title,
        y: e.solutionIds.filter(
          (sid) => SolutionsStore.find((s) => s.id === sid && s.analysis?.Logikfehler)
        ).length,
      })),
      color: colors.redAccent[500],
    },
    {
      id: "Laufzeitfehler",
      data: exercisesA.map((e) => ({
        x: e.title,
        y: e.solutionIds.filter(
          (sid) => SolutionsStore.find((s) => s.id === sid && s.analysis?.LaufzeitFehler)
        ).length,
      })),
      color: colors.greenAccent[500],
    },
  ];

  /* =============================
     LINECHART – KLAUSUREN (K)
  ============================= */
  const exercisesK = ExercisesStore.filter((e) => {
    const sheet = TaskSheetsStore.find((s) => s.id === e.taskSheetId);
    return sheet?.type === TaskSheetType.KLAUSUR && e.mainTag === selectedTagK;;
  });

  const lineDataK = [
    {
      id: "Syntaxfehler",
      data: exercisesK.map((e) => ({
        x: e.title,
        y: e.solutionIds.filter(
          (sid) => SolutionsStore.find((s) => s.id === sid && s.analysis?.Syntaxfehler)
        ).length,
      })),
      color: colors.blueAccent[500],
    },
    {
      id: "Logikfehler",
      data: exercisesK.map((e) => ({
        x: e.title,
        y: e.solutionIds.filter(
          (sid) => SolutionsStore.find((s) => s.id === sid && s.analysis?.Logikfehler)
        ).length,
      })),
      color: colors.redAccent[500],
    },
    {
      id: "Laufzeitfehler",
      data: exercisesK.map((e) => ({
        x: e.title,
        y: e.solutionIds.filter(
          (sid) => SolutionsStore.find((s) => s.id === sid && s.analysis?.LaufzeitFehler)
        ).length,
      })),
      color: colors.greenAccent[500],
    },
  ];

  /* =============================
     DATA GRID – ALLE AUFGABEN
  ============================= */
  const getSheet = (id) => TaskSheetsStore.find((t) => t.id === id);

  const columns = [
    { field: "title", headerName: "Titel", flex: 1.5 },
    {
      field: "taskSheet",
      headerName: "Aufgabenblatt",
      flex: 1,
      valueGetter: (p) => getSheet(p.row.taskSheetId)?.title ?? "–",
    },
    {
      field: "type",
      headerName: "Typ",
      flex: 0.8,
      valueGetter: (p) => {
        const sheet = getSheet(p.row.taskSheetId);
        return sheet?.type === TaskSheetType.KLAUSUR ? "Klausur" : "Aufgabe";
      },
    },
    {
      field: "mainTag",
      headerName: "Haupttag",
      flex: 1,
      valueGetter: (p) => p.row.mainTag ?? "-",
    },
    {
      field: "tags",
      headerName: "Subtags",
      flex: 1.5,
      renderCell: (p) => (
        <>
          {p.row.subTags?.map((t) => (
            <Chip key={t} label={t} size="small" sx={{ ml: 0.5 }} />
          ))}
        </>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.8,
      renderCell: (p) => (
        <Chip
          label={p.row.status === ExerciseStatus.COMPLETED ? "Completed" : "Open"}
          color={p.row.status === ExerciseStatus.COMPLETED ? "success" : "warning"}
          size="small"
        />
      ),
    },
    {
      field: "open",
      headerName: "Lösungen",
      flex: 0.8,
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
      flex: 0.6,
      renderCell: (p) => (
        <Button
          color="error"
          size="small"
          onClick={() => {
            deleteExercise(p.row.id);
            setAllExercises((prev) => prev.filter((e) => e.id !== p.row.id));
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb="20px">
        <Header title="Dashboard" subtitle="Übersicht über Aufgaben und Fehleranalyse" />
      </Box>

      {/* GRID */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gridAutoRows="140px" gap="20px">
        {/* STATBOXEN */}
        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={`${completedSheetsA}/10`}
            subtitle="Aufgabenblätter"
            progress={completedSheetsA / 10}
            increase={`${Math.round((completedSheetsA / 10) * 100)}%`}
            icon={<CheckIcon sx={{ color: colors.greenAccent[600] }} />}
          />
        </Box>

        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={`${completedSheetsK}/2`}
            subtitle="Klausuren"
            progress={completedSheetsK / 2}
            increase={`${Math.round((completedSheetsK / 2) * 100)}%`}
            icon={<CheckIcon sx={{ color: colors.greenAccent[600] }} />}
          />
        </Box>

        <Box gridColumn="span 4" backgroundColor={colors.primary[400]} display="flex" alignItems="center" justifyContent="center">
          <StatBox
            title={uniqueStudents}
            subtitle="Studierende"
            progress={Math.min(uniqueStudents / 100, 1)}
            increase="+ aktiv"
            icon={<PersonIcon sx={{ color: colors.greenAccent[600] }} />}
          />
        </Box>

        {/* LINECHART AUFGABEN */}
        <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box display="flex" justifyContent="space-between" alignItems="center" p="20px">
            <Typography variant="h5">Fehleranalyse Aufgaben</Typography>
            <Select
              size="small"
              value={selectedTagA}
              onChange={(e) => setSelectedTagA(e.target.value)}
            >
              {Object.values(ExerciseTags).map((tag) => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box height="250px">
            <LineChart data={lineDataA} isDashboard />
          </Box>
        </Box>

        {/* LINECHART KLAUSUREN */}
        <Box gridColumn="span 6" gridRow="span 2" backgroundColor={colors.primary[400]}>
          <Box display="flex" justifyContent="space-between" alignItems="center" p="20px">
            <Typography variant="h5">Fehleranalyse Klausuren</Typography>
            <Select
              size="small"
              value={selectedTagK}
              onChange={(e) => setSelectedTagK(e.target.value)}
            >
              {Object.values(ExerciseTags).map((tag) => (
                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
              ))}
            </Select>
          </Box>
          <Box height="250px">
            <LineChart data={lineDataK} isDashboard />
          </Box>
        </Box>

        {/* DATA GRID ALLE AUFGABEN */}
        <Box gridColumn="span 12" gridRow="span 3" backgroundColor={colors.primary[400]} p="20px">
          <Box display="flex" justifyContent="space-between" alignItems="center" p="0px">
            <Typography variant="h5">Alle Aufgaben</Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/exercises")}>
              Zu Aufgaben
            </Button>
          </Box>
          
          <Box 
          height="400px"
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
              rows={allExercises}
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
      </Box>
    </Box>
  );
};

export default Dashboard;
