import { Dialog, DialogTitle, DialogContent, Button, TextField, MenuItem } from "@mui/material";
import { editExercise, TaskSheetsStore } from "../data/DataStore";

const EditExerciseDialog = ({ open, onClose, exercise }) => {
  if (!exercise) return null;

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;

    editExercise(exercise.id, {
      taskSheetId: form.taskSheetId.value,
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Aufgabe zuordnen</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSave}>
          <TextField select fullWidth name="taskSheetId" defaultValue="">
            {TaskSheetsStore.map((ts) => (
              <MenuItem key={ts.id} value={ts.id}>{ts.name}</MenuItem>
            ))}
          </TextField>

          <Button type="submit" sx={{ mt: 2 }}>Speichern</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditExerciseDialog;

