from flask import Flask, request, jsonify, render_template, session, redirect, url_for
import requests
from flask_cors import CORS
import sqlite3
import uuid
from datetime import datetime
from flask_socketio import SocketIO, emit, join_room, leave_room, close_room
from functools import wraps
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")
socketio = SocketIO(app, cors_allowed_origins=os.getenv("CORS_ORIGINS").split(","))
CORS(app, origins=os.getenv("CORS_ORIGINS").split(","), supports_credentials=True)

SPRING_BOOT_URL = os.getenv("SPRING_BOOT_URL")

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        jwt_data = session.get("jwt_data")
        if not jwt_data:
            return redirect(url_for('home'))
        return f(*args, **kwargs)
    return decorated_function

def get_db():
    conn = sqlite3.connect("database.db", check_same_thread=False)
    conn.row_factory = sqlite3.Row
    return conn

# Create tables if they don't exist
def init_db():
    conn = get_db()
    cur = conn.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS rooms (
            room_id TEXT PRIMARY KEY
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS room_participants (
            room_id TEXT,
            participant TEXT,
            FOREIGN KEY (room_id) REFERENCES rooms (room_id)
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            room_id TEXT,
            sender TEXT,
            message TEXT,
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (room_id) REFERENCES rooms (room_id)
        )
    ''')
    conn.commit()
    conn.close()

# Initialize database tables
init_db()

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/create_room", methods=["POST"])
@login_required
def create_room():
    headers = {"Authorization": f"Bearer {session['jwt_data']}"}
    response = requests.get(f"{SPRING_BOOT_URL}/api/user/profile", headers=headers)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to get user profile"}), 401
        
    display_name = request.json.get("display_name")
    if not display_name:
        return jsonify({"error": "Display name is required"}), 400
        
    room_id = str(uuid.uuid4())[:8]  # Generate unique room ID
    
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO rooms (room_id) VALUES (?)", (room_id,))
        cur.execute("INSERT INTO room_participants (room_id, participant) VALUES (?, ?)", 
                   (room_id, display_name))
        conn.commit()
        return jsonify({"status": True, "room_id": room_id})
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/join_room/<room_id>", methods=["POST"])
@login_required
def join_room_http(room_id):
    headers = {"Authorization": f"Bearer {session['jwt_data']}"}
    response = requests.get(f"{SPRING_BOOT_URL}/api/user/profile", headers=headers)
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to get user profile"}), 401
        
    display_name = request.json.get("display_name")
    if not display_name:
        return jsonify({"error": "Display name is required"}), 400
    
    conn = get_db()
    cur = conn.cursor()
    try:
        # First check if room exists
        cur.execute("SELECT * FROM rooms WHERE room_id = ?", (room_id,))
        room = cur.fetchone()
        
        # If room doesn't exist, create it (similar to chat_room route)
        if not room:
            cur.execute("INSERT INTO rooms (room_id) VALUES (?)", (room_id,))
            conn.commit()
            
        # Add participant
        cur.execute("INSERT INTO room_participants (room_id, participant) VALUES (?, ?)",
                   (room_id, display_name))
        conn.commit()
        return jsonify({"status": True})
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@app.route("/room/<room_id>")
@login_required
def chat_room(room_id):
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # First check if room exists
        cur.execute("SELECT * FROM rooms WHERE room_id = ?", (room_id,))
        room = cur.fetchone()
        
        if not room:
            # If room doesn't exist, create it
            cur.execute("INSERT INTO rooms (room_id) VALUES (?)", (room_id,))
            conn.commit()
            room = {"room_id": room_id}
            
        cur.execute("""
            SELECT messages.*, room_participants.participant 
            FROM messages 
            LEFT JOIN room_participants ON messages.sender = room_participants.participant 
            WHERE messages.room_id = ? 
            ORDER BY messages.sent_at
        """, (room_id,))
        messages = cur.fetchall()
        
        cur.execute("SELECT participant FROM room_participants WHERE room_id = ?", (room_id,))
        participants = cur.fetchall()
        
        return render_template("chat_room.html", room=room, messages=messages, participants=participants)
    except sqlite3.Error as e:
        return jsonify({"error": str(e)}), 500
    finally:
        conn.close()

@socketio.on('join')
def on_join(data):
    if not session.get("jwt_data"):
        emit('error', {'msg': 'You must be logged in to join a room'})
        return
    room = data['room']
    username = data['username']
    join_room(room)
    emit('status', {'msg': username + ' has entered the room.'}, room=room)

@socketio.on('leave')
def on_leave(data):
    if not session.get("jwt_data"):
        emit('error', {'msg': 'You must be logged in to leave a room'})
        return
    room = data['room']
    username = data['username']
    leave_room(room)
    emit('status', {'msg': username + ' has left the room.'}, room=room)

@socketio.on('message')
def handle_message(data):
    if not session.get("jwt_data"):
        emit('error', {'msg': 'You must be logged in to send messages'})
        return
    room = data['room']
    message = data['message']
    username = data['username']
    
    conn = get_db()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO messages (room_id, sender, message) VALUES (?, ?, ?)",
                   (room, username, message))
        conn.commit()
        emit('message', {'username': username, 'message': message}, room=room)
    except sqlite3.Error as e:
        emit('error', {'error': str(e)})
    finally:
        conn.close()

@app.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        user_data = {
            "email": request.form["email"],
            "password": request.form["password"],
            "fullName": request.form["fullName"],
            "role": request.form["role"]
        }
        response = requests.post(f"{SPRING_BOOT_URL}/auth/signup", json=user_data)
        response_data = response.json()

        if response_data.get("status"):
            return redirect(url_for('signin'))
        else:
            if "Email is already used with another account" in str(response_data):
                return "Email is already used with another account"
            return jsonify(response_data), 400

    return render_template("signup.html")

@app.route("/signin", methods=["GET", "POST"])
def signin():
    if request.method == "POST":
        login_data = request.get_json()
        email = login_data.get("email")
        password = login_data.get("password")

        response = requests.post(f"{SPRING_BOOT_URL}/auth/signin", json=login_data)
        response_data = response.json()

        if response_data.get("status"):
            session["jwt_data"] = response_data.get("jwt")
            return jsonify({"status": True, "jwt": response_data.get("jwt"), "redirect": url_for('home')}), 200
        else:
            return jsonify(response_data), 400

    return render_template("signin.html")

@app.route("/receive_jwt", methods=["POST"])
def receive_jwt():
    jwt_data = request.json.get("jwt")
    session["jwt_data"] = jwt_data
    return jsonify({"message": "JWT received successfully!"})

@app.route("/logout")
def logout():
    session.pop("jwt_data", None)
    return redirect(url_for("home"))

@app.route("/profile", methods=["GET"])
@login_required
def profile():
    headers = {
        "Authorization": f"Bearer {session['jwt_data']}"
    }
    
    try:
        response = requests.get(f"{SPRING_BOOT_URL}/api/user/profile", headers=headers)
        
        if response.status_code == 200:
            user_profile = response.json()
            filtered_profile = {
                "email": user_profile.get("email"),
                "fullName": user_profile.get("fullName"),
                "role": user_profile.get("role")
            }
            return render_template("profile.html", jwt_data=filtered_profile)
        else:
            return jsonify({"error": "Failed to fetch profile", "status_code": response.status_code}), response.status_code
            
    except requests.exceptions.RequestException as e:
        return jsonify({"error": "Failed to connect to server", "details": str(e)}), 500

if __name__ == "__main__":
    socketio.run(app, debug=True, port=int(os.getenv("PORT", 5000)))
