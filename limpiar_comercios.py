import json
import os

# Configuración
archivos_entrada = ['datos_raw/lista1.txt', 'datos_raw/lista2.txt']
archivo_salida = 'backend/comercios.json'

comercios_limpios = []

def normalizar_cadena(nombre):
    nombre = nombre.upper()
    cadenas = {
        'CARREFOUR': 'Carrefour', 'COTO': 'Coto', 'JUMBO': 'Jumbo',
        'VEA': 'Vea', 'DISCO': 'Disco', 'DIA': 'Día',
        'CHANGOMAS': 'Changomas', 'WALMART': 'Walmart',
        'MAKRO': 'Makro', 'VITAL': 'Vital', 'LA ANONIMA': 'La Anónima'
    }
    for clave, valor in cadenas.items():
        if clave in nombre:
            return valor
    return 'Independiente'

print("🔄 Procesando archivos...")

for archivo in archivos_entrada:
    if not os.path.exists(archivo):
        continue
        
    with open(archivo, 'r', encoding='utf-8') as f:
        lineas = f.readlines()
        
    for linea in lineas:
        partes = linea.strip().split(',')
        if len(partes) >= 3:
            # Intentar extraer datos (ajustar según formato real)
            # Este es un ejemplo básico, puede necesitar ajustes
            direccion = partes[0].strip()
            localidad = partes[1].strip() if len(partes) > 1 else ""
            provincia = partes[2].strip() if len(partes) > 2 else ""
            nombre_comercio = partes[3].strip() if len(partes) > 3 else "Sin Nombre"
            
            cadena = normalizar_cadena(nombre_comercio)
            
            comercio = {
                "nombre": nombre_comercio,
                "cadena": cadena,
                "direccion": direccion,
                "localidad": localidad,
                "provincia": provincia,
                "activo": True
            }
            comercios_limpios.append(comercio)

# Guardar resultado
os.makedirs(os.path.dirname(archivo_salida), exist_ok=True)
with open(archivo_salida, 'w', encoding='utf-8') as f:
    json.dump({"comercios": comercios_limpios, "total": len(comercios_limpios)}, f, indent=2, ensure_ascii=False)

print(f"✅ ¡Listo! Se procesaron {len(comercios_limpios)} comercios.")
print(f"📁 Archivo guardado en: {archivo_salida}")
