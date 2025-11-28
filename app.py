import os
from datetime import datetime
from flask import Flask, request, jsonify, abort
from flask_cors import CORS
import logging

from models import db, Tour, Expense


def create_app():
    app = Flask(__name__)
    app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', 'sqlite:///tour_expense.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    db.init_app(app)
    # Enable CORS for all origins (development). Allows frontend at other origins to call API.
    CORS(app)
    # Enable detailed request/response logging for debugging 403 issues
    logging.basicConfig(level=logging.DEBUG)
    app.logger.setLevel(logging.DEBUG)

    @app.before_request
    def _log_request():
        try:
            body = request.get_data(as_text=True)
        except Exception:
            body = '<unavailable>'
        app.logger.debug(f"Request -> {request.method} {request.path} headers={dict(request.headers)} body={body}")

    @app.after_request
    def _log_response(response):
        try:
            headers = dict(response.headers)
        except Exception:
            headers = {}
        app.logger.debug(f"Response <- {request.method} {request.path} status={response.status} headers={headers}")
        return response

    @app.cli.command('init-db')
    def init_db():
        """Initialize the database (create tables)."""
        with app.app_context():
            db.create_all()
        print('Database initialized.')

    def _tour_to_dict(tour):
        return {
            'id': tour.id,
            'name': tour.name,
            'start_date': tour.start_date.isoformat() if tour.start_date else None,
            'end_date': tour.end_date.isoformat() if tour.end_date else None,
        }

    def _expense_to_dict(exp):
        return {
            'id': exp.id,
            'tour_id': exp.tour_id,
            'amount': exp.amount,
            'currency': exp.currency,
            'category': exp.category,
            'note': exp.note,
            'incurred_at': exp.incurred_at.isoformat() if exp.incurred_at else None,
        }

    @app.route('/api/tours', methods=['POST'])
    def create_tour():
        data = request.get_json() or {}
        name = data.get('name')
        if not name:
            return jsonify({'error': 'name is required'}), 400

        start_date = data.get('start_date')
        end_date = data.get('end_date')
        sd = None
        ed = None
        try:
            if start_date:
                sd = datetime.fromisoformat(start_date).date()
            if end_date:
                ed = datetime.fromisoformat(end_date).date()
        except ValueError:
            return jsonify({'error': 'invalid date format, use ISO YYYY-MM-DD'}), 400

        tour = Tour(name=name, start_date=sd, end_date=ed)
        db.session.add(tour)
        db.session.commit()
        return jsonify(_tour_to_dict(tour)), 201

    @app.route('/api/tours', methods=['GET'])
    def list_tours():
        tours = Tour.query.all()
        return jsonify([_tour_to_dict(t) for t in tours])

    @app.route('/api/tours/<int:tour_id>', methods=['GET'])
    def get_tour(tour_id):
        tour = Tour.query.get_or_404(tour_id)
        data = _tour_to_dict(tour)
        data['expenses'] = [_expense_to_dict(e) for e in tour.expenses]
        return jsonify(data)

    @app.route('/api/tours/<int:tour_id>/expenses', methods=['POST'])
    def create_expense(tour_id):
        tour = Tour.query.get_or_404(tour_id)
        data = request.get_json() or {}
        try:
            amount = float(data.get('amount'))
        except (TypeError, ValueError):
            return jsonify({'error': 'amount is required and must be a number'}), 400
        currency = data.get('currency', 'USD')
        category = data.get('category')
        note = data.get('note')
        incurred_at = data.get('incurred_at')
        ia = None
        try:
            if incurred_at:
                ia = datetime.fromisoformat(incurred_at)
        except ValueError:
            return jsonify({'error': 'invalid datetime format, use ISO'}), 400

        expense = Expense(tour=tour, amount=amount, currency=currency, category=category, note=note, incurred_at=ia)
        db.session.add(expense)
        db.session.commit()
        return jsonify(_expense_to_dict(expense)), 201

    @app.route('/api/tours/<int:tour_id>/expenses', methods=['GET'])
    def list_expenses_for_tour(tour_id):
        Tour.query.get_or_404(tour_id)
        expenses = Expense.query.filter_by(tour_id=tour_id).all()
        return jsonify([_expense_to_dict(e) for e in expenses])

    @app.route('/api/expenses/<int:expense_id>', methods=['GET'])
    def get_expense(expense_id):
        exp = Expense.query.get_or_404(expense_id)
        return jsonify(_expense_to_dict(exp))

    @app.route('/api/summary/tour/<int:tour_id>', methods=['GET'])
    def tour_summary(tour_id):
        Tour.query.get_or_404(tour_id)
        # Summarize totals per currency
        rows = db.session.query(Expense.currency, db.func.sum(Expense.amount)).filter(Expense.tour_id == tour_id).group_by(Expense.currency).all()
        summary = {currency: total for (currency, total) in rows}
        return jsonify({'tour_id': tour_id, 'totals': summary})

    return app


if __name__ == '__main__':
    # For quick manual run: python app.py
    app = create_app()
    app.run(debug=True)
