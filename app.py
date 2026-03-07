from flask import Flask, render_template, request, redirect, session, url_for, flash, jsonify
import sqlite3
import datetime
import re


app = Flask(__name__)
app.secret_key = 'healthcare_secret_key'

def get_db_connection():
    conn = sqlite3.connect('Healthcare.db')
    conn.row_factory = sqlite3.Row
    return conn

# --- HOME & AUTH SECTION ---

@app.route('/')
def index():
    return render_template('home.html')

@app.route('/login_page')
def login_page():
    return render_template('login.html')

@app.route('/register', methods=['POST'])
def register():
    full_name = request.form.get('full_name')
    email = request.form.get('email')
    password = request.form.get('password')
    phone = request.form.get('phone')
    city = request.form.get('city')
    role = 'patient' 

    conn = get_db_connection()
    try:
        conn.execute('''
            INSERT INTO users (full_name, email, password_hash, role, city, phone) 
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (full_name, email, password, role, city, phone))
        conn.commit()
        conn.close()
        return '''
            <script>
                alert("Registration Successful! Please Login.");
                window.location.href = "/login_page";
            </script>
        '''
    except sqlite3.IntegrityError:
        conn.close()
        return "Email already exists! Please use another email."

@app.route('/login', methods=['POST'])
def login():
    email = request.form.get('username') or request.form.get('email')
    password = request.form.get('password')
    
    conn = get_db_connection()
    user = conn.execute('SELECT * FROM users WHERE email = ? AND password_hash = ?',
                        (email, password)).fetchone()
    conn.close()
    
    if user:
        session['user_id'] = user['id']
        session['role'] = user['role']
        session['full_name'] = user['full_name']
        
        if user['role'] == 'admin':
            return redirect(url_for('admin_dashboard'))
        elif user['role'] == 'patient':
            return redirect(url_for('patient_dashboard'))
        elif user['role'] == 'doctor':
            return redirect(url_for('doctor_dashboard'))
    else:
        return "<script>alert('Login Failed! Check email/password.'); window.history.back();</script>"

# --- ADMIN SECTION ---

@app.route('/admin')
def admin_dashboard():
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        
        user_count = conn.execute('SELECT COUNT(*) FROM users WHERE role = "patient"').fetchone()[0]
        doctor_count = conn.execute('SELECT COUNT(*) FROM users WHERE role = "doctor"').fetchone()[0]
        appt_count = conn.execute("SELECT COUNT(*) FROM appointments WHERE status != 'cancelled'").fetchone()[0]
        pending_count = conn.execute("SELECT COUNT(*) FROM appointments WHERE status = 'booked'").fetchone()[0]
        completed_count = conn.execute("SELECT COUNT(*) FROM appointments WHERE status = 'completed'").fetchone()[0]
        emergency_count = conn.execute("SELECT COUNT(*) FROM appointments WHERE status = 'emergency'").fetchone()[0]
        
        recent_activities = conn.execute('''
            SELECT u_p.full_name AS patient_name, u_p.email AS patient_email, 
                   u_p.phone AS patient_phone, a.booking_time, a.status,
                   u_d.full_name AS doctor_name
            FROM appointments a 
            JOIN users u_p ON a.user_id = u_p.id
            JOIN users u_d ON a.doctor_id = u_d.id
            WHERE a.status != 'cancelled'
            ORDER BY a.booking_time DESC LIMIT 10
        ''').fetchall()

        raw_doctors = conn.execute('SELECT id, full_name, status FROM users WHERE role = "doctor"').fetchall()
        doctors_status_list = []

        for doc in raw_doctors:
            active_booking = conn.execute('''
                SELECT COUNT(*) FROM appointments 
                WHERE doctor_id = ? AND status = "booked"
            ''', (doc['id'],)).fetchone()[0]

            current_status = "In Room" if active_booking > 0 else doc['status']
            doctors_status_list.append({
                'full_name': doc['full_name'],
                'status': current_status
            })
        
        conn.close()
        return render_template('admin.html', 
                               user_count=user_count, 
                               appt_count=appt_count, 
                               doctor_count=doctor_count,
                               emergency_count=emergency_count, 
                               activities=recent_activities,
                               pending=pending_count,
                               completed=completed_count,
                               doctors_list=doctors_status_list)

    return redirect(url_for('login_page'))

@app.route('/admin/doctors')
def manage_doctors():
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        doctors = conn.execute('SELECT id, full_name, email, city, phone, specialty FROM users WHERE role = "doctor"').fetchall()
        conn.close()
        return render_template('admin_doctors.html', doctors=doctors)
    return redirect(url_for('login_page'))

@app.route('/admin/add_doctor', methods=['POST'])
def add_doctor():
    if 'role' in session and session['role'] == 'admin':
        full_name = request.form.get('full_name')
        email = request.form.get('email')
        password = request.form.get('password')
        phone = request.form.get('phone')
        city = request.form.get('city')
        specialty = request.form.get('specialty')
        role = 'doctor' 

        conn = get_db_connection()
        try:
            conn.execute('''
                INSERT INTO users (full_name, email, password_hash, role, city, phone, specialty) 
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (full_name, email, password, role, city, phone, specialty))
            conn.commit()
        except sqlite3.IntegrityError:
            return "Error: Email already exists!"
        finally:
            conn.close()
        return redirect(url_for('manage_doctors'))
    return redirect(url_for('login_page'))

