#!/usr/bin/env python3
"""
Cria uma logo customizada do restaurante
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_restaurant_logo():
    """Cria uma logo do restaurante"""
    
    width, height = 1200, 600
    
    # Cria imagem com gradiente
    img = Image.new('RGBA', (width, height), (255, 255, 255, 0))
    draw = ImageDraw.Draw(img)
    
    # Fundo com gradiente (simulado com retângulos)
    for y in range(height):
        r = int(220 + (35 * y / height))
        g = int(180 + (30 * y / height))
        b = int(100)
        color = (r, g, b, 255)
        draw.rectangle([(0, y), (width, y+1)], fill=color)
    
    # Adiciona padrão de textura
    for x in range(0, width, 100):
        for y in range(0, height, 100):
            draw.ellipse(
                [(x, y), (x+80, y+80)],
                fill=(255, 255, 255, 15)
            )
    
    # Texto principal
    try:
        font_large = ImageFont.truetype("arial.ttf", 120)
        font_small = ImageFont.truetype("arial.ttf", 60)
    except:
        font_large = ImageFont.load_default()
        font_small = ImageFont.load_default()
    
    # Desenha "Meu Restaurante"
    text1 = "Meu Restaurante"
    text2 = "Self-Service"
    
    # Sombra para texto
    bbox1 = draw.textbbox((0, 0), text1, font=font_large)
    text1_width = bbox1[2] - bbox1[0]
    x1 = (width - text1_width) // 2
    
    # Sombra
    draw.text((x1+4, 180+4), text1, font=font_large, fill=(0, 0, 0, 80))
    # Texto principal
    draw.text((x1, 180), text1, font=font_large, fill=(255, 255, 255, 255))
    
    # Texto pequeno
    bbox2 = draw.textbbox((0, 0), text2, font=font_small)
    text2_width = bbox2[2] - bbox2[0]
    x2 = (width - text2_width) // 2
    
    draw.text((x2+2, 330+2), text2, font=font_small, fill=(200, 120, 50, 100))
    draw.text((x2, 330), text2, font=font_small, fill=(255, 200, 100, 255))
    
    # Desenha decorações
    # Triângulos para simular talheres
    for i in range(5):
        x = 100 + (i * 200)
        draw.polygon([(x, 480), (x+30, 520), (x-30, 520)], 
                    fill=(255, 255, 255, 150))
    
    # Salva
    os.makedirs('public/uploads', exist_ok=True)
    img.save('public/uploads/logo-estabelecimento.png', 'PNG', quality=95)
    print("✅ Logo criada: public/uploads/logo-estabelecimento.png")
    return True

if __name__ == '__main__':
    create_restaurant_logo()
    print("\n🎉 Pronto! URL para usar no admin: /uploads/logo-estabelecimento.png")
