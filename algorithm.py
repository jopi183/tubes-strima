
import re
import timeit
from nltk.tokenize import sent_tokenize
import os

def prosesKalimat(text):
    words = re.sub(r'[^\w\s.]', '', text).lower().strip()
    return words

# Python program for KMP Algorithm
def KMPSearch(text, pattern):
    text = prosesKalimat(text)
    M = len(pattern)
    N = len(text)

    # create lps[] that will hold the longest prefix suffix
    # values for pattern
    lps = [0] * M
    j = 0  # index for pat[]

    # Preprocess the pattern (calculate lps[] array)
    computeLPSArray(pattern, M, lps)
    count = 0
    idx = -1
    i = 0  # index for txt[]
    while i < N:
        if pattern[j] == text[i]:
            count += 1
            i += 1
            j += 1
        if j == M:
            count += 1
            idx = i - j
            return idx, count
        # mismatch after j matches
        elif i < N and pattern[j] != text[i]:
            count += 1
            # Do not match lps[0..lps[j-1]] characters,
            # they will match anyway
            if j != 0:
                j = lps[j - 1]
            else:
                i += 1
    return idx, count

# Preprocess the pattern (calculate lps[] array)
def computeLPSArray(pattern, M, lps):
    len = 0 # length of the previous longest prefix suffix
 
    lps[0] # lps[0] is always 0
    i = 1
 
    # the loop calculates lps[i] for i = 1 to M-1
    while i < M:
        if pattern[i]== pattern[len]:
            len += 1
            lps[i] = len
            i += 1
        else:
            # This is tricky. Consider the example.
            # AAACAAAA and i = 7. The idea is similar 
            # to search step.
            if len != 0:
                len = lps[len-1]
 
                # Also, note that we do not increment i here
            else:
                lps[i] = 0
                i += 1
# This code is contributed by Bhavya Jain

def bruteForce(textInput, patternInput):
    textInput = prosesKalimat(textInput)
    s_len = len(textInput)
    p_len = len(patternInput)
    found = False
    count = 0
    i = 0
    for i in range(s_len - p_len + 1):
        count+=1
        j = 0
        for j in range(p_len):
            count+=1
            if textInput[i + j] != patternInput[j]:
                break
        if j == p_len - 1:      # If we have reached end of pattern, we have found the pattern in string
            found = True
            break
    return i,count

def NEKMP(text, pattern):
    # Temukan kalimat yang mengandung pola menggunakan KMP
    found_index,_ = KMPSearch(text, pattern)

    # Jika pola ditemukan, ekstrak kalimatnya
    if found_index != -1:
        start_index = found_index
        end_index = found_index + len(pattern)
        while start_index > 0 and not (text[start_index-1] == '.'):
            start_index -= 1
    # Temukan titik atau tanda baca setelah pola
        while end_index < len(text) and not (text[end_index] == '.'):
            end_index += 1
        # Ekstrak dan kembalikan kalimat
        return text[start_index:end_index]
    else:
        # Pola tidak ditemukan, kembalikan string kosong
        return ""
    	
def NEBF(text, pattern):
    # Temukan kalimat yang mengandung pola menggunakan KMP
    found_index,_ = bruteForce(text, pattern)
    print("found Index = ",found_index)
    # Jika pola ditemukan, ekstrak kalimatnya
    if found_index != -1:
        start_index = found_index
        end_index = found_index + len(pattern)
        while start_index > 0 and not (text[start_index-1] == '.'):
            start_index -= 1
    # Temukan titik atau tanda baca setelah pola
        while end_index < len(text) and not (text[end_index] == '.'):
            end_index += 1
        # Ekstrak dan kembalikan kalimat
        return text[start_index:end_index]
    else:
        # Pola tidak ditemukan, kembalikan string kosong
        return ""

def dekomposisiBerita(source):


    with open(source) as f:
        text = f.read()
    kalimatBerita = []

    sentences = sent_tokenize(text)
    for i in range (1, len(sentences)):
      kalimatBerita.append(sentences[i])

    return kalimatBerita
   
def newsExtractor(text,pattern,method):
    global text_length
    global count
    global isiBerita
    global idx
    global waktu
    text_length = []
    count = []
    kalimatBerita = []
    isiBerita = []
    idx = []
    waktu = []
    for berita in text:
        kalimatBerita = dekomposisiBerita("berita/"+berita)
    newsBody = ""

  # Gabungkan kalimat berita menjadi satu string
    for kalimat in kalimatBerita:
        newsBody += kalimat + " "

  # Hapus whitespace di awal dan akhir
    newsBody = newsBody.strip()

    start = timeit.default_timer()
    text_length.append(len(newsBody))
    if method == "bf":
        isiBerita = NEBF(newsBody,pattern)
        idx,count = bruteForce(newsBody,pattern)
    elif method == "kmp":
        isiBerita = NEKMP(newsBody,pattern)
        idx,count = KMPSearch(newsBody,pattern)
    stop = timeit.default_timer()
    waktu = stop-start
     