@app.route('/admin/delete_doctor/<int:id>')
def delete_doctor(id):
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        conn.execute('DELETE FROM users WHERE id = ? AND role = "doctor"', (id,))
        conn.execute('DELETE FROM doctors WHERE id = ?', (id,))
        conn.commit()
        conn.close()
        return redirect(url_for('manage_doctors'))
    return redirect(url_for('login_page'))

@app.route('/admin/patients')
def manage_patients():
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        patients = conn.execute('SELECT id, full_name, email, city, phone FROM users WHERE role = "patient"').fetchall()
        conn.close()
        return render_template('admin_patients.html', patients=patients)
    return redirect(url_for('login_page'))

@app.route('/admin/delete_patient/<int:id>')
def delete_patient(id):
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        conn.execute('DELETE FROM users WHERE id = ? AND role = "patient"', (id,))
        conn.execute('DELETE FROM appointments WHERE user_id = ?', (id,))
        conn.commit()
        conn.close()
        return redirect(url_for('manage_patients'))
    return redirect(url_for('login_page'))

@app.route('/admin/appointments')
def manage_appointments():
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        query = '''
            SELECT a.id, a.booking_time, a.status, 
                   u1.full_name as patient_name, 
                   u2.full_name as doctor_name
            FROM appointments a
            JOIN users u1 ON a.user_id = u1.id
            JOIN users u2 ON a.doctor_id = u2.id
            ORDER BY a.booking_time ASC
        '''
        appointments = conn.execute(query).fetchall()
        conn.close()
        return render_template('admin_appointments.html', appointments=appointments)
    return redirect(url_for('login_page'))

# --- DOCTOR SECTION ---

@app.route('/doctor')
def doctor_dashboard():
    if 'role' in session and session['role'] == 'doctor':
        doctor_id = session['user_id']
        conn = get_db_connection()

        # ၁။ "ယနေ့စုစုပေါင်း" ရက်ချိန်းအရေအတွက် (ယနေ့ရက်စွဲနဲ့ပဲ စစ်သည်)
        total_today = conn.execute('''
            SELECT COUNT(*) FROM appointments 
            WHERE doctor_id = ? AND date(booking_time) = date('now', 'localtime')
        ''', (doctor_id,)).fetchone()[0]

        # ၂။ "ကြည့်ရှုပြီးလူနာ" (ယနေ့အတွက်ပဲ ကြည့်ပြီးသူကို ရေတွက်သည်)
        # ဒီနေရာမှာ ကျွန်တော်ပေးထားတဲ့ code အသစ်ကို ထည့်ရမှာပါ
        completed_count = conn.execute('''
            SELECT COUNT(*) FROM appointments 
            WHERE doctor_id = ? AND status = 'completed' AND date(booking_time) = date('now', 'localtime')
        ''', (doctor_id,)).fetchone()[0]

        # ၃။ "စောင့်ဆိုင်းဆဲလူနာ" (ယနေ့အတွက်ပဲ စောင့်ဆိုင်းနေသူကို ရေတွက်သည်)
        pending_count = conn.execute('''
            SELECT COUNT(*) FROM appointments 
            WHERE doctor_id = ? AND status = 'booked' AND date(booking_time) = date('now', 'localtime')
        ''', (doctor_id,)).fetchone()[0]
        
        # ၄။ Dashboard ဇယားမှာပြဖို့အတွက် လူနာစာရင်းဆွဲထုတ်ခြင်း
        appointments = conn.execute('''
            SELECT u.full_name as patient_name, a.booking_time, a.status, a.id 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.doctor_id = ? AND date(a.booking_time) = date('now', 'localtime')
            ORDER BY a.booking_time ASC LIMIT 5
        ''', (doctor_id,)).fetchall()
        
        conn.close()
        return render_template('doctor.html', total=total_today, completed=completed_count, pending=pending_count, appointments=appointments)
    
    return redirect(url_for('login_page'))

