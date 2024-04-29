from django.db import models

class Student(models.Model):
    name = models.CharField(max_length = 255)
    address = models.CharField(max_length = 255)
    fee = models.IntegerField()

    def __str__(self):
        return f"{self.name} {self.address} {self.fee}"
    
class User(models.Model):
    acc_name = models.CharField(max_length = 35)
    username = models.CharField(max_length = 35)
    password = models.CharField(max_length = 35)

    def __str__(self):
        return f"{self.acc_name} {self.username} {self.password}"

