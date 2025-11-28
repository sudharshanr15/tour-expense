from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Tour(db.Model):
    __tablename__ = 'tour'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128), nullable=False)
    start_date = db.Column(db.Date)
    end_date = db.Column(db.Date)
    expenses = db.relationship('Expense', backref='tour', cascade='all, delete-orphan')


class Expense(db.Model):
    __tablename__ = 'expense'
    id = db.Column(db.Integer, primary_key=True)
    tour_id = db.Column(db.Integer, db.ForeignKey('tour.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(8), default='USD')
    category = db.Column(db.String(64))
    note = db.Column(db.String(256))
    incurred_at = db.Column(db.DateTime, default=datetime.utcnow)
