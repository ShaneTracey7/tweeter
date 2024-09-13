from django.contrib import admin
from api.models import Student, User

# Register your models here.
admin.site.register(Student)


class UserAdmin(admin.ModelAdmin):
  list_display = ("username", "email", "acc_name", "password")

admin.site.register(User, UserAdmin)
