import os
import json

# Define las rutas absolutas para evitar errores de directorio
ruta_actual = os.path.dirname(os.path.abspath(__file__))
ruta_fotos = os.path.join(ruta_actual, 'fotos')

if not os.path.exists(ruta_fotos):
    print("Error: No encuentro la carpeta 'fotos'. Asegúrate de crearla junto a este archivo de Python.")
else:
    # Filtra solo las imágenes
    archivos = [f for f in os.listdir(ruta_fotos) if f.lower().endswith(('.png', '.jpg', '.jpeg', '.webp'))]
    
    recuerdos = []
    for archivo in archivos:
        recuerdos.append({
            "src": f"fotos/{archivo}",
            "txt": "Feliz cumpleaños, te amo." # Texto por defecto, lo puedes cambiar después en el JS
        })
    
    # Crea el archivo de JavaScript automáticamente
    ruta_js = os.path.join(ruta_actual, 'fotos.js')
    with open(ruta_js, 'w', encoding='utf-8') as f:
        f.write("const recuerdos = ")
        json.dump(recuerdos, f, indent=4, ensure_ascii=False)
        f.write(";")
        
    print(f"¡Éxito! Se detectaron {len(archivos)} fotos y se guardaron en 'fotos.js'.")