# ယနေ့ စုစုပေါင်း ရက်ချိန်းများ ကြည့်ရန်
@app.route('/doctor/appointments')
def doctor_appointments():
    if 'role' in session and session['role'] == 'doctor':
        doctor_id = session['user_id']
        conn = get_db_connection()
        # ယနေ့ ရက်စွဲနဲ့ ကိုက်ညီတဲ့ ရက်ချိန်းအားလုံးကို ယူမယ်
        appointments = conn.execute('''
            SELECT u.full_name as patient_name, a.booking_time, a.status, a.id 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.doctor_id = ? AND date(a.booking_time) = date('now')
            ORDER BY a.booking_time ASC
        ''', (doctor_id,)).fetchall()
        conn.close()
        return render_template('doctor_appointments.html', appointments=appointments, title="ယနေ့ ရက်ချိန်းများ")
    return redirect(url_for('login_page'))

# စောင့်ဆိုင်းဆဲ လူနာများ ကြည့်ရန်
@app.route('/doctor/pending')
def pending_patients():
    if 'role' in session and session['role'] == 'doctor':
        doctor_id = session['user_id']
        conn = get_db_connection()
        # Status 'booked' ဖြစ်နေတဲ့ လူနာတွေကိုပဲ ယူမယ်
        appointments = conn.execute('''
            SELECT u.full_name as patient_name, a.booking_time, a.status, a.id 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.doctor_id = ? AND a.status = 'booked'
            ORDER BY a.booking_time ASC
        ''', (doctor_id,)).fetchall()
        conn.close()
        return render_template('pending_patients.html', appointments=appointments, title="စောင့်ဆိုင်းဆဲလူနာများ")
    return redirect(url_for('login_page'))

# ကြည့်ရှုပြီး လူနာများ ကြည့်ရန်
@app.route('/doctor/completed')
def completed_patients():
    if 'role' in session and session['role'] == 'doctor':
        doctor_id = session['user_id']
        conn = get_db_connection()
        
        # 'completed' ဖြစ်ပြီး 'ယနေ့' ရက်စွဲနဲ့ ကိုက်ညီသူများကိုသာ ဆွဲထုတ်ရန်
        # date(booking_time) = date('now', 'localtime') ကို ထည့်ရပါမည်
        query = '''
            SELECT u.full_name as patient_name, a.booking_time, a.status, a.id 
            FROM appointments a 
            JOIN users u ON a.user_id = u.id 
            WHERE a.doctor_id = ? AND a.status = 'completed' 
            AND date(a.booking_time) = date('now', 'localtime')
            ORDER BY a.booking_time DESC
        '''
        completed_list = conn.execute(query, (doctor_id,)).fetchall()
        conn.close()
        
        return render_template('completed_patients.html', patients=completed_list)
    return redirect(url_for('login_page'))

@app.route('/move_to_emergency/<int:appt_id>')
def move_to_emergency(appt_id):
    if 'role' in session and session['role'] == 'doctor':
        conn = get_db_connection()
        conn.row_factory = sqlite3.Row
        appt = conn.execute('SELECT * FROM appointments WHERE id = ?', (appt_id,)).fetchone()
        
        if appt:
            conn.execute('''
                INSERT INTO emergencies (patient_id, doctor_id, assigned_time)
                VALUES (?, ?, datetime('now', 'localtime'))
            ''', (appt['user_id'], appt['doctor_id']))
            conn.execute('UPDATE appointments SET status = "emergency" WHERE id = ?', (appt_id,))
            conn.commit()
            
        conn.close()
        return redirect(url_for('doctor_dashboard'))
    return redirect(url_for('login_page'))

