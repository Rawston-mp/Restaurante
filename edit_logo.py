#!/usr/bin/env python3
"""
Script para processar a logo do restaurante
Salve a imagem como 'logo_original.png' na pasta raiz do projeto
"""

from PIL import Image, ImageEnhance, ImageDraw, ImageFilter
import os
from pathlib import Path
import urllib.request

def download_sample_image():
    """Baixa uma imagem de restaurante para teste"""
    print("📥 Baixando imagem de teste...")
    url = "https://images.unsplash.com/photo-1559927615-cd2628902d4a?w=1200&q=80"
    try:
        urllib.request.urlretrieve(url, "logo_original.png")
        print("✅ Imagem de teste baixada!")
        return True
    except:
        print("❌ Não consegui baixar. Tente salvar manualmente.")
        return False

def remove_white_background(image):
    """Remove o fundo branco e faz transparente"""
    if image.mode != 'RGBA':
        image = image.convert('RGBA')
    
    data = image.getdata()
    new_data = []
    white_threshold = 240
    
    for pixel in data:
        if (pixel[0] > white_threshold and 
            pixel[1] > white_threshold and 
            pixel[2] > white_threshold):
            new_data.append((255, 255, 255, 0))
        else:
            new_data.append(pixel)
    
    image.putdata(new_data)
    return image

def enhance_colors(image):
    """Intensifica cores para combinar com tema"""
    enhancer = ImageEnhance.Color(image)
    image = enhancer.enhance(1.3)
    
    enhancer = ImageEnhance.Contrast(image)
    image = enhancer.enhance(1.2)
    
    enhancer = ImageEnhance.Brightness(image)
    image = enhancer.enhance(1.05)
    
    return image

def add_shadow(image):
    """Adiciona sombra suave"""
    shadow = Image.new('RGBA', 
        (image.width + 20, image.height + 20), 
        (0, 0, 0, 0))
    
    shadow_area = Image.new('RGBA', 
        (image.width, image.height), 
        (0, 0, 0, 30))
    
    shadow.paste(shadow_area, (10, 10), shadow_area)
    shadow.paste(image, (5, 5), image)
    
    return shadow

def process_logo(input_path, output_path, target_width=1200, target_height=600):
    """Processa a logo completa"""
    
    if not os.path.exists(input_path):
        print(f"⚠️  Arquivo não encontrado: {input_path}")
        if download_sample_image():
            print("Processando com imagem de teste...\n")
        else:
            print("Salve a imagem como 'logo_original.png'")
            return False
    
    print(f"📷 Abrindo imagem: {input_path}")
    image = Image.open(input_path)
    
    print("🎨 Removendo fundo branco...")
    image = remove_white_background(image)
    
    print("🌈 Intensificando cores...")
    image = enhance_colors(image)
    
    print(f"📐 Redimensionando para {target_width}x{target_height}...")
    image.thumbnail((target_width - 40, target_height - 40), Image.Resampling.LANCZOS)
    
    print("✨ Adicionando sombra...")
    image = add_shadow(image)
    
    # Canvas final com fundo gradiente simulado
    final = Image.new('RGBA', (target_width, target_height), (255, 255, 255, 0))
    
    x = (target_width - image.width) // 2
    y = (target_height - image.height) // 2
    final.paste(image, (x, y), image)
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    print(f"💾 Salvando em: {output_path}")
    final.save(output_path, 'PNG', quality=95)
    print(f"✅ Imagem processada!")
    print(f"📊 Dimensões: {final.size}")
    print(f"🔗 URL: /uploads/logo-estabelecimento.png")
    
    return True

if __name__ == '__main__':
    input_file = 'logo_original.png'
    output_file = 'public/uploads/logo-estabelecimento.png'
    
    if process_logo(input_file, output_file):
        print("\n🎉 Pronto! Agora você pode usar a imagem no admin:")
        print("   1. Vá para Configurações")
        print("   2. Cole a URL: /uploads/logo-estabelecimento.png")
        print("   3. Salve e veja na home!")
