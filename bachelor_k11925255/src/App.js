import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Exercises from "./scenes/exercises";
import CreateExercise from "./scenes/createExercise";
import TaskSheets from "./scenes/taskSheets";
import Line from "./scenes/line";
import Solutions from "./scenes/solutions";
import ExerciseSolutions from "./scenes/solutions";
import Students from "./scenes/students";
import StudentSolutions from "./scenes/students/studentSolution";




function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            {/* <Topbar setIsSidebar={setIsSidebar} /> */}
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/createExercise" element={<CreateExercise />} />
              <Route path="/taskSheets" element={<TaskSheets />} />              
              <Route path="/line" element={<Line />} />
              <Route path="/exercises" element={<Solutions />} />
              <Route path="/students" element={<Students />} />
              <Route path="/exercises/:exerciseId/solutions" element={<ExerciseSolutions />} />
              <Route path="/students/:studentId/solutions" element={<StudentSolutions />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
