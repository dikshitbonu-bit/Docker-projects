from flask import Flask, render_template, request, redirect, url_for
import mysql.connector
import os
import time

app = Flask(__name__)

# Database configuration from environment variables
db_config = {
    'host': os.getenv('MYSQL_HOST', 'localhost'),
    'user': os.getenv('MYSQL_USER', 'root'),
    'password': os.getenv('MYSQL_PASSWORD', ''),
    'database': os.getenv('MYSQL_DB', 'todo_db')
}

def get_db_connection():
    """Create database connection with retry logic"""
    max_retries = 5
    retry_delay = 5
    
    for attempt in range(max_retries):
        try:
            connection = mysql.connector.connect(**db_config)
            return connection
        except mysql.connector.Error as err:
            if attempt < max_retries - 1:
                print(f"Database connection failed (attempt {attempt + 1}/{max_retries}): {err}")
                print(f"Retrying in {retry_delay} seconds...")
                time.sleep(retry_delay)
            else:
                print(f"Failed to connect to database after {max_retries} attempts")
                raise

def init_db():
    """Initialize database and create table if it doesn't exist"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS tasks (
                id INT AUTO_INCREMENT PRIMARY KEY,
                task VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        connection.commit()
        cursor.close()
        connection.close()
        print("Database initialized successfully!")
    except Exception as e:
        print(f"Error initializing database: {e}")

@app.route('/')
def index():
    """Home page - display all tasks"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)
        cursor.execute('SELECT * FROM tasks ORDER BY created_at DESC')
        tasks = cursor.fetchall()
        cursor.close()
        connection.close()
        return render_template('index.html', tasks=tasks)
    except Exception as e:
        return f"Error loading tasks: {e}", 500

@app.route('/add', methods=['POST'])
def add_task():
    """Add a new task"""
    task = request.form.get('task')
    
    if task:
        try:
            connection = get_db_connection()
            cursor = connection.cursor()
            cursor.execute('INSERT INTO tasks (task) VALUES (%s)', (task,))
            connection.commit()
            cursor.close()
            connection.close()
        except Exception as e:
            return f"Error adding task: {e}", 500
    
    return redirect(url_for('index'))

@app.route('/delete/<int:task_id>')
def delete_task(task_id):
    """Delete a task"""
    try:
        connection = get_db_connection()
        cursor = connection.cursor()
        cursor.execute('DELETE FROM tasks WHERE id = %s', (task_id,))
        connection.commit()
        cursor.close()
        connection.close()
    except Exception as e:
        return f"Error deleting task: {e}", 500
    
    return redirect(url_for('index'))

if __name__ == '__main__':
    print("Starting Flask application...")
    print(f"Connecting to MySQL at {db_config['host']}")
    
    # Initialize database on startup
    init_db()
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5000, debug=True)
