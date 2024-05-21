function handleUpload() {
  const uploadBtn = document.getElementById('uploadBtn');
  const fileName = document.getElementById('fileName');
  const fileContent = document.getElementById('fileContent');
  
  uploadBtn.addEventListener('change', function () {
    const selectedFile = this.files[0];

    // Basic file validation
    if (!selectedFile || !selectedFile.type.match('text/plain')) {
      alert('TOLONG MASUKKAN FILE YANG VALID!!!');
      return;
    }

    fileName.textContent = selectedFile.name;

    const reader = new FileReader();

    reader.onload = function (e) {
      fileContent.value = e.target.result;
      
    };
    reader.readAsText(selectedFile);
    
  });
  const form = document.getElementById('submit'); // Assuming this is your form element ID

  form.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default form submission
    const keywordInput = document.getElementById('keyword').value.trim();
    const algoritma = document.querySelector('input[name="algorithm"]:checked').value;
    console.log(algoritma)
    if (!keywordInput || !algoritma){
      alert('MASUKKAN DATA SESUAI DENGAN YANG DIMINTA !!!!');
      return false
    }
    newsExtractor(fileContent.value ,keywordInput,algoritma);
  });

}
handleUpload();


function newsExtractor(fileContent, keywordInput, method) {
  var startTime = performance.now();
  var waktu = 0;
  console.log(fileContent)
  var isiBerita = '';

  if (method === "bf") {
    const { idx, count } = bruteForce(fileContent, keywordInput);
    isiBerita = NEBF(fileContent, keywordInput);
    var endTime = performance.now();
    waktu = endTime - startTime;
    showResults(keywordInput, fileContent.length, count, isiBerita, waktu);
  } else if (method === "kmp") {
    const { idx, count } = KMPSearch(fileContent, keywordInput);
    isiBerita = NEKMP(fileContent, keywordInput);
    var endTime = performance.now();
    waktu = endTime - startTime;
    showResults(keywordInput, fileContent.length, count, isiBerita, waktu);
  }
}

function showResults(keywordInput, contentLength, count, isiBerita, waktu) {
  const resultContainer = document.getElementById('result-container');
  const inputInfo = document.getElementById('input-info');
  const outputInfo = document.getElementById('output-info');

  inputInfo.innerHTML = `
    <h2>Informasi Input</h2>
    <table>
      <tr>
        <th>Kata kunci</th>
        <td>: ${keywordInput}</td>
      </tr>
      <tr>
        <th>Banyak karakter</th>
        <td>: ${contentLength}</td>
      </tr>
      <tr>
        <th>Banyak pencocokan</th>
        <td>: ${count}</td>
      </tr>
    </table>
  `;

  if (isiBerita === '') {
    outputInfo.innerHTML = `
      <h2>Informasi Output</h2>
      <img src='/img/sadface.png' alt='Kata kunci tidak ditemukan' class ='imgpop'>
      <p>Maaf, kata kunci <b>${keywordInput}</b> tidak ditemukan dalam berita</p>
      <p>Kode dieksekusi selama <b>${waktu} milisekon</b></p>
    `;
  } else {
    outputInfo.innerHTML = `
      <h2>Informasi Output</h2>
      <img src='/img/happy.png' alt='Kata kunci ditemukan' class ='imgpop'>
      <p><b>Isi berita yang diekstrak:</b></p> 
      <p>${isiBerita}</p>
      <p><b>Waktu eksekusi program:</b></p> 
      <p>Kode dieksekusi selama <b>${waktu} milisekon</b></p>
    `;
  }


  const resultModal = document.getElementById('result-modal');
  resultModal.style.display = "block";

  const closeModal = document.querySelector('.close');
  closeModal.onclick = function() {
      resultModal.style.display = "none";
  }

  window.onclick = function(event) {
      if (event.target === resultModal) {
          resultModal.style.display = "none";
      }
  }
}

