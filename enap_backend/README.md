# Stockify Backend

This is the backend service for the Stockify application, built with Django and following REST principles.

## Project Structure

```
enap_backend/
├── stockify/              # Main project configuration
├── users/                 # User management module
├── products/             # Product management module
├── orders/              # Order management module
├── deliveries/          # Delivery management module
├── invoices/           # Invoice management module
├── alerts/            # Expired product alerts module
├── requirements.txt   # Python dependencies
└── Dockerfile        # Docker configuration
```

## Setup Instructions

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
- Copy `.env.example` to `.env`
- Update the values in `.env` with your configuration

4. Run migrations:
```bash
python manage.py migrate
```

5. Create a superuser:
```bash
python manage.py createsuperuser
```

6. Run the development server:
```bash
python manage.py runserver
```

## Docker Setup

1. Build the Docker image:
```bash
docker build -t stockify-backend .
```

2. Run with Docker Compose:
```bash
docker-compose up
```

## API Documentation

The API documentation is available at `/api/docs/` when running the server.

## Testing

Run tests with:
```bash
python manage.py test
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Write tests
4. Submit a pull request

## License

This project is proprietary and confidential. 