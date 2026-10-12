import importlib.util
import unittest
from pathlib import Path
spec = importlib.util.spec_from_file_location('preview', Path(__file__).parents[1] / 'scripts/preview.py')
preview = importlib.util.module_from_spec(spec)
spec.loader.exec_module(preview)

class Reviews(unittest.TestCase):
    def test_valid_comment(self):
        name, value = preview.validate_review({'file': 'gloria-detached-800.webp', 'status': 'changes', 'note': 'Gray background'})
        self.assertEqual(name, 'gloria-detached-800.webp')
        self.assertEqual(value['note'], 'Gray background')
        self.assertIn('updatedAt', value)

    def test_invalid_requests_cannot_write_arbitrary_files(self):
        for file, status, note in [('../data.json', 'approved', ''), ('unknown-800.webp', 'approved', ''), ('gloria-detached-800.webp', 'generate', ''), ('gloria-detached-800.webp', 'approved', 'x' * 4001)]:
            with self.subTest(file=file, status=status):
                with self.assertRaises(ValueError):
                    preview.validate_review({'file': file, 'status': status, 'note': note})

if __name__ == '__main__':
    unittest.main()