@app.route('/admin/emergency_list')
def admin_emergency_list():
    if 'role' in session and session['role'] == 'admin':
        conn = get_db_connection()
        # status 'emergency' ဖြစ်နေတဲ့ လူနာတွေကိုပဲ ဆွဲထုတ်ပါမယ်
        query = '''
            SELECT a.id, u_p.full_name as patient_name, u_p.phone, a.booking_time, 
                   u_d.full_name as doctor_name
            FROM appointments a
            JOIN users u_p ON a.user_id = u_p.id
            JOIN users u_d ON a.doctor_id = u_d.id
            WHERE a.status = 'emergency'
            ORDER BY a.booking_time DESC
        '''
        emergencies = conn.execute(query).fetchall()
        conn.close()
        return render_template('admin_emergency_list.html', emergencies=emergencies)
    return redirect(url_for('login_page'))

@app.route('/doctor/my_patients')
def doctor_my_patients():
    if 'role' in session and session['role'] == 'doctor':
        doctor_id = session['user_id']
        conn = get_db_connection()
        
        # ၁။ ရက်ကျော်နေသော (ယနေ့မတိုင်မီက) Booking များကို အလိုအလျောက် Cancel လုပ်ပေးခြင်း
        # ဤနေရာတွင် logic ထည့်မှသာ စာရင်းကြည့်သည့်အခါ မနေ့ကလူနာများ 'cancelled' ဖြစ်သွားမည်
        conn.execute('''
            UPDATE appointments 
            SET status = 'cancelled' 
            WHERE status = 'booked' AND date(booking_time) < date('now', 'localtime')
        ''')
        conn.commit()

        # ၂။ လူနာစာရင်းကို ဆွဲထုတ်ခြင်း (Status ကိုပါ ဇယားတွင် မြင်ရစေရန်)
        query = '''
            SELECT u.id as patient_id, u.full_name as patient_name, u.phone, u.email,
                   a.booking_time, a.status, a.id as appointment_id
            FROM users u
            JOIN appointments a ON u.id = a.user_id
            WHERE a.doctor_id = ?
            ORDER BY a.booking_time DESC
        '''
        patients = conn.execute(query, (doctor_id,)).fetchall()
        conn.close()
        
        return render_template('doctor_patients.html', patients=patients)
    
    return redirect(url_for('login_page'))

@app.route('/complete_appointment/<int:id>', methods=['POST'])
def complete_appointment(id):
    if 'role' in session and session['role'] == 'doctor':
        diagnosis = request.form.get('diagnosis')
        treatment = request.form.get('treatment')
        recommendation = request.form.get('recommendation')
        
        conn = get_db_connection()
        conn.execute('UPDATE appointments SET status = "completed" WHERE id = ?', (id,))
        appt = conn.execute('SELECT user_id, doctor_id FROM appointments WHERE id = ?', (id,)).fetchone()
        
        if appt:
            patient_id = appt['user_id']
            doctor_id = appt['doctor_id']
            summary_text = f"Diagnosis: {diagnosis}\nTreatment: {treatment}"
            final_rec = recommendation if recommendation else "Consultation Completed"
            
            conn.execute('''
                INSERT INTO medical_records (patient_id, doctor_id, summary, recommendation, date_created)
                VALUES (?, ?, ?, ?, datetime('now'))
            ''', (patient_id, doctor_id, summary_text, final_rec))
        
        conn.commit()
        conn.close()
        flash("ဆေးမှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ။", "success")
        return redirect(url_for('doctor_dashboard'))
    return redirect(url_for('login_page'))

@app.route('/doctor/view_records/<int:patient_id>')
def view_patient_records(patient_id):
    if 'role' in session and session['role'] == 'doctor':
        conn = get_db_connection()
        # လူနာအမည်ကို အရင်ယူမယ်
        patient = conn.execute('SELECT full_name FROM users WHERE id = ?', (patient_id,)).fetchone()
        
        # ဆေးမှတ်တမ်းဟောင်းများကို ယူမယ်
        records = conn.execute('''
            SELECT mr.summary, mr.recommendation, mr.date_created, u_doc.full_name as doctor_name
            FROM medical_records mr
            JOIN users u_doc ON mr.doctor_id = u_doc.id
            WHERE mr.patient_id = ?
            ORDER BY mr.date_created DESC
        ''', (patient_id,)).fetchall()
        
        conn.close()
        return render_template('view_records.html', records=records, patient=patient)
    return redirect(url_for('login_page'))

