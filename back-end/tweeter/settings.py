"""
Django settings for tweeter project.

Generated by 'django-admin startproject' using Django 4.2.11.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
#import dj_database_url
from pathlib import Path

from decouple import config
import dj_database_url

from dotenv import load_dotenv
from urllib.parse import urlparse, parse_qsl

import cloudinary

from datetime import timedelta
# Build paths inside the project like this: BASE_DIR / 'subdir'.
#old
#BASE_DIR = Path(__file__).resolve().parent.parent

#new
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))



# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = config("SECRET_KEY", default="") #default=<secret key found in render environment variables> for local testing
# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = False
DEBUG = config("DEBUG", default=False, cast=bool)
#ALLOWED_HOSTS = ['*']
ALLOWED_HOSTS = ['tweeter-back-end.onrender.com', 'localhost']

cloudinary.config( 
  cloud_name = config('CLOUDINARY_CLOUD_NAME', default=""),
  api_key    = config('CLOUDINARY_API_KEY', default=""),
  api_secret = config('CLOUDINARY_API_SECRET', default="")
)
# Application definition
REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    #'DEFAULT_AUTHENTICATION_CLASSES': (
    #    'rest_framework.authentication.BasicAuthentication',
    #    'rest_framework.authentication.SessionAuthentication',
   # ),
   # 'DEFAULT_PERMISSION_CLASSES': (
   #     'rest_framework.permissions.AllowAny',
   # ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'api.auth_backend.CustomJWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    )
    
}

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'content',
    'corsheaders',
    'cloudinary',
    'rest_framework',
    'rest_framework_simplejwt',
    #'bootstrap5',
    'whitenoise.runserver_nostatic',
    
    'api.apps.ApiConfig',
    #'gdstorage',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware', 
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    
]

CORS_ORIGIN_ALLOW_ALL = True
CORS_ALLOW_ALL_HEADERS=True

CORS_ALLOWED_ORIGINS = [
"https://thetweeters.netlify.app", "http://localhost:4200",
]

#
# Google Drive Storage Settings
#
#GOOGLE_DRIVE_STORAGE_JSON_KEY_FILE = PROJECT_ROOT + '/google/template.json'
#GOOGLE_DRIVE_STORAGE_MEDIA_ROOT = '<base google drive path for file uploads>' # OPTIONAL





ROOT_URLCONF = 'tweeter.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(PROJECT_ROOT, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': DEBUG,
        },
    },
]

WSGI_APPLICATION = 'tweeter.wsgi.application'

# Add these at the top of your settings.py

load_dotenv()

# Replace the DATABASES section of your settings.py with this
tmpPostgres = urlparse(os.getenv("DATABASE_URL","")) #second param is defualt value for local testing
#tmpPostgres = urlparse(os.getenv("DATABASE_URL",< insert database url from neon >)) for local testing
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': tmpPostgres.path.replace('/', ''),
        'USER': tmpPostgres.username,
        'PASSWORD': tmpPostgres.password,
        'HOST': tmpPostgres.hostname,
        'PORT': 5432,
        'OPTIONS': dict(parse_qsl(tmpPostgres.query)),
    }
}
#try connection steps directly from neon

# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),     # Customize as needed
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),       # Customize as needed
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/


STATIC_ROOT = os.path.join(PROJECT_ROOT, 'staticfiles')
STATIC_URL = '/static/'

# Extra places for collectstatic to find static files.
#STATICFILES_DIRS = [
#    os.path.join(PROJECT_ROOT, 'static'),
#]

# old set up
#BASE_DIR = Path(__file__).resolve().parent.parent
#STATIC_ROOT = BASE_DIR / 'productionfiles'
#STATIC_URL = 'static/'


# Simplified static file serving.
# https://warehouse.python.org/project/whitenoise/
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