function prosesKalimat(text) {
  const words = text.toLowerCase().trim();
  
  return words;
}
  

  function KMPSearch(text, pattern) {
    // Preprocess the text (optional, depending on `prosesKalimat` logic)
    text = prosesKalimat(text)
    const M = pattern.length;
    const N = text.length;
  
    // Create lps array to store longest proper prefix which is also a suffix
    const lps = new Array(M).fill(0);
  
    // Preprocess the pattern (calculate lps[] array)
    computeLPSArray(pattern, M, lps);
  
    let count = 0; // Count of pattern occurrences
    let idx = -1;  // Starting index of the first occurrence
  
    let i = 0; // index for txt[]
    let j = 0; // index for pat[]
    while (i < N) {
      if (pattern[j] === text[i]) {
        count++;
        i++;
        j++;
      }
  
      if (j === M) {
        // Found a match
        idx = i - j; // Starting index
        return { idx, count }; // Return both index and count
      }
  
      // Mismatch after j matches
      if (i < N && pattern[j] !== text[i]) {
        count++;
        // Do not match lps[0..lps[j-1]] characters,
        // they will match anyway
        if (j !== 0) {
          j = lps[j - 1];
        } else {
          i++; // If j is 0, advance only i
        }
      }
    }
  
    return { idx: -1, count}; // No match found
  }
  
  function computeLPSArray(pattern, M, lps) {
    let len = 0; // length of the previous longest prefix suffix
  
    lps[0] = 0; // lps[0] is always 0
  
    let i = 1;
    while (i < M) {
      if (pattern[i] === pattern[len]) {
        len++;
        lps[i] = len;
        i++;
      } else {
        // This is tricky. Consider the example "ABABDABACDABABCABAB"
        // for better understanding of the following if-else
        if (len !== 0) {
          len = lps[len - 1];
        } else {
          lps[i] = 0;
          i++;
        }
      }
    }
  }

  function bruteForce(textInput, patternInput) {
    // Preprocess the text (optional, depending on `prosesKalimat` logic)
    textInput = prosesKalimat(textInput)
    // Assuming `prosesKalimat` handles text cleaning
  
    const sLen = textInput.length;
    const pLen = patternInput.length;
    let i = 0;
    let found = false;
    let count = 0; // Count of comparisons
  
    for (i = 0; i <= sLen - pLen; i++) {
      count++; // Increment for outer loop comparison
      let j = 0
      for (j = 0; j < pLen; j++) {
        count++; // Increment for inner loop comparison
        if (textInput[i + j] !== patternInput[j]) {
          break;
        }
      }
      if (j == pLen) { // Reached end of pattern, pattern found
        found = true;
        break;
      }
    }
    if (!found) {
      return { i: -1, count }; // Return -1 for index and keep comparison count
    } else {
      return { i, count }; // Return original data if pattern found
    }
  }

  
  function NEKMP(text, pattern) {
    // Find the index of the pattern using KMP
    const { idx: foundIndex } = KMPSearch(text, pattern);  
    // If pattern is found, extract the sentence
    if (foundIndex !== -1) {
      let startIndex = foundIndex;
      let endIndex = foundIndex + pattern.length;
  
      // Find the previous period or punctuation
      while (startIndex > 0 && text[startIndex - 1] !== '.') {
        startIndex--;
      }
  
      // Find the period or punctuation after the pattern
      while (endIndex < text.length && text[endIndex] !== '.') {
        endIndex++;
      }
  
      // Extract and return the sentence
      return text.substring(startIndex, endIndex);
    } else {
      // Pattern not found, return empty string
      return "";
    }
  }
  
  // Function to find sentences containing a pattern using brute force
  function NEBF(text, pattern) {
    // Find the index of the pattern using brute force
    const {i : foundIndex} = bruteForce(text, pattern);

    // If pattern is found, extract the sentence
    if (foundIndex !== -1) {
      let startIndex = foundIndex;
      let endIndex = foundIndex + pattern.length;
  
      // Find the previous period or punctuation
      while (startIndex > 0 && text[startIndex - 1] !== '.') {
        startIndex--;
      }
  
      // Find the period or punctuation after the pattern
      while (endIndex < text.length && text[endIndex] !== '.') {
        endIndex++;
      }
  
      // Extract and return the sentence
      return text.substring(startIndex, endIndex);
    } else {
      // Pattern not found, return empty string
      return "";
    }
  }


  
  