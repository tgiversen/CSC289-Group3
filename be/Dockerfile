# ===== Backend Flask + Gunicorn =====

FROM python:3.10-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all backend code
COPY . .

# Expose Flask port
EXPOSE 5000

# Run Flask app using Gunicorn (production ready)
CMD ["gunicorn", "-b", "0.0.0.0:5000", "run:app"]
