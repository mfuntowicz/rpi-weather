from flask import Flask, render_template
from flask_graphql import GraphQLView
from weather import schema

app = Flask(__name__)


app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view('graphql', schema=schema, graphiql=True)
)


@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(port=8080, debug=True)