@app.route('/doctor/manage_schedule', methods=['GET', 'POST'])
def manage_schedule():
    if 'role' in session and session['role'] == 'doctor':
        doctor_id = session['user_id']
        conn = get_db_connection()
        
        if request.method == 'POST':
            specialty = request.form['specialty']
            selected_days = request.form.getlist('available_days')
            days = ", ".join(selected_days)
            time = request.form['time']
            fee = request.form['fee']
            remaining = request.form['remaining']
            
            existing = conn.execute('SELECT id FROM doctors WHERE id = ?', (doctor_id,)).fetchone()
            if existing:
                conn.execute('''UPDATE doctors SET specialty=?, days=?, time=?, fee=?, remaining=? 
                              WHERE id=?''', (specialty, days, time, fee, remaining, doctor_id))
            else:
                conn.execute('''INSERT INTO doctors (id, specialty, days, time, fee, remaining, full_name) 
                              VALUES (?, ?, ?, ?, ?, ?, ?)''', 
                           (doctor_id, specialty, days, time, fee, remaining, session['full_name']))
            conn.commit()
            return redirect(url_for('doctor_dashboard'))

        schedule = conn.execute('SELECT * FROM doctors WHERE id = ?', (doctor_id,)).fetchone()
        conn.close()
        return render_template('manage_schedule.html', schedule=schedule)
    return redirect(url_for('login_page'))

@app.route('/add_medical_record', methods=['POST'])
def add_medical_record():
    if 'user_id' not in session or session.get('role') != 'doctor':
        return redirect(url_for('login'))

    summary = request.form.get('summary') 
    recommendation = request.form.get('recommendation') 
    patient_id = request.form.get('patient_id')
    doctor_id = session['user_id']
    
    conn = get_db_connection()
    conn.execute('''
        INSERT INTO medical_records (patient_id, doctor_id, summary, recommendation, date_created)
        VALUES (?, ?, ?, ?, datetime('now'))
    ''', (patient_id, doctor_id, summary, recommendation))
    
    conn.commit()
    conn.close()
    flash('ဆေးမှတ်တမ်း သိမ်းဆည်းပြီးပါပြီ။', 'success')
    return redirect(url_for('doctor_dashboard'))

# --- PATIENT SECTION ---

