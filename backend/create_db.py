import pymysql
import os

try:
    host = os.environ.get('DB_HOST', 'localhost')
    user = os.environ.get('DB_USER', 'root')
    password = os.environ.get('DB_PASSWORD', '')
    port = int(os.environ.get('DB_PORT', '3306'))

    conn = pymysql.connect(host=host, user=user, password=password, port=port)
    cursor = conn.cursor()
    cursor.execute("DROP DATABASE IF EXISTS eventflow_db;")
    cursor.execute("CREATE DATABASE eventflow_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;")
    print("Database eventflow_db cleanly recreated successfully!")
    conn.close()
except Exception as e:
    print(f"MySQL create database error: {e}")
