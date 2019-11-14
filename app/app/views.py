from app import app
from flask import render_template
from flask import request, redirect
import os
from app import scorePatients

app.config["FILE_UPLOADS"] = "app/patient_data"
app.config["ALLOWED_IMAGE_EXTENSIONS"] = ["JSON"]
app.config["MAX_IMAGE_FILESIZE"] = 0.5 * 1024 * 1024
app.config["FILENAME"] = "patients.json"


def allowed_image(filename):

    if not "." in filename:
        return False

    ext = filename.rsplit(".", 1)[1]

    if ext.upper() in app.config["ALLOWED_IMAGE_EXTENSIONS"]:
        return True
    else:
        return False


def allowed_image_filesize(filesize):

    if int(filesize) <= app.config["MAX_IMAGE_FILESIZE"]:
        return True
    else:
        return False


@app.route("/")
def index():
    return render_template("upload_file.html")


@app.route("/upload", methods=["GET", "POST"])
def upload_file():
    print(request.method)
    if (request.method == "POST"):
        print("request_method")
        if (request.files):
            print("request.files")

            file = request.files["file"]

            if (file.filename == ""):
                print("No filename")
                return redirect(request.url)

            if (allowed_image(file.filename)):
                print("allowed")

                file.save(os.path.join(
                    app.config["FILE_UPLOADS"], app.config["FILENAME"]))

                print("File saved")

                return redirect(request.url)

            else:
                print("That file extension is not allowed")
                return redirect(request.url)
    return render_template("upload_file.html")

def isFloat(s):
    try:
        float(s)
        return True
    except ValueError:
        return False

@app.route("/get_patients", methods=["GET", "POST"])
def sign_up():
    if request.method == "POST":
        req = request.form 
        lat = req.get("latitude")
        lon = req.get("longitude")
        if isFloat(lat) and float(lat) <= 90 and float(lat) >= -90 and isFloat(lon) and float(lon) <= 90 and float(lon) >= -90:
            return render_template("upload_file.html", your_list=scorePatients.run(lat, lon))
        return render_template("upload_file.html", error_info="invalid location")