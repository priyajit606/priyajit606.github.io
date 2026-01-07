async function getAnswer() {
  const fileInput = document.getElementById("img");
  const result = document.getElementById("result");

  if (!fileInput.files.length) {
    alert("Please upload an image");
    return;
  }

  result.innerText = "Reading question from image...";

  try {
    // OCR
    const ocr = await Tesseract.recognize(
      fileInput.files[0],
      "eng"
    );

    const question = ocr.data.text.trim();

    if (question.length < 5) {
      result.innerText = "Question not clear. Try better image.";
      return;
    }

    result.innerText = "Finding answer...";

    const API_KEY = "PASTE_YOUR_GEMINI_API_KEY_HERE";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: "Answer this question clearly:\n\n" + question
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    if (data.error) {
      result.innerText = "AI Error: " + data.error.message;
      return;
    }

    const answer =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!answer) {
      result.innerText = "Answer not found. Try another question.";
      return;
    }

    result.innerText = "Answer:\n\n" + answer;

  } catch (err) {
    console.error(err);
    result.innerText = "Something went wrong. Try again.";
  }
}
