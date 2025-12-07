#!/usr/bin/env python3
"""Create test user: login=test, password=test"""

import sys
sys.path.insert(0, '/app')

from database.session import create_db_and_tables, get_session
from user.user import User
from utils.hash import hash_password

# Create tables
create_db_and_tables()

# Get session
session = next(get_session())

try:
    # Check if user exists
    existing = session.query(User).filter(User.login == "test").first()
    if existing:
        # Update password
        existing.password = hash_password("test")
        session.add(existing)
        session.commit()
        print("✓ User 'test' updated with password 'test'")
    else:
        # Create new user
        test_user = User(
            imie="Test",
            nazwisko="User",
            login="test",
            password=hash_password("test"),
            role_id=None
        )
        session.add(test_user)
        session.commit()
        print("✓ User 'test' created with password 'test'")
except Exception as e:
    print(f"✗ Error: {e}")
finally:
    session.close()
