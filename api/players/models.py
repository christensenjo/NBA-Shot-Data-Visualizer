from django.db import models

# Create your models here.


class Player(models.Model):
    name = models.CharField(max_length=100)
    team_name = models.CharField(max_length=100)
    id_csv = models.IntegerField()
    team = models.ForeignKey('Team', related_name='players', on_delete=models.PROTECT, blank=True, null=True)

    def __str__(self):
        return f'{self.name}, {self.team}'


class Team(models.Model):
    name = models.CharField(max_length=100)
    slug = models.CharField(max_length=6, blank=True, null=True) #unique = true
    id_csv = models.IntegerField()

    def __str__(self):
        return f'{self.name}'
