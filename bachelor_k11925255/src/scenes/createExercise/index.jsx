import {
  Box,
  Button,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
//import UploadFileIcon from "@mui/icons-material/UploadFile";
import { Formik } from "formik";
import * as yup from "yup";
import Header from "../../components/Header";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  addExercise,
  TaskSheetsStore,
  addTaskSheet,
  TaskSheetType,
  ExerciseTags,
} from "../../data/DataStore";
import { useState } from "react";

const CreateExercise = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const [taskSheets, setTaskSheets] = useState(TaskSheetsStore);

  /* ================= EXERCISE HANDLER ================= */
  const handleExerciseSubmit = (values, { resetForm }) => {
    addExercise(values.taskSheetId, {
      title: values.title,
      description: values.description,
      mainTag: values.mainTag,
      subTags: values.subTags,
    });
    resetForm();
    alert("Aufgabe erfolgreich erstellt!");
  };

  /* ================= TASKSHEET HANDLER ================= */
  const handleTaskSheetSubmit = (values, { resetForm }) => {
  addTaskSheet(values.title, values.type, values.maxExercises);
  resetForm();
  setTaskSheets([...TaskSheetsStore]);
  alert("Aufgabenblatt erfolgreich erstellt!");
};

  return (
    <Box m="20px">
      <Header title="Aufgabe erstellen" subtitle="neue Aufgabe erstellen" />

      {/* ================= FORM EXERCISE ================= */}
      <Formik
        initialValues={exerciseInitialValues}
        validationSchema={exerciseSchema}
        onSubmit={handleExerciseSubmit}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                label="Titel"
                name="title"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.title}
                error={!!touched.title && !!errors.title}
                helperText={touched.title && errors.title}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                fullWidth
                variant="filled"
                label="Aufgbenstellung"
                name="description"
                multiline
                rows={4}
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.description}
                error={!!touched.description && !!errors.description}
                helperText={touched.description && errors.description}
                sx={{ gridColumn: "span 4" }}
              />

              <TextField
                select
                fullWidth
                variant="filled"
                label="Aufgabenblatt"
                name="taskSheetId"
                value={values.taskSheetId}
                onChange={handleChange}
                error={!!touched.taskSheetId && !!errors.taskSheetId}
                helperText={touched.taskSheetId && errors.taskSheetId}
                sx={{ gridColumn: "span 2" }}
              >
                {taskSheets.map((ts) => (
              <MenuItem
                key={ts.id}
                value={ts.id}
                disabled={ts.exerciseIds.length >= ts.maxExercises}
              >
                {ts.title} ({ts.type === TaskSheetType.KLAUSUR ? "Klausur" : "Aufgabe"})
                – {ts.exerciseIds.length}/{ts.maxExercises}
              </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                variant="filled"
                label="Haupttag"
                name="mainTag"
                value={values.mainTag}
                onChange={handleChange}
                error={!!touched.mainTag && !!errors.mainTag}
                helperText={touched.mainTag && errors.mainTag}
                sx={{ gridColumn: "span 1" }}
              >
                {Object.values(ExerciseTags).map((tag) => (
                  <MenuItem key={tag} value={tag}>
                    {tag}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                fullWidth
                variant="filled"
                label="Subtags"
                name="subTags"
                value={values.subTags}
                SelectProps={{ multiple: true }}
                onChange={handleChange}
                sx={{ gridColumn: "span 1" }}
              >
                {Object.values(ExerciseTags)
                  .filter((t) => t !== values.mainTag)
                  .map((tag) => (
                    <MenuItem key={tag} value={tag}>
                      <Checkbox checked={values.subTags.includes(tag)} />
                      <ListItemText primary={tag} />
                    </MenuItem>
                  ))}
              </TextField>
            </Box>

            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Aufgabe erstellen
              </Button>
            </Box>
          </form>
        )}
      </Formik>

      {/* ================= FORM TASKSHEET ================= */}
      <Box mt="60px">
        <Header
          title="Hausübung / Klausur erstellen"
          subtitle="neues Aufgabenblatt vom Typ Klausur oder Hausübung erstellen"
        />

        <Formik
          initialValues={taskSheetInitialValues}
          validationSchema={taskSheetSchema}
          onSubmit={handleTaskSheetSubmit}
        >
          {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Box
                display="grid"
                gap="30px"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  fullWidth
                  variant="filled"
                  label="Titel"
                  name="title"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.title}
                  error={!!touched.title && !!errors.title}
                  helperText={touched.title && errors.title}
                  sx={{ gridColumn: "span 2" }}
                />

                <TextField
                  select
                  fullWidth
                  variant="filled"
                  label="Typ"
                  name="type"
                  value={values.type}
                  onChange={handleChange}
                  sx={{ gridColumn: "span 1" }}
                >

                  <MenuItem value={TaskSheetType.AUFGABE}>Aufgabe</MenuItem>
                  <MenuItem value={TaskSheetType.KLAUSUR}>Klausur</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  variant="filled"
                  type="number"
                  label="Anzahl Aufgaben"
                  name="maxExercises"
                  value={values.maxExercises}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={!!touched.maxExercises && !!errors.maxExercises}
                  helperText={touched.maxExercises && errors.maxExercises}
                  sx={{ gridColumn: "span 1" }}
                />
              </Box>

              <Box display="flex" justifyContent="end" mt="20px">
                <Button type="submit" color="secondary" variant="contained">
                  Aufgabenblatt erstellen
                </Button>
              </Box>
            </form>
          )}
        </Formik>
      </Box>
    </Box>
  );
};

/* ================= VALIDATION ================= */
const exerciseSchema = yup.object({
  title: yup.string().required("Titel ist erforderlich"),
  description: yup.string().required("Beschreibung ist erforderlich"),
  taskSheetId: yup.string().required("Aufgabenblatt auswählen"),
  mainTag: yup.string().required("Haupttag auswählen"),
});

const taskSheetSchema = yup.object({
  title: yup.string().required("Titel ist erforderlich"),
  maxExercises: yup
    .number()
    .required("Anzahl erforderlich")
    .min(1, "Mindestens 1 Aufgabe")
    .max(35, "Maximal 35 Aufgaben"),
});

/* ================= INITIAL VALUES ================= */
const exerciseInitialValues = {
  title: "",
  description: "",
  taskSheetId: "",
  mainTag: "",
  subTags: [],
};

const taskSheetInitialValues = {
  title: "",
  type: TaskSheetType.AUFGABE,
  maxExercises: 5, // 👈 Default
};

export default CreateExercise;
