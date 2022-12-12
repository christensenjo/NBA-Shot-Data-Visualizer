from django.apps import apps
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Seed Data'

    def add_arguments(self, parser):
        parser.add_argument('--year', required=False, type=int, help='What year should we seed? Leave blank for all', default=None)

    def handle(self, *args, **kwargs):
        year = kwargs.get('year', None) or None
        apps.get_model('shots', 'Shot').load_data(year)