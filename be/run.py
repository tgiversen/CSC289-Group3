from app import create_app,db
from flask_migrate import Migrate

app = create_app()
migrate = Migrate(app, db)

if __name__ == "__main__":
    app.run(debug=True)

# debug conveniently locally, you can manually open the browser to access it in the command line:
# open http://127.0.0.1:5000   # macOS
# start http://127.0.0.1:5000  # Windows
