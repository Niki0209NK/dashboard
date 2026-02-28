// analyzeService.js
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "token hier einfügen",
  dangerouslyAllowBrowser: true,
});

export const analyzeSolution = async (task, solution) => {
  console.log("Analyzing solution with OpenAI..."+ task + " / " + solution);
  const prompt = `
Analysiere den folgenden Python-Code auf Fehler.

Zähle die Fehler nach diesen Regeln:

- Syntaxfehler:
  Echte Python-Syntaxprobleme, die verhindern, dass der Code ausgeführt wird.

- Laufzeitfehler:
  Fehler, die während der Ausführung auftreten würden,
  UNTER DER ANNAHME, dass alle Syntaxfehler zuvor korrekt behoben wurden
  (z. B. Division durch Null, IndexError, TypeError).

- Logikfehler:
  Fehlerhafte Berechnungen oder Programmabläufe, die zu falschen Ergebnissen führen,
  auch wenn der Code ohne Exception läuft.

Zähle jeden Fehler unabhängig von den anderen Kategorien.

Ignoriere Formatierungsprobleme (z. B. mehrere Statements pro Zeile, fehlende Semikolons).

**Aufgabenstellung:** ${task}

**Studentenlösung:** ${solution}

Gib die Antwort ausschließlich als JSON aus:
{
  "Syntaxfehler": number,
  "Logikfehler": number,
  "Laufzeitfehler": number
}
`;

  const response = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    temperature: 0,
    messages: [{ role: "user", content: prompt }],
  });

  // ✅ Hier die Antwort korrekt extrahieren
  const content = response.choices[0].message.content;

  // Nur das erste JSON-Objekt parsen, falls die KI Text davor/ danach schreibt
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Keine JSON-Antwort erhalten von OpenAI");

  return JSON.parse(jsonMatch[0]);
};
