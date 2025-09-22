from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from shop.models import Category, Product, ProductImage
import os

class Command(BaseCommand):
    help = 'Seed the database with sample jewelry data'

    def handle(self, *args, **options):
        self.stdout.write('Creating sample jewelry data...')
        
        # Create categories
        categories_data = [
            {
                'name': 'Necklaces',
                'slug': 'necklaces',
                'description': 'Beautiful necklaces crafted with 92.5% pure silver',
                'is_featured': True
            },
            {
                'name': 'Earrings',
                'slug': 'earrings', 
                'description': 'Elegant earrings for every occasion',
                'is_featured': True
            },
            {
                'name': 'Rings',
                'slug': 'rings',
                'description': 'Traditional and modern rings with intricate designs',
                'is_featured': True
            },
            {
                'name': 'Bracelets',
                'slug': 'bracelets',
                'description': 'Stylish bracelets and bangles'
            },
            {
                'name': 'Anklets',
                'slug': 'anklets',
                'description': 'Traditional anklets for special occasions'
            }
        ]

        categories = {}
        for cat_data in categories_data:
            defaults = {k: v for k, v in cat_data.items() if k != 'slug'}
            category, created = Category.objects.get_or_create(
                slug=cat_data['slug'],
                defaults=defaults
            )
            # Update fields if category already existed
            if not created:
                updated = False
                for k, v in defaults.items():
                    if getattr(category, k) != v:
                        setattr(category, k, v)
                        updated = True
                if updated:
                    category.save()
            categories[cat_data['slug']] = category
            if created:
                self.stdout.write(f'Created category: {category.name}')

        # Create products
        products_data = [
            {
                'title': 'Traditional Rajasthani Necklace',
                'slug': 'traditional-rajasthani-necklace',
                'description': 'A stunning traditional necklace featuring intricate Rajasthani designs. Crafted with 92.5% pure silver and adorned with beautiful patterns.',
                'material': '92.5% Pure Silver',
                'price': 2499.00,
                'sale_price': 1999.00,
                'stock': 15,
                'category_slug': 'necklaces',
                'highlights': [
                    'Certified 92.5% Pure Silver',
                    'Traditional Rajasthani Design',
                    'Handcrafted by skilled artisans',
                    'Perfect for weddings and festivals'
                ]
            },
            {
                'title': 'Elegant Pearl Drop Earrings',
                'slug': 'elegant-pearl-drop-earrings',
                'description': 'Beautiful pearl drop earrings that add elegance to any outfit. Made with high-quality pearls and silver.',
                'material': 'Silver with Pearl',
                'price': 1299.00,
                'sale_price': 999.00,
                'stock': 25,
                'category_slug': 'earrings',
                'highlights': [
                    'High-quality pearls',
                    '925 Silver setting',
                    'Lightweight and comfortable',
                    'Perfect for daily wear'
                ]
            },
            {
                'title': 'Royal Kundan Ring',
                'slug': 'royal-kundan-ring',
                'description': 'A magnificent Kundan ring featuring traditional Indian craftsmanship. This piece showcases the rich heritage of Indian jewelry.',
                'material': 'Silver with Kundan',
                'price': 1899.00,
                'sale_price': 1499.00,
                'stock': 12,
                'category_slug': 'rings',
                'highlights': [
                    'Traditional Kundan work',
                    '925 Silver base',
                    'Intricate detailing',
                    'Statement piece'
                ]
            },
            {
                'title': 'Delicate Chain Bracelet',
                'slug': 'delicate-chain-bracelet',
                'description': 'A delicate chain bracelet perfect for everyday wear. Simple yet elegant design that complements any style.',
                'material': '92.5% Pure Silver',
                'price': 799.00,
                'sale_price': 599.00,
                'stock': 30,
                'category_slug': 'bracelets',
                'highlights': [
                    'Minimalist design',
                    'Comfortable fit',
                    'Versatile styling',
                    'Durable construction'
                ]
            },
            {
                'title': 'Traditional Anklet Set',
                'slug': 'traditional-anklet-set',
                'description': 'A beautiful set of traditional anklets featuring classic Indian designs. Perfect for festivals and special occasions.',
                'material': 'Silver with Bells',
                'price': 1199.00,
                'sale_price': 899.00,
                'stock': 20,
                'category_slug': 'anklets',
                'highlights': [
                    'Traditional design',
                    'Musical bells',
                    'Adjustable size',
                    'Festival favorite'
                ]
            },
            {
                'title': 'Modern Geometric Necklace',
                'slug': 'modern-geometric-necklace',
                'description': 'A contemporary necklace with geometric patterns. Perfect blend of traditional silver work with modern design.',
                'material': '92.5% Pure Silver',
                'price': 1799.00,
                'sale_price': 1399.00,
                'stock': 18,
                'category_slug': 'necklaces',
                'highlights': [
                    'Modern geometric design',
                    '925 Silver construction',
                    'Contemporary appeal',
                    'Versatile styling'
                ]
            },
            {
                'title': 'Stud Earrings Collection',
                'slug': 'stud-earrings-collection',
                'description': 'A collection of beautiful stud earrings featuring various designs. Perfect for everyday wear and gifting.',
                'material': 'Silver with Gemstones',
                'price': 899.00,
                'sale_price': 699.00,
                'stock': 35,
                'category_slug': 'earrings',
                'highlights': [
                    'Multiple designs',
                    'Hypoallergenic',
                    'Easy to wear',
                    'Great gift option'
                ]
            },
            {
                'title': 'Statement Cocktail Ring',
                'slug': 'statement-cocktail-ring',
                'description': 'A bold statement ring perfect for special occasions. Features intricate silver work and beautiful detailing.',
                'material': 'Silver with Enamel',
                'price': 1599.00,
                'sale_price': 1199.00,
                'stock': 10,
                'category_slug': 'rings',
                'highlights': [
                    'Bold statement piece',
                    'Intricate silver work',
                    'Eye-catching design',
                    'Perfect for parties'
                ]
            },
            {
                'title': 'Charm Bracelet Set',
                'slug': 'charm-bracelet-set',
                'description': 'A beautiful charm bracelet featuring multiple charms. Each charm represents different aspects of Indian culture.',
                'material': 'Silver with Charms',
                'price': 1399.00,
                'sale_price': 1099.00,
                'stock': 22,
                'category_slug': 'bracelets',
                'highlights': [
                    'Multiple charms',
                    'Cultural significance',
                    'Adjustable length',
                    'Meaningful gift'
                ]
            },
            {
                'title': 'Festival Anklet Collection',
                'slug': 'festival-anklet-collection',
                'description': 'A collection of anklets perfect for festivals and celebrations. Features traditional designs with modern comfort.',
                'material': 'Silver with Traditional Work',
                'price': 999.00,
                'sale_price': 749.00,
                'stock': 28,
                'category_slug': 'anklets',
                'highlights': [
                    'Festival collection',
                    'Traditional patterns',
                    'Comfortable wear',
                    'Celebration ready'
                ]
            }
        ]

        for product_data in products_data:
            category = categories[product_data['category_slug']]
            product_data.pop('category_slug')
            
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    **product_data,
                    'category': category
                }
            )
            
            if created:
                self.stdout.write(f'Created product: {product.title}')
                
                # Create a placeholder image (you can replace this with actual images later)
                # For now, we'll skip creating images since we don't have actual image files
                # ProductImage.objects.create(
                #     product=product,
                #     image=ContentFile(b'', name=f'{product.slug}.jpg'),
                #     alt_text=f'{product.title} image',
                #     is_primary=True
                # )

        self.stdout.write(
            self.style.SUCCESS('Successfully created sample jewelry data!')
        )
        self.stdout.write('You can now:')
        self.stdout.write('1. Visit http://localhost:3000 to see the products')
        self.stdout.write('2. Login to admin at http://localhost:8000/admin')
        self.stdout.write('3. Add actual product images through the admin panel')
