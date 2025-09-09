#!/usr/bin/env python3

from utils.database import get_db_connection
from utils.hashing import hash_password

def fix_test_users():
    """Fix password hashes for test users"""
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # Update verifier test user
        new_verifier_hash = hash_password("verifier123")
        print(f"New verifier hash: {new_verifier_hash}")
        
        cur.execute(
            "UPDATE verifiers SET password_hash = %s WHERE email = %s",
            (new_verifier_hash, "verifier@test.com")
        )
        print(f"Updated verifier rows: {cur.rowcount}")
        
        # Update institution test user
        new_institution_hash = hash_password("admin123")
        print(f"New institution hash: {new_institution_hash}")
        
        cur.execute(
            "UPDATE institutions SET password_hash = %s WHERE email = %s",
            (new_institution_hash, "admin@jhu.edu")
        )
        print(f"Updated institution rows: {cur.rowcount}")
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Password hashes fixed successfully!")
        
    except Exception as e:
        print(f"❌ Error fixing password hashes: {e}")

if __name__ == "__main__":
    fix_test_users()
