#our web app framework!

#you could also generate a skeleton from scratch via
#http://flask-appbuilder.readthedocs.io/en/latest/installation.html

#Generating HTML from within Python is not fun, and actually pretty cumbersome because you have to do the
#HTML escaping on your own to keep the application secure. Because of that Flask configures the Jinja2 template engine 
#for you automatically.
#requests are objects that flask handles (get set post, etc)
from flask import Flask, render_template,request, current_app, jsonify
import io
import base64
import re
import keras
from keras.preprocessing import image
from keras.applications.inception_v3 import preprocess_input, decode_predictions
import numpy as np
import tensorflow as tf

model = keras.applications.inception_v3.InceptionV3(include_top=True, weights='imagenet', input_tensor=None, input_shape=None)
graph = tf.get_default_graph()


def mypredict(image_file):
    img = image.load_img(image_file)
    x = image.img_to_array(img)
    x = np.expand_dims(x,axis=0)
    x = preprocess_input(x)

    global graph
    with graph.as_default():
        preds = model.predict(x)

    top3 = decode_predictions(preds,top=3)[0]

    predictions = [{'label': label, 'description': description, 'probability': probability * 100.0}
                    for label,description, probability in top3]
    return predictions

#initalize our flask app
app = Flask(__name__)

@app.route('/')
def index():
	#initModel()
	#render out pre-built HTML file right on the index page
	return render_template("index.html")

@app.route('/predict/',methods=['GET','POST'])
def predict():
	data = {}
	try:
		data = request.get_data()
		imgstr = re.search(r'base64,(.*)',data).group(1)
		data = imgstr
	except KeyError:
		return jsonify(status_code='400', msg='Bad Request'), 400

	data = base64.b64decode(data)
	image = io.BytesIO(data)
	predictions = mypredict(image)
	current_app.logger.info('Predictions: %s', predictions)
	return jsonify(predictions=predictions)

if __name__ == "__main__":
	app.run()
