from django.contrib import admin
from .models import ExampleModel
# Register your models here.

class ExampleModelAdmin(admin.ModelAdmin):
  list_display = ("firstname", "lastname",)
  
admin.site.register(ExampleModel, ExampleModelAdmin)
