from flask import Flask, render_template, request
from algorithm import *

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == 'POST':
        inputFiles = request.form.getlist("filename")
        keyword = request.form['keyword']
        algorithm = request.form['algorithm']
        # Iterate through each uploaded file
        newsExtractor(inputFiles, keyword, algorithm)
        return render_template("index.html", algoritma=algorithm,folder=inputFiles, pola=keyword,panjang=algorithm.text_length,jumlah=algorithm.count,kalimat=algorithm.isiBerita, runningTime = algorithm.waktu)

    else:
        return render_template("index.html",algoritma="",folder="", pola="",panjang="",jumlah="",kalimat="",runningTime="")

if __name__ == '__main__':
    app.config['STATIC_FOLDER'] = 'static'
    app.run(debug=True)

