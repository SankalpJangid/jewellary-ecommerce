from django.core.management.base import BaseCommand
from django.core.files.base import ContentFile
from shop.models import Product, ProductImage
from PIL import Image, ImageDraw, ImageFont
import io

class Command(BaseCommand):
    help = 'Add placeholder images for products'

    def handle(self, *args, **options):
        self.stdout.write('Creating placeholder images for products...')
        
        products = Product.objects.all()
        
        for product in products:
            # Skip if product already has images
            if product.images.exists():
                continue
                
            # Create a placeholder image
            img = Image.new('RGB', (400, 400), color='#f0f0f0')
            draw = ImageDraw.Draw(img)
            
            # Add a border
            draw.rectangle([0, 0, 399, 399], outline='#ddd', width=2)
            
            # Add text
            try:
                # Try to use a default font
                font = ImageFont.load_default()
            except:
                font = None
            
            # Product name (wrapped)
            text_lines = self.wrap_text(product.title, 20)
            y_offset = 150
            
            for line in text_lines:
                if font:
                    bbox = draw.textbbox((0, 0), line, font=font)
                    text_width = bbox[2] - bbox[0]
                    text_height = bbox[3] - bbox[1]
                else:
                    text_width = len(line) * 6
                    text_height = 11
                
                x = (400 - text_width) // 2
                draw.text((x, y_offset), line, fill='#333', font=font)
                y_offset += text_height + 5
            
            # Add price
            price_text = f"₹{product.sale_price or product.price}"
            if font:
                bbox = draw.textbbox((0, 0), price_text, font=font)
                text_width = bbox[2] - bbox[0]
            else:
                text_width = len(price_text) * 6
            
            x = (400 - text_width) // 2
            draw.text((x, y_offset + 20), price_text, fill='#f27a2b', font=font)
            
            # Add material info
            material_text = product.material or "Silver"
            if font:
                bbox = draw.textbbox((0, 0), material_text, font=font)
                text_width = bbox[2] - bbox[0]
            else:
                text_width = len(material_text) * 6
            
            x = (400 - text_width) // 2
            draw.text((x, y_offset + 50), material_text, fill='#666', font=font)
            
            # Convert to bytes
            img_io = io.BytesIO()
            img.save(img_io, format='JPEG', quality=85)
            img_io.seek(0)
            
            # Create ProductImage
            ProductImage.objects.create(
                product=product,
                image=ContentFile(img_io.getvalue(), name=f'{product.slug}.jpg'),
                alt_text=f'{product.title} placeholder image',
                is_primary=True
            )
            
            self.stdout.write(f'Created placeholder image for: {product.title}')
        
        self.stdout.write(
            self.style.SUCCESS('Successfully created placeholder images!')
        )

    def wrap_text(self, text, max_length):
        """Wrap text to fit within max_length characters per line"""
        words = text.split()
        lines = []
        current_line = []
        
        for word in words:
            if len(' '.join(current_line + [word])) <= max_length:
                current_line.append(word)
            else:
                if current_line:
                    lines.append(' '.join(current_line))
                    current_line = [word]
                else:
                    lines.append(word)
        
        if current_line:
            lines.append(' '.join(current_line))
        
        return lines
