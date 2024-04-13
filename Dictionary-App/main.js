import "./style.css";

const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
const result = document.getElementById("result");
const sound = document.getElementById("sound");
const btn = document.getElementById("search-btn");

// Define playSound function in the global scope
window.playSound = function () {
  if (sound.src) {
    sound.play();
  }
};

btn.addEventListener("click", () => {
  let inpWord = document.getElementById("inp-word").value;
  // console.log(inpWord);
  fetch(`${url}${inpWord}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      let example =
        data[0]?.meanings[0]?.definitions[0]?.example ||
        data[0]?.meanings[1]?.definitions[0]?.example ||
        data[0]?.meanings[0]?.definitions[1]?.example ||
        data[0]?.meanings[2]?.definitions[1]?.example;

      // If example is still undefined, assign an empty string
      example = example || "";
      result.innerHTML = `<div class="word flex justify-between mt-8 text-gray-600">
                          <h3 class="font-extrabold">${inpWord}</h3>
    <button onclick="playSound()">
      <i class="fa-solid fa-volume-high"></i>
    </button>
  </div>

  <div class="details flex text-gray-400 font-mono">
    <p>${data[0].meanings[0].partOfSpeech} &nbsp; </p>
    <p>${data[0].phonetics[1].text || data[0].phonetic}</p>
  </div>

  <p class="word-meaning my-1.5 text-gray-800">
    ${data[0].meanings[0].definitions[0].definition}
  </p>
  <p
    class="word-example text-gray-600 border-l-4 py-0.5 bg-purple-100 px-3 border-purple-600"
  >
    ${example}
  </p>`;

      const soundAudio =
        data[0].phonetics[0]?.audio ||
        data[0].phonetics[1].audio ||
        data[0].phonetics[2].audio;
      // console.log(soundAudio);
      // Check if the response contains an audio source
      if (soundAudio) {
        sound.setAttribute("src", soundAudio);
      } else {
        // Clear the audio element's source if no audio source is available
        sound.removeAttribute("src");
        // Display a message to the user
        alert("Audio is not available for this word.");
      }
    })

    // Handle fetch errors
    .catch((error) => {
      console.error("Error fetching data:", error);
      // Display a message to the user
      result.innerHTML = `<span class="font-bold text-red-600 p-3">Error fetching data. Please check for spell.</span>`;
    });
});
