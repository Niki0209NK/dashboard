import { analyzeSolution } from "../services/openaiAnalysis.js";

const STORAGE_KEY = "task_app_store";

/* ================= ENUMS ================= */

export const TaskSheetType = {
  AUFGABE: "A",
  KLAUSUR: "K",
};

export const ExerciseTags = Object.freeze({
  DATATYPES: "Datentypen",
  LOOPS: "Schleifen",
  CONDITIONALS: "Conditionals",
  FUNCTIONS: "Funktionen",
  COLLECTIONS: "Collections",
  PANDAS: "Pandas",
  EXCEPTIONS: "Exceptions",
  FILES: "Dateien",
  VISUALIZATIONS: "Visualisierungen",
});

export const ExerciseStatus = {
  OPEN: "OPEN",
  COMPLETED: "COMPLETED",
};

/* ================= STORES ================= */

export let TaskSheetsStore = [];
export let ExercisesStore = [];
export let StudentsStore = [];
export let SolutionsStore = [];

/* ================= STORAGE ================= */

export const loadAll = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return false;

  const parsed = JSON.parse(raw);

  TaskSheetsStore = (parsed.taskSheets || []).map((t) => ({
    exerciseIds: [],
    solutionsUploaded: false,
    maxExercises: t.maxExercises ?? 5, // 👈 Fallback
  ...t,
  }));

  ExercisesStore = (parsed.exercises || []).map((e) => ({
    solutionIds: [],
    status: ExerciseStatus.OPEN,
    ...e,
  }));

  StudentsStore = parsed.students || [];
  SolutionsStore = parsed.solutions || [];

  return true;
};

const saveAll = () => {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      taskSheets: TaskSheetsStore,
      exercises: ExercisesStore,
      students: StudentsStore,
      solutions: SolutionsStore,
    })
  );
};

/* ================= TASKSHEETS ================= */

export const addTaskSheet = (name, type, maxExercises) => {
  const sheet = {
    id: `TS_${Date.now()}`,
    title: name,
    type,
    maxExercises,          // 👈 NEU
    exerciseIds: [],
    solutionsUploaded: false,
  };

  TaskSheetsStore = [...TaskSheetsStore, sheet];
  saveAll();
  return sheet.id;
};


export const deleteTaskSheet = (id) => {
  TaskSheetsStore = TaskSheetsStore.filter((t) => t.id !== id);
  ExercisesStore = ExercisesStore.filter((e) => e.taskSheetId !== id);
  SolutionsStore = SolutionsStore.filter((s) => s.taskSheetId !== id);
  saveAll();
};

/* ================= EXERCISES ================= */

export const addExercise = (taskSheetId, data) => {
 const sheet = TaskSheetsStore.find((t) => t.id === taskSheetId);
  if (!sheet || sheet.exerciseIds.length >= sheet.maxExercises) return;

  const exercise = {
    id: `EX_${Date.now()}`,
    taskSheetId,
    title: data.title,
    description: data.description,
    mainTag: data.mainTag,
    subTags: data.subTags || [],
    status: ExerciseStatus.OPEN,
    solutionIds: [],
  };

  ExercisesStore = [...ExercisesStore, exercise];
  sheet.exerciseIds = [...sheet.exerciseIds, exercise.id];

  saveAll();
};

export const deleteExercise = (id) => {
  ExercisesStore = ExercisesStore.filter((e) => e.id !== id);
  SolutionsStore = SolutionsStore.filter((s) => s.exerciseId !== id);

  TaskSheetsStore = TaskSheetsStore.map((t) => ({
    ...t,
    exerciseIds: t.exerciseIds.filter((eid) => eid !== id),
  }));

  saveAll();
};

/* ================= SOLUTIONS UPLOAD ================= */

export const uploadSolutionsJSON = async (taskSheetId, json) => {
  const sheet = TaskSheetsStore.find((t) => t.id === taskSheetId);
  if (!sheet || sheet.exerciseIds.length !== sheet.maxExercises) return;
  for (const entry of json[0]) {
    /* ---------- STUDENT ---------- */
    let student = StudentsStore.find(
      (s) => s.id === entry["id-nummer"]
    );

    if (!student) {
      student = {
        id: entry["id-nummer"],
        vorname: entry.vorname,
        nachname: entry.nachname,
        email: entry["e-mail-adresse"],
      };
      StudentsStore = [...StudentsStore, student];
    }

    /* ---------- SOLUTIONS ---------- */
    for (let i = 0; i < sheet.exerciseIds.length; i++) {
      const exId = sheet.exerciseIds[i];
      const exercise = ExercisesStore.find((e) => e.id === exId);

      const analysis = await analyzeSolution(
        exercise.description,
        entry[`antwort${i + 1}`]
      );

      const solution = {
        id: `SOL_${Date.now()}_${Math.random()}`,
        taskSheetId,
        exerciseId: exId,
        studentId: student.id,
        answer: entry[`antwort${i + 1}`],
        analysis,
      };

      SolutionsStore = [...SolutionsStore, solution];
      exercise.solutionIds = [...exercise.solutionIds, solution.id];
      exercise.status = ExerciseStatus.COMPLETED;
    }
  }

  sheet.solutionsUploaded = true;
  saveAll();
};

/* ================= LEGACY ================= */

export const addSolution = () => {
  console.warn("addSolution ist veraltet – bitte JSON-Upload verwenden");
};