@app.route('/patient')
def patient_dashboard():
    if 'role' in session and session['role'] == 'patient':
        user_id = session['user_id']
        conn = get_db_connection()

        conn.execute('''
            UPDATE appointments 
            SET status = 'expired' 
            WHERE date(booking_time) < date('now') 
            AND status = 'booked'
        ''')
        
        doctors_db = conn.execute('''
            SELECT u.id, u.full_name, ds.specialty, 
                   ds.remaining as total_slots,
                   ds.fee, ds.days, ds.time as time_range
            FROM users u
            JOIN doctors ds ON u.id = ds.id
            WHERE u.role = "doctor"
        ''').fetchall()
        
        doctor_list = []
        today_date = datetime.date.today().strftime('%Y-%m-%d')
        for doc in doctors_db:
            booked_today = conn.execute('SELECT COUNT(*) FROM appointments WHERE doctor_id = ? AND date(booking_time) = ?', (doc['id'], today_date)).fetchone()[0]
            doctor_list.append({
                'id': doc['id'], 'full_name': doc['full_name'], 'specialty': doc['specialty'],
                'fee': doc['fee'], 'days': doc['days'], 'time': doc['time_range'],
                'remaining': (doc['total_slots'] or 25) - booked_today
            })

        all_appts = conn.execute('''
            SELECT a.id, a.doctor_id, a.booking_time, u.full_name AS doctor_name 
            FROM appointments a 
            JOIN users u ON a.doctor_id = u.id 
            WHERE a.user_id = ? 
            AND a.status = 'booked'
            AND date(a.booking_time) = date('now') -- ဒီနေ့ ရက်ချိန်းပဲ ပြရန်
            ORDER BY a.booking_time ASC
        ''', (user_id,)).fetchall()

        queues = [] 
        for appt in all_appts:
            my_index = conn.execute('''
                SELECT COUNT(*) FROM appointments 
                WHERE doctor_id = ? AND date(booking_time) = date(?) AND id <= ?
            ''', (appt['doctor_id'], appt['booking_time'], appt['id'])).fetchone()[0]

            completed_count = conn.execute('''
                SELECT COUNT(*) FROM appointments 
                WHERE doctor_id = ? AND date(booking_time) = date(?) AND status = 'completed'
            ''', (appt['doctor_id'], appt['booking_time'])).fetchone()[0]

            ahead = my_index - completed_count - 1
            queues.append({
                'id': appt['id'],
                'doctor_name': appt['doctor_name'],
                'my_index': my_index,
                'ahead': max(0, ahead),
                'booking_time': appt['booking_time']
            })

        recent_appointments = conn.execute('''
            SELECT u.full_name as doctor_name, a.booking_time, a.status 
            FROM appointments a 
            JOIN users u ON a.doctor_id = u.id 
            WHERE a.user_id = ? 
            ORDER BY a.id DESC
        ''', (user_id,)).fetchall()

        medical_records = conn.execute('''
            SELECT mr.summary, mr.recommendation, strftime('%Y-%m-%d', mr.date_created) as date_created, u.full_name as doctor_name
            FROM medical_records mr
            LEFT JOIN users u ON mr.doctor_id = u.id
            WHERE mr.patient_id = ?
            ORDER BY mr.date_created DESC
        ''', (user_id,)).fetchall()
            
        conn.close()
        return render_template('patient.html', 
                               doctors=doctor_list, 
                               queues=queues, 
                               appointments=recent_appointments,
                               medical_records=medical_records)
    
    return redirect(url_for('login_page'))

@app.route('/get_ai_doctors/<dept>')
def get_ai_doctors(dept):
    conn = get_db_connection()
    query = '''
        SELECT u.full_name, ds.specialty, ds.fee, ds.time, u.id
        FROM users u JOIN doctors ds ON u.id = ds.id
        WHERE ds.specialty LIKE ?
    '''
    doctors = conn.execute(query, ('%' + dept + '%',)).fetchall()
    conn.close()
    return jsonify([dict(doc) for doc in doctors])

@app.route('/get_slots/<int:doc_id>/<date>')
def get_slots(doc_id, date):
    try:
        conn = get_db_connection()
        selected_date = datetime.datetime.strptime(date, '%Y-%m-%d')
        day_short = selected_date.strftime('%a')
        
        doctor = conn.execute('SELECT days, remaining FROM doctors WHERE id = ?', (doc_id,)).fetchone()
        
        if not doctor:
            conn.close()
            return {"status": "off", "message": "ဆရာဝန် အချက်အလက် ရှာမတွေ့ပါ"}

        if day_short.lower() not in doctor['days'].lower():
            conn.close()
            full_day = selected_date.strftime('%A') 
            return {"status": "off", "message": f"ဆရာဝန်သည် {full_day} နေ့တွင် မထိုင်ပါ။"}

        booked_count = conn.execute('''
            SELECT COUNT(*) FROM appointments 
            WHERE doctor_id = ? AND date(booking_time) = date(?) AND status != "cancelled"
        ''', (doc_id, date)).fetchone()[0]
        
        remaining = doctor['remaining'] - booked_count
        conn.close()
        return {"status": "on", "remaining": max(0, remaining)}
    except Exception as e:
        return {"status": "error", "message": str(e)}, 500

@app.route('/cancel_appointment/<int:id>')
def cancel_appointment(id):
    if 'role' in session and session['role'] == 'patient':
        user_id = session['user_id']
        conn = get_db_connection()
        conn.execute('DELETE FROM appointments WHERE id = ? AND user_id = ? AND status = "booked"', (id, user_id))
        conn.commit()
        conn.close()
        flash("ရက်ချိန်းကို အောင်မြင်စွာ ဖျက်သိမ်းပြီးပါပြီ။", "info")
        return redirect(url_for('patient_dashboard'))
    return redirect(url_for('login_page'))

