#our web app framework!

#you could also generate a skeleton from scratch via
#http://flask-appbuilder.readthedocs.io/en/latest/installation.html

#Generating HTML from within Python is not fun, and actually pretty cumbersome because you have to do the
#HTML escaping on your own to keep the application secure. Because of that Flask configures the Jinja2 template engine 
#for you automatically.
#requests are objects that flask handles (get set post, etc)
from flask import Flask, render_template,request, current_app, jsonify
import io
import model
import base64
#initalize our flask app
app = Flask(__name__)

@app.route('/')
def index():
	#initModel()
	#render out pre-built HTML file right on the index page
	return render_template("index.html")

@app.route('/predict/',methods=['POST'])
def predict():
	data = {}
	try:
		data = request.get_json()['data']
	except KeyError:
		return jsonify(status_code='400', msg='Bad Request'), 400

	data = base64.b64decode(data)
	image = io.BytesIO(data)
	predictions = model.predict(image)
	current_app.logger.info('Predictions: %s', predictions)
	return jsonify(predictions=predictions)
	

if __name__ == "__main__":
	app.run()
