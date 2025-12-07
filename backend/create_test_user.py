#!/usr/bin/env python3
"""Script to create a test user in the database"""

import sys
sys.path.insert(0, '/app')

from database.session import create_db_and_tables, get_session
from user.user import User, UserPost
from utils.hash import hash_password
from sqlmodel import Session, SQLModel, create_engine

# Create tables
create_db_and_tables()

# Get session
session = next(get_session())

try:
    # Create test user
    test_user = User(
        imie="Test",
        nazwisko="User",
        login="testuser",
        password=hash_password("testpass123"),
        role_id=None
    )
    session.add(test_user)
    session.commit()
    print("✓ Test user created: login='testuser', password='testpass123'")
except Exception as e:
    if "UNIQUE constraint failed" in str(e) or "already exists" in str(e):
        print("✓ Test user already exists: login='testuser', password='testpass123'")
    else:
        print(f"✗ Error: {e}")
finally:
    session.close()
