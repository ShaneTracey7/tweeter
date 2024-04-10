from django.db import models

class Student(models.Model):
    name = models.CharField(max_length = 255)
    address = models.CharField(max_length = 255)
    fee = models.IntegerField()

    def __str__(self):
        return f"{self.name} {self.address} {self.fee}"
