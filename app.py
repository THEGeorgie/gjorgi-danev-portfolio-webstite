from flask import Flask, request
from flask import render_template


app = Flask(__name__)

@app.route("/")
def default():
    return render_template("index.html")

@app.route("/landing")
def landing():

    la = request.args.get('landing')
    print(la)

    return render_template("landing.html")

@app.route("/about")
def about():
    return render_template("about.html")

@app.route("/projects")
def projects():
    return render_template("projects.html")

@app.route("/contact")
def contact():
    return render_template("contact.html")
