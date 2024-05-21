function handleUpload() {
  const uploadBtn = document.getElementById('uploadBtn');
  const fileName = document.getElementById('fileName');
  const fileContent = document.getElementById('fileContent');
  
  uploadBtn.addEventListener('change', function () {
    const selectedFile = this.files[0];

    //Melakukan validasi file (kalau bukan file txt maka ditolak)
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
  const form = document.getElementById('submit'); 

  form.addEventListener('click', (event) => {
    event.preventDefault(); 
    const keywordInput = document.getElementById('keyword').value.trim();
    const algoritma = document.querySelector('input[name="algorithm"]:checked').value; //
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
  /*
  Fungsi untuk menampilkan hasil, setelah menekan tombol "Submit", sehingga akan menampilkan
  informasi innput dan informasi output
  */ 
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
  
  //Jika pola tidak ditemukan
  if (isiBerita === '') {
    outputInfo.innerHTML = `
      <h2>Informasi Output</h2>
      <img src='/img/sadface.png' alt='Kata kunci tidak ditemukan' class ='imgpop'>
      <p>Maaf, kata kunci <b>${keywordInput}</b> tidak ditemukan dalam berita</p>
      <p>Kode dieksekusi selama <b>${waktu} milisekon</b></p>
    `;
  
    //Jika pola ditemukan
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
  /*Fungsi prosesKalimat, digunakan untuk melakukan preprocessing pada data
  dengan cara mengubah semua string menjadi huruf kecil
  */
  const words = text.toLowerCase().trim();
  
  return words;
}
  

  function KMPSearch(text, pattern) {
    // Melakukan preprocessing kalimat (mengubah kalimat menjadi huruf kecil)
    text = prosesKalimat(text)
    const M = pattern.length;
    const N = text.length;
  
    // Buatlah sebuah array kosong dengan ukuran yang sama dengan string input. 
    //Array ini akan menyimpan nilai LPS untuk setiap karakter dalam string input.
    const lps = new Array(M).fill(0);
  
    // Preproses polanya (calculate lps[] array)
    computeLPSArray(pattern, M, lps);
  
    let count = 0; // Counter untuk menghitung pola
    let idx = -1;  // idx diinisialisasi -1
  
    let i = 0; // index untuk text
    let j = 0; // index untuk pattern[]
    while (i < N) {
      if (pattern[j] === text[i]) {
        count++;
        i++;
        j++;
      }
  
      if (j === M) {
        // Mencari pola
        idx = i - j; // Start index
        return { idx, count }; // Mengembalikan index dan count
      }
  
      // Mismatch setelah dilakukan j pencocokan 
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
  
    return { idx: -1, count}; // data tidak ditemukan
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
    // Melakukan preprocessing kalimat (mengubah kalimat menjadi huruf kecil)
    textInput = prosesKalimat(textInput)
  
    //Menginisialisasi nilai panjang text dan panjang pattern
    const sLen = textInput.length;
    const pLen = patternInput.length;
    let i = 0;
    let found = false;
    let count = 0; // Menghitung berapa banyak pencocokan yang dilakukan
  
    for (i = 0; i <= sLen - pLen; i++) {
      count++; // Increment untuk outer loop
      let j = 0
      for (j = 0; j < pLen; j++) {
        count++; // Increment untuk inner loop 
        if (textInput[i + j] !== patternInput[j]) {
          break;
        }
      }
      if (j == pLen) { // Sampai akhir dari pattern, found true
        found = true;
        break;
      }
    }
    if (!found) {
      return { i: -1, count }; // Return -1 dan count jika pattern tidak ditemukan
    } else {
      return { i, count }; // Return index pola ditemukan dan banyak pencocokan
    }
  }

  
  function NEKMP(text, pattern) {
    //Mencari index menggunakan NEKMP
    const { idx: foundIndex } = KMPSearch(text, pattern);  
    // Jika pattern ditemukan, pola diekstrak
    if (foundIndex !== -1) {
      let startIndex = foundIndex;
      let endIndex = foundIndex + pattern.length;
  
      // Cari tanda titik sebelum pola
      while (startIndex > 0 && text[startIndex - 1] !== '.') {
        startIndex--;
      }
  
      // Cari tanda titik setelah pola
      while (endIndex < text.length && text[endIndex] !== '.') {
        endIndex++;
      }
  
      // Kembalikan string hasil ekstraksi pola
      return text.substring(startIndex, endIndex);
    } else {
      // Kembalikan string kosong jika pola tidak ditemukan
      return "";
    }
  }
  
  function NEBF(text, pattern) {
    // Cari indeks dari pola menggunakan brute force
    const {i : foundIndex} = bruteForce(text, pattern);

    // Jika pattern ditemukan, lakukan ekstraksi pola
    if (foundIndex !== -1) {
      let startIndex = foundIndex;
      let endIndex = foundIndex + pattern.length;
  
      // Cari tanda titik sebelum pola
      while (startIndex > 0 && text[startIndex - 1] !== '.') {
        startIndex--;
      }
  
      // Cari tanda titik setelah pola
      while (endIndex < text.length && text[endIndex] !== '.') {
        endIndex++;
      }
  
      // Kembalikan string hasil ekstraksi pola
      return text.substring(startIndex, endIndex);
    } else {
      // Kembalikan string kosong jika pola tidak ditemukan
      return "";
    }
  }


  
  