@app.route('/book_appointment', methods=['POST'])
def book_appointment():
    if 'role' in session and session['role'] == 'patient':
        doctor_id = request.form.get('doctor_id')
        booking_date = request.form.get('booking_time') # ဥပမာ - "2026-02-09"
        user_id = session['user_id']
        
        conn = get_db_connection()
        
        # ၁။ ဆရာဝန်ရဲ့ အချိန်အပိုင်းအခြားကို DB ကနေ အရင်ယူပါ
        doc_info = conn.execute('SELECT time FROM doctors WHERE id = ?', (doctor_id,)).fetchone()
        
        if doc_info and doc_info['time']:
            try:
                # doc_info['time'] က "09:00 AM - 12:00 PM" ပုံစံဖြစ်တယ်လို့ ယူဆပါတယ်
                time_range = doc_info['time']
                end_time_str = time_range.split('-')[1].strip() # "12:00 PM" ကို ဖြတ်ယူပါ
                
                # စာသားကို အချိန် format ပြောင်းပါ
                end_time = datetime.datetime.strptime(end_time_str, "%I:%M %p").time()
                
                # လက်ရှိ မြန်မာစံတော်ချိန်ကို ယူပါ
                now_time = datetime.datetime.now().time()
                today_str = datetime.date.today().strftime('%Y-%m-%d')

                # အကယ်၍ လူနာရွေးတဲ့ရက်က "ဒီနေ့" ဖြစ်နေပြီး၊ လက်ရှိအချိန်က ဆရာဝန်ကြည့်ချိန်ထက် ကျော်နေရင်
                if booking_date == today_str and now_time > end_time:
                    conn.close()
                    return f"<script>alert('စိတ်မရှိပါနဲ့၊ ယနေ့အတွက် ဆရာဝန်ပြသချိန် ({time_range}) ကျော်လွန်သွားပြီဖြစ်သောကြောင့် Booking ယူ၍မရတော့ပါ။'); window.history.back();</script>"
            except Exception as e:
                print(f"Time parsing error: {e}") # Format မကိုက်ရင် error မတက်အောင် logic ဆက်သွားပါ

        # ၂။ ကျန်တဲ့ ပုံမှန် စစ်ဆေးမှုများ (Already booked / Limit check)
        already_booked = conn.execute('''
            SELECT id FROM appointments 
            WHERE user_id = ? AND doctor_id = ? AND date(booking_time) = date(?) AND status = 'booked'
        ''', (user_id, doctor_id, booking_date)).fetchone()

        if already_booked:
            conn.close()
            return "<script>alert('သင့်မှာ ဒီဆရာဝန်နဲ့ ရက်ချိန်းတစ်ခု ရှိနေပြီးသား ဖြစ်ပါတယ်။'); window.history.back();</script>"

        limit_data = conn.execute('SELECT remaining FROM doctors WHERE id = ?', (doctor_id,)).fetchone()
        max_limit = limit_data['remaining'] if limit_data else 25

        booked_on_date = conn.execute('''
            SELECT COUNT(*) FROM appointments 
            WHERE doctor_id = ? AND date(booking_time) = date(?)
        ''', (doctor_id, booking_date)).fetchone()[0]
        
        if booked_on_date >= max_limit:
            conn.close()
            return "<script>alert('Sorry, this date is fully booked.'); window.history.back();</script>"

        conn.execute('INSERT INTO appointments (user_id, doctor_id, booking_time, status) VALUES (?, ?, ?, "booked")',
                     (user_id, doctor_id, booking_date))
        conn.commit()
        conn.close()
        flash("Booking Successful!", "success")
        return redirect(url_for('patient_dashboard'))
    return redirect(url_for('login_page'))

@app.route('/debug/reset_appointments')
def reset_appointments():
    conn = get_db_connection()
    conn.execute('DELETE FROM appointments')
    conn.execute('DELETE FROM sqlite_sequence WHERE name="appointments"')
    conn.commit()
    conn.close()
    return "Appointments Table Cleared!"

from flask import send_from_directory

@app.route('/manifest.json')
def serve_manifest():
    return send_from_directory('static', 'manifest.json')

@app.route('/sw.js')
def serve_sw():
    return send_from_directory('static', 'sw.js')

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 10000))
    app.run(host='0.0.0.0', port=port)