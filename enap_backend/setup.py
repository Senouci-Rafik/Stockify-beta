import os
import subprocess
import sys

def setup_django():
    # Check if we're in a virtual environment
    if not hasattr(sys, 'real_prefix') and not hasattr(sys, 'base_prefix'):
        print("Creating virtual environment...")
        subprocess.run([sys.executable, "-m", "venv", ".venv"])
        
        # Activate virtual environment
        if os.name == 'nt':  # Windows
            activate_script = os.path.join(".venv", "Scripts", "activate")
        else:  # Unix/Linux
            activate_script = os.path.join(".venv", "bin", "activate")
        
        print(f"Activating virtual environment: {activate_script}")
        
    # Install dependencies
    print("Installing dependencies...")
    subprocess.run([sys.executable, "-m", "pip", "install", "-r", "requirements.txt"])
    
    # Apply migrations
    print("Applying migrations...")
    subprocess.run([sys.executable, "manage.py", "makemigrations"])
    subprocess.run([sys.executable, "manage.py", "migrate"])
    
    # Create superuser if not exists
    print("Creating superuser...")
    try:
        subprocess.run([sys.executable, "manage.py", "createsuperuser", "--noinput"], 
                      env=dict(os.environ, DJANGO_SUPERUSER_USERNAME="admin",
                              DJANGO_SUPERUSER_EMAIL="admin@stockify.com",
                              DJANGO_SUPERUSER_PASSWORD="admin123"))
    except:
        print("Superuser might already exist, continuing...")
    
    print("Setup completed!")
    print("To start the server, run: python manage.py runserver")

if __name__ == "__main__":
    setup_django() 
